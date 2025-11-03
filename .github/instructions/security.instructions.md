<!-- Inspired by: https://github.com/github/awesome-copilot/blob/main/docs/README.collections.md -->
---
applyTo: "**/*"
description: "Security best practices for RaiPlaySoundRSS"
---
# Security Guidelines

## Input and Output
- Validate and normalize route parameters; avoid trusting external inputs.
- Avoid exposing internal details in error messages; prefer clear, minimal responses.

## Dependencies and Secrets
- Keep dependencies minimal and updated regularly.
- Do not commit secrets; use environment variables and scoped runtime configuration.

## HTTP and Middleware
- Set appropriate headers and enforce Content-Type negotiation strictly.
- Fail closed on unacceptable content types (return 406) and unexpected parsing errors.

## Operational Safety
- Prefer idempotent, stateless request handling to reduce surface area.
- Log essential context without sensitive data to aid debugging.