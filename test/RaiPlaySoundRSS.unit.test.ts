// Mock node-fetch
const mockFetch = jest.fn();
jest.mock('node-fetch', () => mockFetch);

import { generateProgrammaFeed } from '../src/RaiPlaySoundRSS';
import { mockProgrammaInfo, mockAudiolibroInfo } from './fixtures';

// Mock fetch globally
global.fetch = mockFetch as any;

describe('RaiPlaySoundRSS Unit Tests', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('generateProgrammaFeed', () => {
    it('should generate RSS feed for programma', async () => {
      // Mock API response
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
    });

    it('should generate RSS feed for servizio and programma', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockProgrammaInfo)
      } as any);

      const feed = await generateProgrammaFeed({ 
        servizio: 'test-service',
        programma: 'test-program'
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        href: expect.stringContaining('/test-service/test-program.json')
      }));
      expect(feed).toContain('<title><![CDATA[Test Podcast]]></title>');
    });

    it('should fallback to audiolibri endpoint', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 404 } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockAudiolibroInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-audiolibro' 
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(expect.objectContaining({
        href: expect.stringContaining('/audiolibri/test-audiolibro.json')
      }));
      expect(feed).toContain('<title><![CDATA[Test Audiolibro]]></title>');
    });

    it('should include episode items in RSS feed', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 404 } as any)
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
      expect(feed).toContain('<enclosure url="https://mediapolis.rai.it/relinker/relinkerServlet.mp3?cont=test1-dl"');
      expect(feed).toContain('type="audio/mpeg"');
      expect(feed).toContain('<itunes:duration>00:15:30</itunes:duration>');
      expect(feed).toContain('<itunes:explicit>no</itunes:explicit>');
    });

    it('should convert .htm to .mp3 in audio URLs', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 404 } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockProgrammaInfo)
        } as any);

      const feed = await generateProgrammaFeed({ 
        programma: 'test-podcast' 
      });

      expect(feed).toContain('.mp3?cont=test1-dl');
      expect(feed).not.toContain('.htm?cont=test1-dl');
    });

    it('should set iTunes explicit to no for all content', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 404 } as any)
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

    it('should include feedUrl when provided', async () => {
      const feedUrl = 'http://example.com/test-podcast';
      
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 404 } as any)
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
  });
});
