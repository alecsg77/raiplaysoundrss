<!--
SYNC IMPACT REPORT
==================
Version change: [TEMPLATE] → 1.0.0
Modified principles: None (initial creation from template)
Added sections:
  - Core Principles (5 principles)
  - Technology Stack and Constraints
  - Development Workflow
  - Governance
Removed sections: None
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gates now derivable from this document
  ✅ .specify/templates/spec-template.md — no structural changes required
  ✅ .specify/templates/tasks-template.md — no structural changes required
  ✅ .specify/templates/constitution-template.md — template remains as-is
Follow-up TODOs: None
-->

# RaiPlaySoundRSS Constitution

## Core Principles

### I. Single-Purpose Transformation

This service has exactly one responsibility: fetch RaiPlaySound JSON metadata and
transform it into a valid, iTunes-compatible RSS 2.0 feed. No scope expansion is
permitted without an explicit architectural decision.

- The service MUST expose only two route patterns: `/:servizio/:programma` and
  `/:programma`.
- All transformation logic MUST live in `RaiPlaySoundRSS.ts`; route handling MUST
  stay in `server.ts`.
- New data sources or output formats MUST be discussed and justified before
  introduction; the default answer is "no".

**Rationale**: Complexity creep is the primary risk for a focused microservice.
Keeping a hard boundary on scope ensures the service remains predictable, easy to
test, and simple to operate.

### II. Strict TypeScript and Explicit Typing

All source code MUST be written in TypeScript with `strict: true` and
`noImplicitAny: true` enabled. External API shapes MUST be declared in dedicated
`.d.ts` files (e.g., `RaiPlaySound.d.ts`).

- Public functions MUST carry explicit return types.
- The `any` type MUST NOT appear in production code without a suppression comment
  explaining the justification.
- Immutable patterns (e.g., `readonly`, `const`) MUST be preferred where feasible.

**Rationale**: Strict typing catches entire classes of runtime errors at compile
time and makes external API contracts explicit and reviewable.

### III. Content Integrity and iTunes Compatibility

The RSS output MUST conform to iTunes podcast feed specifications at all times.

- The `itunes:explicit` field MUST always be set to `"no"` for the channel and all
  feed items.
- Episode dates MUST be parsed using Italian locale conventions:
  `"DD MMM YYYY"` (Italian literal, e.g., `literal_publication_date`) or
  `"DD-MM-YYYY hh:mm:ss"` (structured API date, e.g., `block.update_date`).
- Audio URLs MUST have `.htm` extensions replaced with `.mp3` before inclusion in
  the enclosure element.
- The language field MUST be set to `"it-it"`.
- Copyright MUST be `"Rai - Radiotelevisione Italiana Spa"`.

**Rationale**: Feed correctness is the primary value delivered to end users. Any
deviation silently breaks podcast clients without a visible error signal.

### IV. Defensive Input Handling and Content Negotiation

All route parameters MUST be validated before use in outbound HTTP requests.
Responses MUST negotiate content type strictly.

- Route parameters (`servizio`, `programma`) MUST match `^[a-z0-9-]+$/i`; invalid
  parameters MUST cause an immediate error before any external request is made.
- The server MUST return `406 Not Acceptable` when the client's `Accept` header
  does not include `text/xml`, `application/xml`, or `application/rss+xml`.
- Fetch operations MUST attempt `/programmi/{programma}.json` first; if that fails,
  the single-parameter route MUST fall back to `/audiolibri/{programma}.json`.
- Errors from upstream MUST propagate through Express error handling (`next(error)`)
  rather than being swallowed silently.

**Rationale**: Input validation prevents SSRF attacks. Content negotiation keeps
the API contract explicit. Fallback logic ensures audiobooks are reachable via the
same endpoint pattern as programmes.

### V. Test Coverage for Critical Paths

Every critical transformation path, route handler, and middleware behavior MUST
have automated test coverage using Jest (unit) and Supertest (integration).

- Unit tests MUST cover: feed generation, URL helpers (`weblink`, `image`, `audio`),
  input validation, fallback logic, and iTunes explicit flag handling.
- Integration tests MUST cover: content negotiation, HTTP status codes, `publicUrl`
  middleware propagation, and error responses.
- Fixtures in `test/fixtures.ts` MUST be used as the canonical representation of
  RaiPlaySound API responses.
- Tests MUST be run with `npm run test:ci` in CI; coverage reports MUST be
  generated via `npm run test:coverage`.

**Rationale**: Automated tests are the safety net for a service consumed by podcast
clients. A regression in transformation or routing can silently corrupt feeds for
all subscribers.

## Technology Stack and Constraints

The following technology choices are fixed and MUST NOT be replaced without a
formal architectural decision documented in the changelog:

- **Runtime**: Node.js (latest LTS; currently Node 24 Alpine in Docker)
- **Language**: TypeScript 5.x with `strict: true`
- **Framework**: Express 5.x
- **Bundler**: esbuild (production build); ts-jest (test transpilation)
- **Caching**: `apicache` middleware; 1-minute TTL for all RSS responses
- **Logging**: `pino-http` + `pino-pretty` for HTTP request logging
- **Testing**: Jest + Supertest; no test framework changes without justification
- **Linting**: ESLint with `@typescript-eslint` rules; all lint errors MUST be
  resolved before merge
- **Versioning**: Semantic versioning via `release-please`; `CHANGELOG.md` MUST be
  kept up to date via Conventional Commits
- **Deployment**: Docker image; no structural changes to the Dockerfile without
  justification

Adding a new runtime dependency MUST be justified by a concrete need that cannot
be satisfied by the existing stack.

## Development Workflow

All contributions MUST follow this sequence before a PR can be merged:

1. **Lint**: `npm run lint` — zero ESLint errors permitted.
2. **Build**: `npm run build-ts` — TypeScript compilation MUST succeed with no
   errors.
3. **Test**: `npm run test:ci` — all tests MUST pass; coverage MUST NOT regress
   below the current baseline.
4. **Review**: PR description MUST reference the issue being addressed and
   summarize the behavioral change.
5. **Changelog**: Commit messages MUST follow
   [Conventional Commits](https://www.conventionalcommits.org/); `release-please`
   manages `CHANGELOG.md` automatically.

Breaking changes to the RSS output structure MUST be treated as a MAJOR version
bump. New optional capabilities are MINOR; bug fixes and dependency updates are
PATCH.

## Governance

This constitution supersedes all other guidelines and practices in this repository.
Any conflict between this document and other documentation is resolved in favor of
this constitution.

**Amendment Procedure**:

1. Open a GitHub issue describing the proposed change and its rationale.
2. Update the constitution in a PR; increment the version according to the semantic
   versioning rules in the version metadata line below.
3. Update `LAST_AMENDED_DATE` to the date of merge.
4. Propagate changes to dependent templates (`.specify/templates/`) as needed.

**Compliance Review**:

All pull request reviews MUST verify that the proposed changes comply with the
principles in this constitution. Violations require explicit documented justification
or the PR is blocked.

**Runtime Guidance**:

For day-to-day development guidance, refer to `.github/copilot-instructions.md`
and the prompt files in `.github/prompts/`.

**Version**: 1.0.0 | **Ratified**: 2026-03-14 | **Last Amended**: 2026-03-14
