import request from 'supertest';
import express from 'express';
import publicUrl from '../src/publicUrl';

describe('publicUrl middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(publicUrl(true)); // Enable debug mode for testing
    app.get('/test', (req, res) => {
      res.json({
        publicUrl: req.publicUrl,
        urlBase: req.urlBase,
        baseUrl: req.app.locals.baseUrl,
        protocol: req.app.locals.protocol,
        domain: req.app.locals.domain
      });
    });
  });

  it('should set publicUrl for simple request', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'localhost:3000')
      .expect(200);

    expect(response.body.publicUrl).toBe('http://localhost:3000/test');
    expect(response.body.urlBase).toBe('http://localhost:3000');
    expect(response.body.protocol).toBe('http');
    expect(response.body.domain).toBe('localhost:3000');
  });

  it('should handle x-forwarded-proto header', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'example.com')
      .set('x-forwarded-proto', 'https')
      .expect(200);

    expect(response.body.publicUrl).toBe('https://example.com/test');
    expect(response.body.protocol).toBe('https');
  });

  it('should handle x-forwarded-host header', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'internal.example.com')
      .set('x-forwarded-host', 'public.example.com')
      .expect(200);

    expect(response.body.publicUrl).toBe('http://public.example.com/test');
    expect(response.body.domain).toBe('public.example.com');
  });

  it('should handle x-forwarded-port header', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'example.com:8080')
      .set('x-forwarded-port', '443')
      .set('x-forwarded-proto', 'https')
      .expect(200);

    expect(response.body.publicUrl).toBe('https://example.com/test');
    expect(response.body.domain).toBe('example.com');
  });

  it('should remove default ports for https', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'example.com')
      .set('x-forwarded-proto', 'https')
      .set('x-forwarded-port', '443')
      .expect(200);

    expect(response.body.publicUrl).toBe('https://example.com/test');
    expect(response.body.domain).toBe('example.com');
  });

  it('should remove default ports for http', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'example.com')
      .set('x-forwarded-proto', 'http')
      .set('x-forwarded-port', '80')
      .expect(200);

    expect(response.body.publicUrl).toBe('http://example.com/test');
    expect(response.body.domain).toBe('example.com');
  });

  it('should preserve non-default ports', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'example.com')
      .set('x-forwarded-proto', 'https')
      .set('x-forwarded-port', '8443')
      .expect(200);

    expect(response.body.publicUrl).toBe('https://example.com:8443/test');
    expect(response.body.domain).toBe('example.com:8443');
  });

  it('should handle comma-separated header values', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'example.com')
      .set('x-forwarded-proto', 'https,http')
      .set('x-forwarded-host', 'public.example.com,internal.example.com')
      .expect(200);

    expect(response.body.publicUrl).toBe('https://public.example.com/test');
    expect(response.body.protocol).toBe('https');
    expect(response.body.domain).toBe('public.example.com');
  });

  it('should include x-public-url header in debug mode', async () => {
    const response = await request(app)
      .get('/test')
      .set('Host', 'localhost:3000')
      .expect(200);

    expect(response.headers['x-public-url']).toBe('http://localhost:3000/test');
  });
});
