# Target variant tests

One `<type>.test.ts` file per entry in
[`TARGET_VARIANT_TYPES`](../index.ts). Covers DSL selectors (`self`, `chosen`,
`all`, …), player selectors (`you`, `opponent`, `each-player`), and target
references (`source`, `trigger-subject`, `selected-first`, …).

Cross-selector plumbing (normalization, bounds resolution, enum-alias expansion)
remains in
[`../../../runtime-moves/resolution/action-effects/target-resolver.test.ts`](../../../runtime-moves/resolution/action-effects/target-resolver.test.ts).

How to add a target and its test: see
[`../../../../AGENTS.md`](../../../../AGENTS.md).
