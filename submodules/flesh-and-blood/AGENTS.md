# Flesh and Blood

Prototype engine and cards. Slug: `flesh-and-blood`; packages:
`@tcg/flesh-and-blood-*`. For rules-facing work, use
`.agents/skills/fab-rules/SKILL.md`.

- The engine, runtime, and harness support exactly two seated players.
  Multiplayer formats are outside product scope.
- `packages/cards/src/cards` owns authored behavior; `packages/types` owns
  its types. Generated catalog JSON is printed metadata, not executable rules.
  There is no card-text parser.
- Use real authored cards and legal public moves to test rule-visible results.
  For test work, follow `.agents/skills/fab-test-generation/SKILL.md` and its
  `references/quality.md`.
- `/fab-tests` records gaps; `/fab-close-gaps` uses the `fab-close-gap` skill
  to resolve them in the owning engine primitive.

Use focused package tests and type checks as needed. The workspace-wide check
is `vp run ci-check`; it is not required for every task.
