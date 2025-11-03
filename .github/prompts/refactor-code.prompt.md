<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
mode: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'search']
description: 'Refactor for clarity and testability with zero behavior change'
---
Refactor target code to improve clarity without changing behavior.

Guidelines:
- Preserve API contracts, status codes, and headers
- Extract small, pure helpers for URL construction and formatting
- Flatten control flow; reduce branching with clear early returns
- Maintain and update relevant tests and docs

Deliverables:
- Refactor plan (small steps)
- Risk assessment and quick rollback strategy
- Post-refactor test focus areas
