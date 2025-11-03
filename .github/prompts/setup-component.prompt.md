<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
mode: 'agent'
model: Claude Sonnet 4
tools: ['githubRepo', 'codebase', 'search', 'fetch']
description: 'Scaffold a new Express route or middleware module aligned with project standards'
---
You will scaffold a new Express route or middleware for RaiPlaySoundRSS.

Ask for:
- Route path and parameters (e.g., /:servizio/:programma)
- Purpose (fetch variant, transform, or middleware concern)
- Inputs/outputs and headers (including Content-Type negotiation)
- Error behavior and caching requirements

Constraints:
- Follow TypeScript guidelines in ../instructions/typescript.instructions.md
- Keep modules small and testable; separate middleware and handlers
- Use existing URL helper patterns (weblink, image, audio)
- Respect domain rules (Italian dates, iTunes explicit="no")

Deliverables:
- Proposed file/module names and brief responsibilities
- Outline of test cases to add using write-tests.prompt.md
- Notes on edge cases and fallback behavior
