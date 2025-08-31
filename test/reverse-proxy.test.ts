import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';

// Mock the RSS generation module
jest.mock('../src/RaiPlaySoundRSS', () => ({
  generateProgrammaFeed: jest.fn()
}));

import { generateProgrammaFeed } from '../src/RaiPlaySoundRSS';
const mockGenerateProgrammaFeed = generateProgrammaFeed as jest.MockedFunction<typeof generateProgrammaFeed>;

const mockRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[Test Podcast]]></title>
    <description><![CDATA[A test podcast description]]></description>
  </channel>
</rss>`;

describe('Reverse Proxy and feedUrl Calculation', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp({ logger: false });
    mockGenerateProgrammaFeed.mockClear();
    mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Basic HTTP scenarios', () => {
    it('should construct feedUrl with default HTTP protocol and host', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'localhost:3000'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ 
          feedUrl: 'http://localhost:3000/test-podcast'
        })
      );
    });

    it('should handle different host formats', async () => {
      const testCases = [
        { host: 'api.example.com', expected: 'http://api.example.com/test-podcast' },
        { host: 'localhost', expected: 'http://localhost/test-podcast' },
        { host: '192.168.1.100:8080', expected: 'http://192.168.1.100:8080/test-podcast' },
        { host: '[::1]:3000', expected: 'http://[::1]:3000/test-podcast' }
      ];

      for (const testCase of testCases) {
        mockGenerateProgrammaFeed.mockClear();
        
        await app.inject({
          method: 'GET',
          url: '/test-podcast',
          headers: {
            'Accept': 'application/rss+xml',
            'Host': testCase.host
          }
        });

        expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
          { programma: 'test-podcast' },
          expect.objectContaining({ 
            feedUrl: testCase.expected
          })
        );
      }
    });
  });

  describe('X-Forwarded-Proto header scenarios', () => {
    it('should use HTTPS when X-Forwarded-Proto is https', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/secure-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com',
          'X-Forwarded-Proto': 'https'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'secure-podcast' },
        expect.objectContaining({ 
          feedUrl: 'https://api.example.com/secure-podcast'
        })
      );
    });

    it('should handle HTTP when X-Forwarded-Proto is http', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/insecure-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'internal.example.com',
          'X-Forwarded-Proto': 'http'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'insecure-podcast' },
        expect.objectContaining({ 
          feedUrl: 'http://internal.example.com/insecure-podcast'
        })
      );
    });

    it('should handle multiple X-Forwarded-Proto values (uses last one)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com',
          'X-Forwarded-Proto': 'http,https' // Multiple values, last one should be used
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ 
          feedUrl: 'https://api.example.com/test-podcast'
        })
      );
    });
  });

  describe('X-Forwarded-Host header scenarios', () => {
    it('should use X-Forwarded-Host when available', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/proxied-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'internal-server:8080',
          'X-Forwarded-Host': 'public-api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'proxied-podcast' },
        expect.objectContaining({ 
          feedUrl: 'http://public-api.example.com/proxied-podcast'
        })
      );
    });

    it('should combine X-Forwarded-Proto and X-Forwarded-Host', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/fully-proxied-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'backend.local:3000',
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Host': 'cdn.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'fully-proxied-podcast' },
        expect.objectContaining({ 
          feedUrl: 'https://cdn.example.com/fully-proxied-podcast'
        })
      );
    });

    it('should handle X-Forwarded-Host with port', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/port-test',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'internal:8080',
          'X-Forwarded-Host': 'external.example.com:443',
          'X-Forwarded-Proto': 'https'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'port-test' },
        expect.objectContaining({ 
          feedUrl: 'https://external.example.com:443/port-test'
        })
      );
    });
  });

  describe('Complex URL path scenarios', () => {
    it('should handle servizio/programma paths correctly', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/programmi/test-show',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com',
          'X-Forwarded-Proto': 'https'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'programmi', programma: 'test-show' },
        expect.objectContaining({ 
          feedUrl: 'https://api.example.com/programmi/test-show'
        })
      );
    });

    it('should handle encoded URLs', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/programmi/test%20show%20with%20spaces',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'programmi', programma: 'test show with spaces' }, // Fastify decodes params
        expect.objectContaining({ 
          feedUrl: 'http://api.example.com/programmi/test%20show%20with%20spaces' // But feedUrl keeps original URL
        })
      );
    });

    it('should handle query parameters in feedUrl', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast?format=rss&version=2.0',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com',
          'X-Forwarded-Proto': 'https'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ 
          feedUrl: 'https://api.example.com/test-podcast?format=rss&version=2.0'
        })
      );
    });
  });

  describe('Real-world proxy scenarios', () => {
    it('should handle Nginx reverse proxy setup', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/audio/morning-show',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'backend-server:3000', // Internal backend
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Host': 'podcasts.example.com', // Public domain
          'X-Forwarded-For': '203.0.113.195, 198.51.100.178', // Client IP chain
          'X-Real-IP': '203.0.113.195'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'audio', programma: 'morning-show' },
        expect.objectContaining({ 
          feedUrl: 'https://podcasts.example.com/audio/morning-show'
        })
      );
    });

    it('should handle HAProxy setup', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/shows/tech-talk',
        headers: {
          'Accept': 'application/xml',
          'Host': '10.0.0.5:3000', // Internal service
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Host': 'api.mycompany.com',
          'X-Forwarded-For': '192.0.2.146',
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'shows', programma: 'tech-talk' },
        expect.objectContaining({ 
          feedUrl: 'https://api.mycompany.com/shows/tech-talk'
        })
      );
    });

    it('should handle CDN/CloudFlare scenario', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/podcasts/daily-news',
        headers: {
          'Accept': 'text/xml',
          'Host': 'origin.internal.com',
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Host': 'cdn.example.com',
          'CF-Ray': '6c7b4e5f3e2d1c0b', // CloudFlare header
          'CF-Connecting-IP': '203.0.113.1'
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'podcasts', programma: 'daily-news' },
        expect.objectContaining({ 
          feedUrl: 'https://cdn.example.com/podcasts/daily-news'
        })
      );
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle missing Host header gracefully', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml'
          // No Host header
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ 
          feedUrl: expect.any(String)
        })
      );
    });

    it('should handle empty X-Forwarded headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com',
          'X-Forwarded-Proto': '',
          'X-Forwarded-Host': ''
        }
      });

      expect(response.statusCode).toBe(200);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ 
          feedUrl: 'http://api.example.com/test-podcast'
        })
      );
    });

    it('should verify clientIp is properly extracted', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'api.example.com',
          'X-Forwarded-For': '203.0.113.195, 198.51.100.178',
          'X-Real-IP': '203.0.113.195'
        }
      });

      expect(response.statusCode).toBe(200);
      // Note: We don't directly test clientIp in feedUrl, but this verifies 
      // that the request processing doesn't break with proxy IP headers
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ 
          feedUrl: 'http://api.example.com/test-podcast'
        })
      );
    });
  });

  describe('urlBase calculation', () => {
    it('should provide urlBase without path for RSS feed construction', async () => {
      // This test verifies that urlBase is correctly calculated for use in RSS feed links
      mockGenerateProgrammaFeed.mockImplementation((params, options) => {
        // The urlBase should be available but we're testing via feedUrl
        if (options) {
          expect(options.feedUrl).toMatch(/^https:\/\/api\.example\.com\/test-podcast$/);
        }
        return Promise.resolve(mockRssXml);
      });

      const response = await app.inject({
        method: 'GET',
        url: '/test-podcast',
        headers: {
          'Accept': 'application/rss+xml',
          'Host': 'internal.backend.com',
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Host': 'api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
