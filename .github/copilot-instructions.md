# RaiPlaySoundRSS Copilot Instructions

## Project Overview
A TypeScript Express.js service that converts RaiPlaySound podcast metadata into RSS feeds. Single-purpose microservice with minimal dependencies.

## Architecture
- **Entry point**: `src/server.ts` - Express app with single route `/:servizio/:programma?`
- **Core logic**: `src/RaiPlaySoundRSS.ts` - Fetches JSON from RaiPlaySound API and converts to RSS using `podcast` library
- **API pattern**: Tries multiple URL patterns (`/programmi/`, `/audiolibri/`) when initial fetch fails
- **Caching**: 1-minute HTTP response cache via `apicache` middleware

## Key Data Flow
1. Client requests `/{podcast_id}` or `/{servizio}/{programma}`
2. `fetchProgramma()` tries RaiPlaySound endpoints in sequence
3. `toFeed()` transforms JSON to RSS using iTunes podcast standards
4. Response cached for 1 minute, served with proper Content-Type negotiation

## Development Workflows
```bash
npm run watch        # Development with nodemon
npm run build        # Lint + esbuild bundle 
npm run start        # Build + run production
```

## TypeScript Patterns
- **Type definitions**: `src/RaiPlaySound.d.ts` contains extensive API response types
- **URL construction**: Helper functions `weblink()`, `image()`, `audio()` handle RaiPlaySound URL patterns
- **Express extensions**: Custom middleware in `src/publicUrl.ts` adds `req.publicUrl` property

## External Dependencies
- **RaiPlaySound API**: `https://www.raiplaysound.it/{category}/{id}.json`
- **Audio URLs**: Transforms `.htm` to `.mp3` in audio URLs
- **Image/link resolution**: All relative URLs converted to absolute using `baseUrl`

## Docker Deployment
Multi-stage build: compile TypeScript → minimal Alpine runtime. Uses `tini` for signal handling.

## Critical Conventions
- All Italian podcast metadata (dates use "DD MMM YYYY" Italian format)
- iTunes explicit flag always set to "no" for all content
- Error handling: Falls through multiple API endpoint attempts before failing
- Content-Type negotiation: Accepts XML variants, returns 406 if not supported
