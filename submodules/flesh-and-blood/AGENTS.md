# Flesh and Blood Submodule

THIS PROJECT IS STILL A PROTOTYPE, AND IT HAS NO PRODUCTION SURFACE.
WHENEVER WE'RE DEALING WITH INCOMPLETE IMPLEMENTATIONS, WE MUST ALWAYS CONSIDER DOING CHANGES THAT IS BEST LONG TERM.
WE ARE WILLING TO TAKE HUGE REFACTORS OR OVERHAULS.

Before rules-facing work, load
`.agents/skills/fab-rules/references/glossary.md` and then
`.agents/skills/fab-rules/SKILL.md`.

## Canonical Identity

- Game title: Flesh and Blood
- Repository slug: `flesh-and-blood`
- Package namespace: `@tcg/flesh-and-blood-*`

## Source of truth for cards

Authored modules under `packages/cards/src/cards/` and types in
`packages/types` are the executable representation. The generated catalog JSON
is printed metadata (names, printings, legalities). There is no card-text
parser; do not invent or restore one as an intermediate source of truth.

## Product Scope — 1v1 Only

The rules engine, match runtime, and test harness support **exactly two
seated players**. Multiplayer formats (party, shared event deck, clockwise
multi-target tables, 3+ seats) are **out of product scope** — not deferred
work, not partial support. Design and implement as if multiplayer will not
arrive on this engine.

## Type Safety (non-negotiable)

Compile-time type rejection is part of production safety for this workspace.

## Validation

Run focused package tests and type-checks first, once the task is finished validate by running the submodule `vp run ci-check` task.

`/fab-tests` records gap families. `/fab-close-gaps` (skill `fab-close-gap`) is the closer — extend the owning primitive, do not mint one-off `has-status` handlers.

Work in this checkout. Do not create sibling git worktrees for test batches
or gap clusters; share the dirty tree and commit only your paths.

## Tests prove play, not AST shape

The engine already has a vast suite. New tests MUST be high-value: real authored cards, legal public moves, and rule-visible state transitions. `/fab-tests` must read `.agents/skills/fab-test-generation/references/quality.md` and skip or `--record-gap` rather than ship stringify guards, fail-loud “AAA”, presence-only keywords, or invented cards. A green low-value test is worse than no test.
