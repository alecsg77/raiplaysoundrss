<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
applyTo: "**/*.test.ts,**/*.spec.ts"
description: "Testing strategy for RaiPlaySoundRSS using Jest and Supertest"
---
# Testing Guidelines

## Strategy
- Unit tests: Cover RSS transformation logic, URL helpers, and failure fallbacks across endpoint patterns.
- Integration tests: Use Supertest for HTTP endpoints, including content negotiation and caching behavior.
- Middleware tests: Validate `publicUrl` behavior and header propagation comprehensively.

## Practices
- Use fixtures from `test/fixtures.ts` to ensure stable, representative inputs.
- Prefer high-signal assertions on response headers (e.g., Content-Type) and status codes.
- Aim for meaningful coverage thresholds that reflect reliability for core transformation paths.

## Organization
- Keep tests near the code under test or within a mirrored `test/` tree for clarity.
- Name test files consistently (`*.test.ts`) and group related cases logically.
- Use focused test descriptions that explain intent and domain constraints.

## Execution
- Provide fast feedback via `npm run test:watch` locally.
- Track coverage via `npm run test:coverage` and prioritize critical paths.