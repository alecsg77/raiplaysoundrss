import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

// Mock the RSS generation module first
jest.mock('../src/RaiPlaySoundRSS', () => ({
  generateProgrammaFeed: jest.fn()
}));

// Import the mock after mocking
import { generateProgrammaFeed } from '../src/RaiPlaySoundRSS';
const mockGenerateProgrammaFeed = generateProgrammaFeed as jest.MockedFunction<typeof generateProgrammaFeed>;

const mockRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title><![CDATA[Test Podcast]]></title>
    <description><![CDATA[A test podcast description]]></description>
    <link>https://www.raiplaysound.it/programmi/test-podcast</link>
    <language>it-it</language>
  </channel>
</rss>`;

describe('Server Integration', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp({ logger: false }); // Disable logging in tests
    mockGenerateProgrammaFeed.mockClear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /:programma', () => {
    it('should return RSS feed for single programma parameter', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/rss+xml');
      expect(response.body).toBe(mockRssXml);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ feedUrl: expect.stringContaining('/test-podcast') })
      );
    });

    it('should return RSS feed for servizio and programma parameters', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      const response = await app.inject({
        method: 'GET',
        url: '/test-service/test-program',
        headers: {
          'Accept': 'text/xml'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('text/xml');
      expect(response.body).toBe(mockRssXml);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'test-service', programma: 'test-program' },
        expect.objectContaining({ feedUrl: expect.any(String) })
      );
    });

    it('should return 406 for unsupported Accept header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'text/plain'
        }
      });

      expect(response.statusCode).toBe(406);
      expect(mockGenerateProgrammaFeed).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockGenerateProgrammaFeed.mockRejectedValue(new Error('API Error'));

      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml'
        }
      });

      expect(response.statusCode).toBe(500);
    });

    it('should use correct content-type negotiation', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      // Test different Accept headers
      const acceptHeaders = [
        'application/rss+xml',
        'application/xml', 
        'text/xml',
        'application/rss+xml, application/xml;q=0.8'
      ];

      for (const acceptHeader of acceptHeaders) {
        const response = await app.inject({
          method: 'GET',
          url: '/test-podcast',
          headers: {
            'Accept': acceptHeader
          }
        });

        expect(response.statusCode).toBe(200);
        expect(['application/rss+xml', 'application/xml', 'text/xml'])
          .toContain(response.headers['content-type']);
      }
    });

    it('should include public URL in feed when available', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'example.com:3000'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ feedUrl: 'http://example.com:3000/test-podcast' })
      );
    });
  });
});
