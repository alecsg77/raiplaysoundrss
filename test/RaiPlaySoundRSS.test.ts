// Mock global fetch
const mockFetch = jest.fn();
let originalFetch: typeof global.fetch;

import { generateProgrammaFeed } from '../src/RaiPlaySoundRSS';
import { mockProgrammaInfo, mockAudiolibroInfo } from './fixtures';

describe('RaiPlaySoundRSS', () => {
  beforeEach(() => {
    // Save and mock global.fetch before each test
    originalFetch = global.fetch;
    global.fetch = mockFetch as any;
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Restore original global.fetch after each test
    global.fetch = originalFetch;
  });
  describe('generateProgrammaFeed', () => {
    it('should generate RSS feed for programma', async () => {
      // Mock API response - need to mock all the calls in sequence
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockProgrammaInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-podcast' 
      }, { 
        feedUrl: 'http://localhost:3000/test-podcast' 
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        href: expect.stringContaining('/programmi/test-podcast.json')
      }));
      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        href: expect.stringContaining('/audiolibri/test-podcast.json')
      }));
      expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(feed).toContain('version="2.0"');
      expect(feed).toContain('<title><![CDATA[Test Podcast]]></title>');
      expect(feed).toContain('<description><![CDATA[A test podcast description]]></description>');
      expect(feed).toContain('<link>https://www.raiplaysound.it/programmi/test-podcast</link>');
      expect(feed).toContain('<language><![CDATA[it-it]]></language>');
      expect(feed).toContain('<copyright><![CDATA[Rai - Radiotelevisione Italiana Spa]]></copyright>');
      expect(feed).toContain('<generator>RaiPlay Sound</generator>');
    });

    it('should generate RSS feed for programma with servizio and programma', async () => {
      const mockJson = jest.fn().mockResolvedValue(mockProgrammaInfo);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: mockJson
      } as any);

      const feed = await generateProgrammaFeed({ 
        servizio: 'test-service',
        programma: 'test-program'
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        href: expect.stringContaining('/test-service/test-program.json')
      }));
      expect(mockJson).toHaveBeenCalled();
      expect(feed).toContain('<title><![CDATA[Test Podcast]]></title>');
    });

    it('should fallback to audiolibri endpoint when programmi fails', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockAudiolibroInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-audiolibro' 
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        href: expect.stringContaining('/programmi/test-audiolibro.json')
      }));
      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        href: expect.stringContaining('/audiolibri/test-audiolibro.json')
      }));
      expect(feed).toContain('<title><![CDATA[Test Audiolibro]]></title>');
      expect(feed).toContain('<itunes:author>Rai Radio 3</itunes:author>');
      expect(feed).toContain('<description><![CDATA[Un audiolibro di prova della letteratura italiana]]></description>');
      expect(feed).toContain('<title><![CDATA[Capitolo 1]]></title>');
      expect(feed).toContain('<description><![CDATA[Il primo capitolo del nostro audiolibro]]></description>');
      expect(feed).toContain('<itunes:duration>00:45:15</itunes:duration>');
    });

    it('should include episode items in RSS feed', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockProgrammaInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-podcast' 
      });

      expect(feed).toContain('<title><![CDATA[Test Episode 1]]></title>');
      expect(feed).toContain('<description><![CDATA[First test episode description]]></description>');
      expect(feed).toContain('<guid isPermaLink="false">test-episode-1</guid>');
      expect(feed).toContain('type="audio/mpeg"');
      expect(feed).toContain('<itunes:duration>00:15:30</itunes:duration>');
      expect(feed).toContain('<itunes:explicit>no</itunes:explicit>');
    });

    it('should convert .htm to .mp3 in audio URLs', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockProgrammaInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-podcast' 
      });

      // Check that audio URLs are converted from .htm to .mp3
      const feedXml = feed;
      expect(feedXml).toMatch(/<enclosure[^>]*url="[^"]*\.mp3[^"]*"/);
      expect(feed).toContain('.mp3?cont=test1-dl');
      expect(feed).not.toContain('.htm?cont=test1-dl');
    });

    it('should set iTunes explicit to no for all content', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockProgrammaInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-podcast' 
      });

      const explicitMatches = feed.match(/<itunes:explicit>no<\/itunes:explicit>/g);
      expect(explicitMatches).toBeTruthy();
      expect(explicitMatches!.length).toBeGreaterThan(0);
    });

    it('should include feedUrl when provided in options', async () => {
      const feedUrl = 'http://example.com/almanaccomafioso';
      
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockProgrammaInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-podcast' 
      }, { feedUrl });

      expect(feed).toContain(`<atom:link href="${feedUrl}"`);
    });

    it('should throw error when all API endpoints fail', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        } as any);

      await expect(generateProgrammaFeed({ 
        programma: 'test-podcast' 
      })).rejects.toThrow();
    });

    it('should validate input parameters to prevent SSRF attacks', async () => {
      // Test invalid servizio parameter
      await expect(generateProgrammaFeed({ 
        servizio: '../../../etc/passwd',
        programma: 'test'
      })).rejects.toThrow('Invalid servizio parameter');

      // Test invalid programma parameter
      await expect(generateProgrammaFeed({ 
        programma: 'test/../../../etc/passwd'
      })).rejects.toThrow('Invalid programma parameter');

      // Test valid parameters should not throw validation errors
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockProgrammaInfo)
      } as any);

      await expect(generateProgrammaFeed({ 
        programma: 'valid-program-name'
      })).resolves.toBeDefined();
    });
  });
});
