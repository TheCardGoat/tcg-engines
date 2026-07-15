# Lorcana Cards Package

This package owns typed Lorcana card definitions, helpers, generated exports,
and focused card behavior tests.

## Invariants

- Every non-vanilla card with printed rules text has an `abilities` array;
  vanilla cards use `vanilla: true`.
- Remove `missingImplementation: true` and `missingTests: true` when the
  implementation and active test are complete.
- Enchanted and epic reprints share the base card's `canonicalId` and ability
  structure.
- Card tests cover the happy path and card-specific regressions. Cross-card
  engine edge cases belong in the engine or simulator test surface.
- Extend shared engine/types behavior only through the bounded workflow owned
  by the `lorcana-cards` skill.

## Workflow

Use the canonical
[`lorcana-cards` skill](../../../.agents/skills/lorcana-cards/SKILL.md) for
single-card work. Its [`PATTERNS.md`](../../../.agents/skills/lorcana-cards/PATTERNS.md)
owns ability types, helpers, effects, targets, examples, and verification
commands. Rules questions use the sibling `lorcana-rules` skill; new test
shapes use `lorcana-test-generation`.

Start from the exact card and its test, then prefer active examples from the
same card type. Generated stubs, empty tests, commented legacy tests, and
keyword-only smoke tests are not proof of implemented behavior.
