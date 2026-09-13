# Section 12 — Multiplayer Battle (DEFERRED / OUT OF SCOPE)

**Status:** Explicit non-goal for the product and for this rules-test program.

## Why deferred

- Product scope is the standard two-player game only (comprehensive rules
  **1-1-1**; see `submodules/gundam/AGENTS.md` "Supported Match Scope").
- Section 12 covers battle royale (3+) and team battle (2v2), shared shield
  areas, multiplayer action-step order, and multi-opponent targeting.
- No executable multiplayer suite is planned. Do not silently omit this
  section — keep this file as the permanent scope note.

## What is still in scope for 1v1

- Phrases like "each enemy player" mean the single opponent.
- Choice ownership still matters in 1v1 (wrong decision owner is a bug).

## Spec / suite mapping

| Artifact                | Role                                 |
| ----------------------- | ------------------------------------ |
| This file               | Sole explicit deferral of section 12 |
| `README.md` scope table | Points multiplayer to this file      |
| No `12-*.rules.test.ts` | By design                            |
