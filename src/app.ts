const fastify = require('fastify');
import compress from '@fastify/compress';
import fastifyCaching from '@fastify/caching';
import accepts from '@fastify/accepts';
import { generateProgrammaFeed } from './RaiPlaySoundRSS';

export async function buildApp(opts: any = {}): Promise<any> {
  const app = fastify({
    trustProxy: true, // Enable trust proxy for x-forwarded headers
    ...opts,
    logger: opts.logger ?? true // Enable logging by default (for production); allows tests to disable logging by passing opts.logger: false
  });

  // Register plugins
  await app.register(compress);
  await app.register(accepts);
  
  // Cache configuration matching original Express setup (1-minute TTL)
  // privacy: 'private' sets Cache-Control: private (cacheable by browsers, not shared caches)
  // expiresIn = 60 seconds, same as apicache('1 minute') in Express version
  await app.register(fastifyCaching, { 
    privacy: 'private',
    expiresIn: 60 // 60 seconds = 1 minute
  });

  // URL base caching to avoid repeated string concatenation per host
  const urlBaseCache = new Map<string, string>();

  // Add hook to construct public URL from request using trustProxy
  app.addHook('onRequest', async (request: any) => {
    // When trustProxy is enabled, Fastify automatically provides:
    // - request.protocol (https/http from X-Forwarded-Proto or socket)
    // - request.host (from X-Forwarded-Host or Host header)
    // - request.ip (real client IP from X-Forwarded-For)
    
    // Cache key to avoid repeated string concatenation for same host/protocol
    const cacheKey = `${request.protocol}://${request.host}`;
    
    // Get or cache urlBase (same for all requests with same protocol + host)
    let urlBase = urlBaseCache.get(cacheKey);
    if (!urlBase) {
      urlBase = cacheKey;
      urlBaseCache.set(cacheKey, urlBase);
    }
    
    // Construct the public URL (unique per request due to request.url)
    const publicUrl = `${urlBase}${request.url}`;
    
    // Add to request object using declaration merging types
    request.publicUrl = publicUrl;
    request.urlBase = urlBase;
    request.clientIp = request.ip;
  });

  // Route handler
  const handler = async (request: any, reply: any) => {
    try {
      // Check Accept header for supported content types using @fastify/accepts
      const supportedTypes = ['text/xml', 'application/xml', 'application/rss+xml'];
      const acceptedType = request.type(supportedTypes);
      
      if (!acceptedType) {
        reply.code(406).send();
        return;
      }
      
      // Set content type with charset for RSS/XML compatibility
      reply.header('Content-Type', `${acceptedType}; charset=utf-8`);
      
      // Cache headers are set automatically by @fastify/caching plugin
      
      const feed = await generateProgrammaFeed(request.params, { 
        feedUrl: request.publicUrl
      });
      
      reply.send(feed);
    } catch (error) {
      app.log.error(error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  };

  // Register routes
  app.get('/:servizio/:programma', handler);
  app.get('/:programma', handler);

  return app;
}

export default buildApp;
