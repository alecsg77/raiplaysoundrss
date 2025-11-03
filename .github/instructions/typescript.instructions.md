<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
applyTo: "**/*.ts,**/*.mts,**/*.cts"
description: "TypeScript + Express service guidelines for RaiPlaySoundRSS"
---
# TypeScript and Express Guidelines

Apply the [testing](./testing.instructions.md), [security](./security.instructions.md), [performance](./performance.instructions.md), [documentation](./documentation.instructions.md), and [code review](./code-review.instructions.md) guidelines to all code.

## Language and Types
- Enable strict typing throughout; define comprehensive types for RaiPlaySound API responses in dedicated `.d.ts` files.
- Prefer explicit return types for public functions and clear interfaces for data structures.
- Use immutable patterns where feasible (readonly, const) and avoid mutating shared state.

## Project Structure
- Keep modules small and focused (e.g., request handling, transformation, URL helpers).
- Encapsulate URL construction (`weblink`, `image`, `audio`) and keep them pure and deterministic.
- Separate middleware (e.g., `publicUrl`) from route handlers for clarity and testability.

## Express Patterns
- Use clear route registrations and avoid optional parameters in a single path when it harms clarity; keep Express 5 compatibility in mind.
- Prefer dependency injection for external calls to facilitate testing.
- Centralize error mapping and response shape; propagate meaningful HTTP status codes.

## Domain Rules
- Format dates using Italian conventions (“DD MMM YYYY”).
- Always set iTunes `explicit` to “no” for all content.
- Enforce Content-Type negotiation; return 406 when requests are not acceptable.

## Reliability and Readability
- Use descriptive names, camelCase, and consistent file naming conventions.
- Prefer composition over inheritance; avoid deep class hierarchies.
- Keep control flow simple and explicit; avoid complex promise chains when a small async function suffices.
