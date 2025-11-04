# RaiPlaySoundRSS

A high-performance TypeScript Fastify service that converts RaiPlaySound podcast metadata into RSS feeds.

## How to run the server locally using docker

1. Build a local image from the GitHub repository
```bash
docker build https://github.com/alecsg77/raiplaysoundrss.git -t raiplaysoundrss
```
2. Run the server on the port 3000
```bash
docker run --name raiplaysoundrss --rm -d -p 3000:3000 raiplaysoundrss
```

## How to get the RaiPlaySound podcast's RSS feed

1. Copy the podcast_id from the RaiPlaySound website.
Example: https://www.raiplaysound.it/programmi/***podcast_id***
2. Add the podcast to your favorite app using the URL of your server.
Example: http://localhost:3000/***podcast_id***

Currently tested on:
- iTunes
- [Podcast Addict](https://podcastaddict.com/)

## Development

### Requirements
- Node.js 18+
- npm

### Setup
```bash
npm install
```

### Development Scripts
```bash
npm run watch        # Development with hot reload
npm run build        # Lint + build for production
npm run start        # Build and run production server
npm test            # Run test suite
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Architecture Overview

The service follows Fastify best practices with a plugin-based architecture:

- **Entry Point**: `src/server.ts` - Server startup
- **App Factory**: `src/app.ts` - Testable application builder
- **Plugins**: `src/plugins/` - Modular functionality
  - `cache.ts` - Response caching (1-minute TTL)
  - `publicUrl.ts` - URL construction for RSS feeds
- **Core Logic**: `src/RaiPlaySoundRSS.ts` - RSS generation from RaiPlaySound API

### API Endpoints

- `GET /:programma` - Single parameter RSS feed
- `GET /:servizio/:programma` - Service + program RSS feed

Both endpoints support content negotiation for:
- `application/rss+xml`
- `application/xml`
- `text/xml`