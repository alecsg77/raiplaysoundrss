import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { httpLogger } from '../src/logger';
import publicUrl from '../src/publicUrl';

// Mock apicache middleware to avoid test environment issues
jest.mock('apicache', () => ({
  middleware: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));

// Import the mocked cache
import { middleware as cache } from 'apicache';

// Mock the RSS generation module
const mockGenerateProgrammaFeed = jest.fn();
jest.mock('../src/RaiPlaySoundRSS', () => ({
  generateProgrammaFeed: mockGenerateProgrammaFeed
}));

const mockRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title><![CDATA[Test Podcast]]></title>
    <description><![CDATA[A test podcast description]]></description>
    <link>https://www.raiplaysound.it/programmi/test-podcast</link>
    <language>it-it</language>
  </channel>
</rss>`;

// Create test app similar to server.ts
const createTestApp = () => {
  const app = express();
  app.use(compression());
  app.use(httpLogger);
  app.use(publicUrl());

  // Handle both single and double parameter routes - skip caching in tests
  const handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contentType = req.accepts(['text/xml', 'application/xml', 'application/rss+xml']);
      if (contentType === false) {
        res.status(406).end();
        return;
      }
      res.set('Content-Type', contentType);
      const feed = await mockGenerateProgrammaFeed(req.params, { feedUrl: req.publicUrl });
      res.send(feed);
    } catch (error) {
      next(error);
    }
  };

  app.get('/:servizio/:programma', handler);
  app.get('/:programma', handler);

  return app;
};

describe('Server Integration', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    mockGenerateProgrammaFeed.mockClear();
  });

  describe('GET /:programma', () => {
    it('should return RSS feed for single programma parameter', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      const response = await request(app)
        .get('/test-podcast')
        .set('Accept', 'application/rss+xml')
        .expect(200);

      expect(response.headers['content-type']).toBe('application/rss+xml; charset=utf-8');
      expect(response.text).toBe(mockRssXml);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ feedUrl: expect.stringContaining('/test-podcast') })
      );
    });

    it('should return RSS feed for servizio and programma parameters', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      const response = await request(app)
        .get('/test-service/test-program')
        .set('Accept', 'text/xml')
        .expect(200);

      expect(response.headers['content-type']).toBe('text/xml; charset=utf-8');
      expect(response.text).toBe(mockRssXml);
      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { servizio: 'test-service', programma: 'test-program' },
        expect.objectContaining({ feedUrl: expect.any(String) })
      );
    });

    it('should return 406 for unsupported Accept header', async () => {
      await request(app)
        .get('/test-podcast')
        .set('Accept', 'text/plain')
        .expect(406);

      expect(mockGenerateProgrammaFeed).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockGenerateProgrammaFeed.mockRejectedValue(new Error('API Error'));

      await request(app)
        .get('/test-podcast')
        .set('Accept', 'application/rss+xml')
        .expect(500);
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
        const response = await request(app)
          .get('/test-podcast')
          .set('Accept', acceptHeader)
          .expect(200);

        expect(['application/rss+xml; charset=utf-8', 'application/xml; charset=utf-8', 'text/xml; charset=utf-8'])
          .toContain(response.headers['content-type']);
      }
    });

    it('should include public URL in feed when available', async () => {
      mockGenerateProgrammaFeed.mockResolvedValue(mockRssXml);

      await request(app)
        .get('/test-podcast')
        .set('Accept', 'application/rss+xml')
        .set('Host', 'example.com:3000')
        .expect(200);

      expect(mockGenerateProgrammaFeed).toHaveBeenCalledWith(
        { programma: 'test-podcast' },
        expect.objectContaining({ feedUrl: 'http://example.com:3000/test-podcast' })
      );
    });
  });
});
