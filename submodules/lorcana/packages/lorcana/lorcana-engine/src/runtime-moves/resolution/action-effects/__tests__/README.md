# Effect variant tests

One `<type>.test.ts` file per entry in
[`ACTION_EFFECT_RESOLVER_TYPES`](../composed-effect-resolver.ts). The
`_coverage.test.ts` meta-test fails CI if a registered effect has no file or
the file is missing its top-level `describe("<type>", ...)` block.

Four variants also have larger historical tests sitting next to their resolver
(`deal-damage-effect.test.ts`, `banish-effect.test.ts`,
`discard-effect.test.ts`, `return-random-from-inkwell-effect.test.ts`); those
stay put as deeper integration coverage while the files here stay focused on
minimal per-variant unit assertions.

Cross-variant composition (sequence threading, choice / optional resolution,
replacement chaining, selection contexts) belongs in
[`../composed-effect-resolver.test.ts`](../composed-effect-resolver.test.ts)
or simulator integration tests — **not** here.

How to add an effect and its test: see
[`../../../../../AGENTS.md`](../../../../../AGENTS.md).

Working examples to copy: [`gain-lore.test.ts`](gain-lore.test.ts),
[`lose-lore.test.ts`](lose-lore.test.ts).
