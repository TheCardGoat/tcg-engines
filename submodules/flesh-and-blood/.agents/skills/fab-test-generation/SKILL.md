---
name: fab-test-generation
description: Use when writing or reviewing Flesh and Blood (FAB) card-behavior or rules-engine tests — authoring Arrange/Act/Assert scenarios, choosing FabTestEngine harness verbs, asserting printed results vs boundaries vs timing, or running FAB test/type validation. Covers the FAB test harness API and the project's AAA test standard.
---

# Flesh and Blood Test Generation

Use this skill to write or review Arrange / Act / Assert tests with the
`FabTestEngine` fluent harness. The objective is behavior coverage: real authored
cards, legal player actions, and exact rule-visible outcomes.

## Required reference routing

1. Always read `references/quality.md` before authoring or approving a test.
2. Open only the relevant sections of `references/harness-cheatsheet.md` for the
   setup, intent verbs, decisions, or assertions in the scenario. Source under
   `packages/engine/src/testing/` remains authoritative for exact signatures.
3. Search `references/playbook.md` for the mechanic, assertion, or harness verb
   involved. Read `references/playbook-archive.md` only for historical batches.
4. For rules-facing behavior, first load the `fab-rules` glossary and skill as
   required by the workspace `AGENTS.md`.
5. Before recording a gap, list existing families:
   `node packages/cards/scripts/card-coverage.ts --gaps`.

## Decision procedure

1. **Classify ownership.** Is this authored card gameplay, a public
   command/legality contract, or an engine/kernel contract? The classification
   determines the permitted assertion surface in `references/quality.md`.
2. **Choose a real representative.** Import authored modules from
   `packages/cards/src/cards/`; never define, clone, rename, or borrow the id or
   artwork of a fixture card.
3. **Confirm the behavior is executable.** Reach the printed clause through
   legal public moves. If the engine, definition, harness, or product scope
   prevents that, record one gap family and skip fake coverage.
4. **Arrange minimally.** Seat exactly two players and seed only the cards and
   state required by the printed preconditions.
5. **Act publicly.** Use player intent verbs and explicit decision answers.
6. **Assert the owned outcome.** Gameplay tests end on fluent, rule-visible
   assertions. Kernel and contract tests may inspect only the structure they own.
7. **Validate.** Run type-checks before trusting the focused test, then run the
   whole submodule gate only when the task is complete.

## Product scope

The runtime and harness support exactly two seated players. Deckbuilding-only
and multiplayer-only clauses are out of scope: record the reason instead of
implementing them by implication.

## Real cards only

Every card-behavior test, rules scenario, visual fixture, integration test, and
browser flow must use real authored card modules from `packages/cards/src/cards/`.

- Exercise the authored ability through legal public player moves.
- Deterministic setup may order real cards in hands, decks, equipment, and zones;
  it must not replace printed properties or rules.
- If no real authored card can prove the case, record a coverage or engine gap.
- When a real card exposes a defect, fix or record the owning gap; do not
  substitute a simplified test card.

## Gameplay AAA contract

Arrange → Act → Assert. Every playable behavior needs a happy path and a
meaningful contrasting case. Add a timing or interaction case only when the
printed text or rules create a distinct boundary.

**Arrange** — `FabTestEngine.start(playerA, playerB, config?)`, always with two
players.

- Import every card from its authored module; never inline a card definition.
- Seed only the preconditions required by the printed clause.
- Omitted `hand` and `hand: "filler"` seat `DEFAULT_HAND` (3× Browbeat Blue plus
  Enlightened Strike). Use `hand: []` for an empty hand.
- The smart harness enables `autoPitch` and `autoPassPriority`. Use
  `FAB_MANUAL_HARNESS` only when the scenario must preserve state the smart
  harness would resolve away, such as pre-payment state, declaration-time power,
  pitch ordering, or a specific optional.

**Act** — use the current intent surface.

- Player actions: `playAttack`, `activateAttack`, `play`, `activate`,
  `defendWith`, `pass`, `endTurn`.
- Decisions: `decline`, `accept`, `choose`, `chooseNumeric`, `target`,
  `targetRequired`.
- Drains: `game.toReaction(...)`, `game.closeCombat(...)`,
  `game.untilIdle(...)`, `game.advanceUntil({ stopAt: ... })`.
- Staged play payment: `handle.must.pitch(...).playAttack(...)`.
- Never mutate `getState()` or dispatch `.exec(...)` to manufacture gameplay.
  Explicit seed helpers in `rules-aaa.ts` are the sanctioned exception.
- `attackWith`, `advanceCombatTo`, `passBoth`, `resolveRestOfCombat`, and
  `resolveUntilIdle` are legacy compatibility surfaces. Do not introduce them
  when a current intent verb expresses the scenario.

**Assert** — finish gameplay tests on rule-visible outcomes.

- Player: `expectFabPlayer(handle)` for life, hand, resources, action points,
  tokens, and player statuses.
- Card: `expectFabCard(handle, ref)` for zones, counters, evaluated properties,
  keywords, freeze, and supertypes.
- Combat: `expectCombat(game)` for open/closed state, step, power, keywords,
  attack supertypes, and clash winner.
- Wait state: `expectWait(game)` for idle and decision kind.
- Never use logs, model shape, private fields, `game.combat().activeLink`, or
  `getState()` as gameplay proof.

**Case selection**

1. **Happy path** — assert the printed result itself: life, zone movement,
   evaluated power, keyword effect, token, counter, or legality.
2. **Boundary** — assert a contrasting legal state or a printed illegality. A
   second way to throw the same unhandled marker is not a boundary.
3. **Timing/interaction** — add only when priority, expiry, chain/turn scope,
   controller, or target changes the expected result.

Use one `it(...)` per coherent case and isolate the variable being contrasted.
Prefer suite names of the form `"Card Name (CODE) AAA"` for card behavior.

## Validation

1. `vp run check-types` — vitest-oxc strips types, so a green test does not prove
   type safety.
2. `vp test run <pattern>` (or the owning package test task). Inspect captured
   output for passed tests and suite-load failures; do not trust the exit code alone.
3. Only when the task is complete: `vp run ci-check` from this submodule.

Stay in this checkout; do not create a worktree for FAB tests or gap closure.

## Gaps and durable learning

Record an engine, definition, harness, or out-of-scope miss as a family:

```text
node packages/cards/scripts/card-coverage.ts --record-gap <slug> --family <id> --reason "..." --kind engine-primitive|definition|out-of-scope|harness
```

- Do not mint a one-card handler or fail-loud test to close a gap implicitly.
- Add only generalized harness or AAA surprises to `references/playbook.md`.
  Merge duplicates and include a source pointer when one exists.
- Put card-specific recipes and completed batch history in
  `references/playbook-archive.md`.
- Explain lesson removals or semantic rewrites in the change description or
  commit message.

## Reference index

- Quality policy and ownership matrix → `references/quality.md`.
- Current API map and source pointers → `references/harness-cheatsheet.md`.
- Durable, generalized harness lessons → `references/playbook.md`.
- Open gap families → `packages/cards/scripts/card-coverage/gaps.json`.
- Historical wave diaries → `references/playbook-archive.md`.
