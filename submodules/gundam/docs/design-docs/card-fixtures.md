# Card Fixtures — Approved-Fixtures Pattern for Behavioral Tests

This is the **behavior harness** for cards (Böckeler's third category — the elephant in the room). It turns subjective "does this card work?" into a computational sensor: every card with behavioral surface ships a fixture that pins its behavior down.

## The pattern

For every card file `packages/cards/src/cards/<set>/<type>/<file>.ts` that has either:

- a non-empty `effects: [...]` array, OR
- a non-empty `keywordEffects: [...]` array,

there must be a sibling `<file>.test.ts` containing at least one `it(...)` / `test(...)` block that drives the card through a `GundamTestEngine` fixture.

A fixture, in this context, is a tuple of:

1. **Initial state** (zones, resources, hand) — built via `GundamTestEngine.create(...)`.
2. **A command sequence** (the user action: `deploy`, `attack`, `fireShieldBurst`, etc.).
3. **An assertion on the final state** — what zones contain, what was logged, what stats changed.

This is exactly what existing tests already do (see [`packages/cards/src/cards/beta/unit/`](../../packages/cards/src/cards/beta/unit/) for examples). We're formalizing the pattern, not inventing it.

## Why "approved fixtures"

The name comes from the [approved fixtures testing pattern](https://approvaltests.com/). Adapted here:

- The card author defines what "correct behavior" means by writing the fixture.
- The fixture is reviewed once (by `/review` skill + human).
- After that, **the fixture is the spec**. If the engine changes in a way that breaks the fixture, either the engine change is wrong, or the fixture's spec needs to evolve (with discussion).

The alternative — "write tests later, when we have time" — produces cards whose behavior nobody can confidently describe six months on. AI-generated card code is especially prone to this failure mode: the `effects[]` array looks plausible but doesn't quite match the `effect` text.

## What the sensor catches

- **Missing fixtures** — card with `effects[]` but no `*.test.ts`.
- **Empty fixtures** — `*.test.ts` exists but contains no `it()` block.

What it does **not** catch (and shouldn't pretend to):

- A fixture that asserts the wrong thing.
- A fixture that exercises only one of several `effects[]` entries.
- A fixture that passes by accident because the assertion is trivially true.

Those failure modes are caught by the `/review` skill (criterion 4: test depth) and by human review. The sensor is the floor, not the ceiling.

## Allowlist

`tools/harness/card-fixture-allowlist.txt` lists cards exempt from the check. Adding to it is **debt**, not approval — every entry should have a one-line justification and an intent to remove. CI passes with allowlist entries, but the list is expected to shrink over time, not grow.

## When you're implementing a card

The flow is in [`.claude/skills/implement-card.md`](../../.claude/skills/implement-card.md). The fixture is the deliverable, not an afterthought. Specifically:

1. Read the card's `effect` text.
2. Decompose into structured `effects[]` entries.
3. **Write the fixture before or alongside the implementation** — the fixture tells you what shape `effects[]` needs.
4. If a structural `effects[]` entry can't be exercised by a fixture, that's a smell — either the engine is missing something, or the entry is dead.

This mirrors the pattern in Anthropic Labs' generator/evaluator harness: the contract is negotiated before the implementation, not after.

## Future extensions

Possible upgrades, not yet committed:

- **Fixture-vs-effect coverage** — a script that parses `effects[]` and asserts each entry is named in at least one assertion of the fixture. Would catch "the fixture only tests effect #1 of 3."
- **Mutation testing on card effects** — flip a small detail in `effects[]` (target filter, amount) and re-run the fixture; if it still passes, the fixture is too weak.
- **Self-play fuzz** — `tools/bot-bench/` already runs self-play games; surface a CI mode that fails on any unhandled engine error to catch cards whose effects deadlock or throw.

See [`docs/exec-plans/active/2026-05-15-harness-tech-debt.md`](../exec-plans/active/2026-05-15-harness-tech-debt.md) when these get scheduled.
