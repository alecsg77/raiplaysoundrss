import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    publicUrl: string;
    urlBase: string;
    clientIp: string;
  }
}