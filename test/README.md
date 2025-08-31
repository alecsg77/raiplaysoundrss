# Test Suite Documentation

## Overview
Comprehensive test suite for RaiPlaySoundRSS service covering RSS generation, HTTP handling, and reverse proxy scenarios.

## Test Files

### `RaiPlaySoundRSS.test.ts`
- **Purpose**: Unit tests for RSS feed generation logic
- **Coverage**: RSS XML generation, URL transformations, Italian date formatting
- **Mock Strategy**: Uses fixtures for RaiPlaySound API responses

### `server.test.ts`
- **Purpose**: Integration tests for HTTP endpoints
- **Coverage**: Content-type negotiation, error handling, route parameters
- **Test Method**: Uses Fastify's `inject()` method for HTTP simulation

### `reverse-proxy.test.ts`
- **Purpose**: Tests reverse proxy scenarios and `feedUrl` calculation
- **Coverage**: 
  - X-Forwarded-Proto/Host headers
  - Real-world proxy configurations (Nginx, HAProxy, CDN)
  - URL encoding, query parameters
  - Edge cases and error handling
- **Focus**: Ensures `feedUrl` is correctly calculated for RSS feed self-reference

### `client-ip.test.ts`
- **Purpose**: Tests client IP extraction with `trustProxy` enabled
- **Coverage**: 
  - X-Forwarded-For header parsing
  - X-Real-IP support (Nginx)
  - IPv4/IPv6 handling
  - Direct connection fallback

## Key Testing Patterns

### Fastify Testing with `inject()`
```typescript
const response = await app.inject({
  method: 'GET',
  url: '/test-route',
  headers: {
    'Accept': 'application/rss+xml',
    'X-Forwarded-Proto': 'https',
    'X-Forwarded-Host': 'api.example.com'
  }
});
```

### Reverse Proxy Simulation
Tests simulate various proxy configurations:
- **Nginx**: `X-Forwarded-Proto`, `X-Forwarded-Host`, `X-Real-IP`
- **HAProxy**: Standard forwarded headers
- **CloudFlare**: CF-specific headers alongside standard ones

### Mock Strategy
- RSS generation is mocked to focus on HTTP/proxy behavior
- Fixtures provide realistic RaiPlaySound API responses
- Custom implementations test specific parameter passing

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- test/reverse-proxy.test.ts

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Test Scenarios Covered

### Basic HTTP
- Default host/protocol detection
- Various host formats (with/without ports)
- IPv6 host handling

### Reverse Proxy Headers
- Single and multiple X-Forwarded-Proto values
- X-Forwarded-Host overriding Host header
- Complex proxy chains

### Real-World Configurations
- Production Nginx setup
- HAProxy with TLS termination  
- CDN/CloudFlare scenarios
- Internal service to public API mapping

### Edge Cases
- Missing headers
- Empty header values
- URL encoding preservation
- Query parameter handling
- Error scenarios

## Expected Behavior

When `trustProxy: true` is enabled in Fastify:
- `request.protocol` → derived from X-Forwarded-Proto or socket
- `request.host` → derived from X-Forwarded-Host or Host header  
- `request.ip` → real client IP from X-Forwarded-For
- `feedUrl` → `${protocol}://${host}${request.url}`

This ensures RSS feeds contain correct self-referencing URLs regardless of proxy configuration.
