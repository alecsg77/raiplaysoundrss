// Type definitions for @fastify/accepts
declare module 'fastify' {
  interface FastifyRequest {
    publicUrl: string;
    urlBase: string;
    clientIp: string;
    
    // @fastify/accepts plugin methods
    accepts(): unknown;
    type(types: string[]): string | false;
    types(): string[];
    charset(charsets: string[]): string | false;
    charsets(): string[];
    encoding(encodings: string[]): string | false;
    encodings(): string[];
    language(languages: string[]): string | false;
    languages(): string[];
  }
}