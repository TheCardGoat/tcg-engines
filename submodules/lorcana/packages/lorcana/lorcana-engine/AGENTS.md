# Lorcana Engine Package

This package owns Lorcana state transitions, targeting, effect resolution,
derived state, projection, automation, and engine-level tests.

## Invariants

- Keep every condition, target, and effect discriminator registered in its
  exhaustive variant registry.
- Add a focused per-variant test with every new discriminator or resolver.
- Preserve deterministic state transitions and multiplayer semantics.
- Card-specific gaps may be extended through the `lorcana-cards` skill;
  cross-cutting engine work remains owned here.

## References

Use [`docs/variant-extension.md`](docs/variant-extension.md) for the condition,
target, effect, and test registration workflow. Use the parent Lorcana rules
and test-generation skills for rules grounding and harness syntax.

Run the smallest focused Bun test first, then the package type check and the
Lorcana workspace gate when the change crosses package boundaries.
