<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
description: "Project-wide GitHub Copilot instructions for RaiPlaySoundRSS (TypeScript + Express microservice)"
---

# RaiPlaySoundRSS — Copilot Instructions

These are the project-wide guardrails for Copilot usage in this repository. Apply these guidelines consistently across all code, reviews, and documentation.

## Scope and Intent
- Single-purpose TypeScript Express microservice that transforms RaiPlaySound JSON metadata into RSS using iTunes-compatible structures.
- Minimal dependencies, predictable behavior, and clear observability for API behavior and error conditions.

## Architecture Summary
- Entry Point: `src/server.ts` hosts Express routes for `/:servizio/:programma` and `/:servizio`.
- Core Logic: `src/RaiPlaySoundRSS.ts` fetches and transforms JSON to RSS using the `podcast` library.
- API Patterns: Attempt multiple RaiPlaySound endpoints (`/programmi/`, `/audiolibri/`) on failure.
- Caching: 1-minute cache via `apicache` with correct Content-Type negotiation.

## Development Conventions
- TypeScript strictness, clear types for external API shapes (see `src/RaiPlaySound.d.ts`).
- Prefer small, cohesive modules with explicit inputs/outputs.
- Respect Italian date formats (“DD MMM YYYY”) and set iTunes `explicit` flag to “no” for all content.
- Implement content negotiation consistently; return 406 when unacceptable.

## Testing Strategy (see testing instructions)
- Unit tests for transformation and URL helpers; integration tests for HTTP routes using Supertest.
- Fixtures in `test/fixtures.ts` mirror real RaiPlaySound responses.
- Track coverage, especially for middleware like `publicUrl`.

## Linked Guidelines
- Language: [TypeScript](./instructions/typescript.instructions.md)
- Testing: [Testing](./instructions/testing.instructions.md)
- Documentation: [Documentation](./instructions/documentation.instructions.md)
- Security: [Security](./instructions/security.instructions.md)
- Performance: [Performance](./instructions/performance.instructions.md)
- Review: [Code Review](./instructions/code-review.instructions.md)

## Copilot Usage
- Use prompts in `.github/prompts/` for repeatable tasks (tests, refactors, docs, reviews).
- Use chat modes in `.github/chatmodes/` for planning, review, and debugging workflows.
- Keep generated changes aligned with the instructions above; prefer composition, clear naming, and small diffs.