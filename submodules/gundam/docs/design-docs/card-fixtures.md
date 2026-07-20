# Card Fixtures — Approved-Fixtures Pattern for Behavioral Tests

This is the **behavior harness** for cards (Böckeler's third category — the elephant in the room). It turns subjective "does this card work?" into a computational sensor: every card with behavioral surface ships a fixture that pins its behavior down.

## The pattern

For every card file `packages/cards/src/cards/<set>/<type>/<file>.ts` that has either:

- a non-empty `effects: [...]` array, OR
- a non-empty `keywordEffects: [...]` array,

there must be a sibling `<file>.test.ts` containing at least one `it(...)` / `test(...)` block that drives the card through a `GundamTestEngine` fixture.

Vanilla Units are covered together by
`packages/cards/src/cards/vanilla-unit-catalog.test.ts`. That parameterized
invariant deploys every canonical non-token vanilla Unit through the public
move, checks its visible printed stats and destination, and proves its
active-resource cost gate. Its separate token catalog verifies every canonical
vanilla Unit token's rules-defined Lv./cost and simulator-visible printed
stats. Do not create one metadata-oriented sibling test per vanilla card or
token.

A fixture, in this context, is a tuple of:

1. **Initial state** (zones, resources, hand) — built via `GundamTestEngine.create(...)`.
2. **A legal player command sequence** using the same public moves the simulator
   can submit: deploy, pair, attack, pass, and resolve a published interaction.
3. **An assertion on the player-visible result**: public zone/count changes,
   effective stats, damage, exhausted state, legal targets, winner, logs, or a
   published interaction and its legal choices.

The fixture owns setup only. After `GundamTestEngine.create(...)`, do not mutate
the phase, inject an effect, seed a hidden identity, or call a test-only combat
shortcut to manufacture the result. Reach it through player moves. Likewise,
do not inspect `effects[]`, raw runtime state, pending-effect storage, or a
face-down Deck/Shield identity. A simulator user cannot observe those details,
so they cannot prove the interaction is usable.

This is exactly what existing tests already do (see [`packages/cards/src/cards/beta/unit/`](../../packages/cards/src/cards/beta/unit/) for examples). We're formalizing the pattern, not inventing it.

## Why "approved fixtures"

The name comes from the [approved fixtures testing pattern](https://approvaltests.com/). Adapted here:

- The card author defines what "correct behavior" means by writing the fixture.
- The fixture is reviewed once (by `/review` skill + human).
- After that, **the fixture is the spec**. If the engine changes in a way that breaks the fixture, either the engine change is wrong, or the fixture's spec needs to evolve (with discussion).

The alternative — "write tests later, when we have time" — produces cards whose behavior nobody can confidently describe six months on. AI-generated card code is especially prone to this failure mode: the `effects[]` array looks plausible but doesn't quite match the `effect` text.

## What the sensor catches

- **Missing fixtures** — a covered card has no `*.test.ts`.
- **Empty fixtures** — `*.test.ts` exists but contains no `it()` block.
- **Structural tests** — tests inspect `effects[]` or object shape instead of behavior.
- **Engine shortcuts** — tests read/mutate raw runtime state or execute effects directly.
- **Hidden-zone leaks** — audited sets cannot capture Deck or face-down Shield identities.
- **Skipped debt** — strict-set behavior cannot be committed as `skip` or `todo`.
- **Vanilla catalog drift** — every canonical non-token vanilla Unit must still
  deploy with its printed stats and reject an underpaid cost, while every
  canonical vanilla Unit token must retain its token values and visible stats.

What it does **not** catch (and shouldn't pretend to):

- A fixture that asserts the wrong thing.
- A fixture that exercises only one of several printed behaviors.
- A fixture that passes by accident because the assertion is trivially true.

Those failure modes require behavior review in addition to the computational
sensor. The sensor is the floor, not the ceiling.

## Allowlist

`tools/harness/card-fixture-allowlist.txt` lists cards exempt from the check. Adding to it is **debt**, not approval — every entry should have a one-line justification and an intent to remove. CI passes with allowlist entries, but the list is expected to shrink over time, not grow.

## When you're implementing a card

The flow is in
[`gundam-cards`](../../.agents/skills/gundam-cards/SKILL.md). The fixture is the
deliverable, not an afterthought. Specifically:

1. Read the card's `effect` text.
2. Write the fixture from the player interaction: legal setup, legal moves, and
   the visible result.
3. **Write the fixture before or alongside the implementation.** Treat any
   missing prompt, choice, legal-target query, or staged resolution as an
   engine/protocol gap.
4. Implement the card with game-agnostic actions and interaction protocols.
5. Add positive, negative, expiry, ownership, and terminal-game cases where the
   printed text makes those boundaries meaningful.

The test contract is established before the implementation, not after.

## Future extensions

Possible upgrades, not yet committed:

- **Fixture-vs-effect coverage** — a script that parses `effects[]` and asserts each entry is named in at least one assertion of the fixture. Would catch "the fixture only tests effect #1 of 3."
- **Mutation testing on card effects** — flip a small detail in `effects[]` (target filter, amount) and re-run the fixture; if it still passes, the fixture is too weak.
- **Self-play fuzz** — `tools/bot-bench/` already runs self-play games; surface a CI mode that fails on any unhandled engine error to catch cards whose effects deadlock or throw.

See [`docs/exec-plans/active/2026-05-15-harness-tech-debt.md`](../exec-plans/active/2026-05-15-harness-tech-debt.md) when these get scheduled.
