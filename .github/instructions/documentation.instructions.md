<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
applyTo: "**/*.md,**/*.ts,**/*.mts,**/*.cts"
description: "Documentation standards for RaiPlaySoundRSS"
---
# Documentation Guidelines

## Code Documentation
- Use JSDoc comments for all public functions, classes, and complex logic.
- Include parameter types, return types, and descriptions.
- Document edge cases, assumptions, and design decisions inline.
- Keep comments concise and up-to-date with code changes.

## API Documentation
- Document all HTTP endpoints with path, method, parameters, and response formats.
- Include example requests and responses for clarity.
- Specify Content-Type expectations and negotiation behavior.
- Document error status codes and their meanings.

## README and Project Documentation
- Maintain an up-to-date README with setup, usage, and deployment instructions.
- Include environment variable documentation with examples.
- Document the RSS feed structure and iTunes compatibility.
- Provide clear examples of API endpoints and expected outputs.

## TypeScript Types
- Use descriptive type names that reflect domain concepts.
- Document complex type definitions with JSDoc comments.
- Keep type definitions in `.d.ts` files for external API shapes.
- Prefer explicit types over implicit inference for public APIs.

## Changelog
- Follow Keep a Changelog format for version history.
- Document breaking changes, new features, and bug fixes clearly.
- Use semantic versioning for releases.

## Inline Documentation
- Explain "why" rather than "what" for non-obvious code.
- Document Italian date formats and iTunes-specific conventions.
- Annotate RaiPlaySound API endpoint patterns and fallback logic.
- Keep comments meaningful and avoid stating the obvious.

## Documentation Maintenance
- Update documentation alongside code changes.
- Ensure examples remain accurate and runnable.
- Remove outdated comments and documentation promptly.
- Review documentation during code reviews for accuracy and completeness.
