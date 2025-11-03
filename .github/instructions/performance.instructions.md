<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
applyTo: "**/*"
description: "Performance and reliability practices for RaiPlaySoundRSS"
---
# Performance Guidelines

## Caching and Requests
- Use short-lived HTTP response caching (e.g., 1 minute) for stability and freshness.
- Avoid redundant external calls; reuse computed values where possible within request scope.

## Efficiency
- Keep transformations linear and avoid unnecessary deep copies.
- Streamline JSON handling and avoid heavy in-memory structures for large payloads.

## Observability
- Measure latency at critical boundaries (external fetch, transform, respond).
- Prefer small, predictable responses and surface clear headers.