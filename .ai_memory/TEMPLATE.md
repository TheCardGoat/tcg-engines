# [Feature/Task Name]

> Copy this template to `.ai_memory/<your-branch-name>.md` and fill in the sections.
> **Date Format:** Use `YYYY-MM-DD` for all dates. Add new Implementation Log entries at the TOP (newest first).

## Context

| Field | Value |
|-------|-------|
| **Date Started** | YYYY-MM-DD |
| **Branch** | `feature/your-branch-name` |
| **Related Issues** | #123, #456 |
| **Author** | @username or AI Agent |

## Problem Statement

<!-- Clear description of what needs to be solved. Include:
- What is the current behavior?
- What is the expected behavior?
- Why does this matter?
-->

## Research & Analysis

<!-- Notes from codebase exploration. Include:
- Relevant files discovered
- Existing patterns to follow
- Dependencies and constraints
- Edge cases to consider
-->

### Key Files

| File | Relevance |
|------|-----------|
| `path/to/file.ts` | Description of why this file matters |

### Existing Patterns

<!-- Document patterns found in the codebase that should be followed -->

## Proposed Solution

### Approach

<!-- High-level strategy for solving the problem -->

### Files to Modify

| File | Changes |
|------|---------|
| `path/to/file.ts` | What changes will be made |

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Option A | Benefits | Drawbacks | Chosen/Rejected |
| Option B | Benefits | Drawbacks | Chosen/Rejected |

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Potential risk | How it will be addressed |

## Implementation Log

<!-- Update this section as you work. Add new date sections at the TOP (newest first). -->

### YYYY-MM-DD (add newest entries here)

- [ ] Step 1: Description
- [ ] Step 2: Description

### YYYY-MM-DD (older entries below)

- [x] Previous step completed

## Review Checklist (The Gauntlet)

Before submitting for review, ensure your code passes all three checks:

### Style (Linter Agent)

- [ ] Follows `.claude/rules/code-style.md`
- [ ] No TypeScript `any` types
- [ ] Proper import ordering
- [ ] Biome formatting applied (`bun run format`)
- [ ] No unused variables or imports

### Logic (Analyst Agent)

- [ ] Game rules correctly implemented per `.claude/rules/domain-concepts.md`
- [ ] Edge cases handled
- [ ] No logic calculation errors
- [ ] Patterns match existing codebase conventions
- [ ] Tests cover the happy path and error cases

### Architecture (Tech Lead Agent)

- [ ] No code duplication (DRY principle)
- [ ] Follows `agent-os/product/philosophy.md`
- [ ] Performant implementation
- [ ] Proper separation of concerns
- [ ] Core vs game engine logic correctly placed

## Status

- [ ] Memory Bank created
- [ ] Plan approved (Steering PR merged)
- [ ] Implementation complete
- [ ] Tests passing (`bun test`)
- [ ] Type check passing (`bun run check-types`)
- [ ] Format check passing (`bun run format`)
- [ ] PR merged
