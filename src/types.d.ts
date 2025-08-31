import 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    urlBase?: string;
    publicUrl?: string;
    clientIp?: string;
  }
}
