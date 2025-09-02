import { FastifyInstance, FastifyRequest } from 'fastify';
import { buildApp } from '../src/app';

// Helper to build a Fastify app instance with the test route registered
async function buildTestApp(): Promise<FastifyInstance> {
  const app = await buildApp({ logger: false });
  app.get('/test-ip', async (request: FastifyRequest, reply) => {
    return { clientIp: request.clientIp };
  });
  return app;
}

describe('Client IP Extraction', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Client IP detection with trustProxy', () => {
    it('should extract client IP from X-Forwarded-For header', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-ip',
        headers: {
          'X-Forwarded-For': '203.0.113.195, 198.51.100.178',
          'Host': 'api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      const result = response.json();
      expect(result.clientIp).toBe('203.0.113.195'); // Should be the first (client) IP
    });

    it('should use direct connection IP when no proxy headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-ip',
        headers: {
          'Host': 'localhost'
        }
      });

      expect(response.statusCode).toBe(200);
      const result = response.json();
      expect(result.clientIp).toBeDefined();
      // For inject(), this will be a localhost IP
      expect(result.clientIp).toMatch(/^(127\.0\.0\.1|::ffff:127\.0\.0\.1|::1)$/);
    });

    it('should handle single IP in X-Forwarded-For', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-ip',
        headers: {
          'X-Forwarded-For': '203.0.113.195',
          'Host': 'api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      const result = response.json();
      expect(result.clientIp).toBe('203.0.113.195');
    });

    it('should handle X-Real-IP header (common with Nginx)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-ip',
        headers: {
          'X-Real-IP': '203.0.113.100',
          'X-Forwarded-For': '203.0.113.100',
          'Host': 'api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      const result = response.json();
      expect(result.clientIp).toBe('203.0.113.100');
    });

    it('should handle IPv6 addresses', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/test-ip',
        headers: {
          'X-Forwarded-For': '2001:db8::1, 2001:db8::2',
          'Host': 'api.example.com'
        }
      });

      expect(response.statusCode).toBe(200);
      const result = response.json();
      expect(result.clientIp).toBe('2001:db8::1'); // First IPv6 address
    });
  });
});
