<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
mode: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'search']
description: 'Generate Jest tests (unit + integration) for RaiPlaySoundRSS'
---
Generate tests for the specified module or route.

Ask for:
- Target file(s) and behaviors to verify
- Expected status codes, headers, and body shape
- Relevant fixtures from test/fixtures.ts

Requirements:
- Use Jest with node environment; integration tests via Supertest
- Cover transformation rules (dates, iTunes explicit) and URL helpers
- Verify content negotiation, 406 responses, and caching headers
- Keep tests focused and deterministic with fixtures

Output:
- Test plan summary
- Test file names and structure
- Clear assertions aligned to behavior