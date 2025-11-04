<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
mode: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'search']
description: 'Systematic debugging for route behavior and RSS generation'
---
Run a structured debug:

Ask for:
- Failing route or module and observed vs expected behavior
- Inputs, headers (Accept), and sample IDs
- Recent changes and environment context

Process:
- Reproduce with minimal inputs
- Isolate URL helpers, transform steps, and response headers
- Check fallbacks across endpoint patterns
- Propose targeted corrections and tests
