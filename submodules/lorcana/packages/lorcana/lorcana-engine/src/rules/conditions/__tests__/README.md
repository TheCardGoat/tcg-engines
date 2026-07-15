# Condition variant tests

One `<type>.test.ts` file per entry in
[`CONDITION_VARIANT_TYPES`](../../condition-evaluator.ts). The `_coverage.test.ts`
meta-test fails CI if a registered variant has no file or the file is missing
its top-level `describe("<type>", ...)` block.

How to add a condition and its test: see
[`../../../../AGENTS.md`](../../../../AGENTS.md).

Working examples to copy: [`your-turn.test.ts`](your-turn.test.ts),
[`not.test.ts`](not.test.ts), [`or.test.ts`](or.test.ts).
