import Fastify, { FastifyInstance, FastifyRequest, FastifyReply, FastifyServerOptions } from 'fastify';
import compress from '@fastify/compress';
import fastifyCaching from '@fastify/caching';
import { generateProgrammaFeed } from './RaiPlaySoundRSS';

export async function buildApp(opts: Partial<FastifyServerOptions> = {}): Promise<FastifyInstance> {
  const app = Fastify({
    trustProxy: true, // Enable trust proxy for x-forwarded headers
    ...opts,
    logger: opts.logger ?? true // Conditional logger configuration
  });

  // Register plugins
  await app.register(compress);
  
  // Cache configuration matching original Express setup (1-minute TTL)
  // 'private' = per-client caching (not shared between clients)
  // expiresIn = 60 seconds, same as apicache('1 minute') in Express version
  await app.register(fastifyCaching, { 
    privacy: 'private',
    expiresIn: 60 // 60 seconds = 1 minute
  });

  // Add hook to construct public URL from request using trustProxy
  app.addHook('onRequest', async (request: FastifyRequest) => {
    // When trustProxy is enabled, Fastify automatically provides:
    // - request.protocol (https/http from X-Forwarded-Proto or socket)
    // - request.host (from X-Forwarded-Host or Host header)
    // - request.ip (real client IP from X-Forwarded-For)
    
    // Construct the public URL using official Fastify properties
    const publicUrl = `${request.protocol}://${request.host}${request.url}`;
    const urlBase = `${request.protocol}://${request.host}`;
    
    // Add to request object using declaration merging types
    request.publicUrl = publicUrl;
    request.urlBase = urlBase;
    request.clientIp = request.ip;
  });

  // Route handler
  const handler = async (request: FastifyRequest<{
    Params: { servizio?: string; programma: string }
  }>, reply: FastifyReply) => {
    try {
      // Check Accept header for supported content types using proper parsing
      const acceptHeader = request.headers.accept || '';
      const supportedTypes = ['text/xml', 'application/xml', 'application/rss+xml'];
      
      // Split Accept header by comma and check each media type
      const acceptedTypes = acceptHeader.split(',').map(type => type.trim().toLowerCase());
      const acceptedType = supportedTypes.find(type => 
        acceptedTypes.some(accepted => accepted.startsWith(type))
      ) || (acceptedTypes.some(accepted => accepted.startsWith('*/*')) ? 'application/rss+xml' : null);
      
      if (!acceptedType) {
        reply.code(406).send();
        return;
      }
      
      reply.header('Content-Type', acceptedType);
      
      // Set cache headers for @fastify/caching
      reply.header('Cache-Control', 'private, max-age=60');
      
      const feed = await generateProgrammaFeed(request.params, { 
        feedUrl: request.publicUrl
      });
      
      reply.send(feed);
    } catch (error) {
      app.log.error(error);
      reply.code(500).send(error);
    }
  };

  // Register routes
  app.get('/:servizio/:programma', handler);
  app.get('/:programma', handler);

  return app;
}

export default buildApp;
