# One Piece Unit & Card Behavior Test Strategy

Investigation of the current unit-test landscape and the standard for
ergonomic, user-like card behavior tests.

## Goals

1. Every printed ability has at least one **command-driven** behavior test.
2. Tests read like a short play sequence a non-engineer can follow.
3. Tests drive the engine the way a player does: play cards, pay costs, choose
   targets, accept/decline options, attack — never private `MatchState` edits
   for ordinary proofs.

## Current landscape (measured)

| Layer | Location | Role | In default `vp test run`? |
| --- | --- | --- | --- |
| Rules chapters | `packages/engine/tests/rules/` | Comprehensive Rules as executable specs | Yes |
| Engine integration | `packages/engine/tests/index.test.ts`, `test-engine.test.ts` | Match flow, prompts, combat, replay | Yes |
| Authored card behavior | `packages/engine/tests/cards/**/*.test.ts` (~1385 files) | Real `OnePieceTestEngine` play paths | **Yes** |
| Generated placeholders | `packages/engine/src/cards/**/*.test.ts` (~2065 files) | Often only `validateCardAbility(card)` | **No** (excluded) |
| Vanilla catalog | `src/cards/vanilla-character-catalog.test.ts` | Asserts no printed ability text | **No** (was excluded) |
| Parser unit tests | `tools/op-card-parser/tests` | Text → DSL, not engine play | Separate package |

### Behavior inventory (canonical IDs)

From `docs/card-behavior-*-inventory.md`:

| Type | Canonical ability | Status summary |
| --- | ---: | --- |
| Character | ~1341 ability + ~200 vanilla | Nearly all ability rows `verified` |
| Event | 303 | `verified` |
| Leader | 97 | `verified` |
| Stage | 39 | `verified` |

Printings (alternate arts) share a **canonical** behavior test; catalog
signature tests cover export drift.

### Quality of existing tests

**Sample-100 audit (2026-07-30, refreshed):** stratified review of 100 authored
`tests/cards/**` files across types/sets — see
[`sample-100-test-quality-audit.md`](./sample-100-test-quality-audit.md).
Human grades: **~65% solid A**, **~30% A−** (strong happy path + bulk
try/catch decline template), **~5% B** (missing optional decline or wrong
decline subject / view API). Machine `gradeSource` passes **96/100** on the
same sample — static gate under-detects template declines. No C/F in the
authored sample. Dual-corpus note: `src/cards/**` placeholders are not
behavior proofs.

**Good (default suite):** Authored tests under `tests/cards/` typically:

- build a fixture with `OnePieceTestEngine.create(...)`
- call `playCard` / `activateEffect` / `declareAttack` / `resolveDecision`
- assert player-visible results via `getView(...)`

Example shape (already close to the desired standard):

```ts
engine.activateEffect(sanjiId, "activateMain", "south");
engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
expect(view.players.south.hand...).toContain(topLifeId);
```

**Weak:** Generated `src/cards/**` tests that only call `validateCardAbility`
are inventory noise. They do **not** prove printed behavior and must not be
counted as coverage.

### Gaps found

1. **Vanilla Characters** relied on a catalog-only check that was not in the
   default suite — no "player plays this card" smoke.
2. **Ergonomics** still use low-level prompt intent strings
   (`effectTargetSelection`, `optionId: "yes"`) that are hard for non-technical
   readers.
3. **No hard gate** failed CI when a new ability card shipped without a
   command-driven behavior test.
4. Dual corpora (`tests/cards` vs `src/cards`) invite false confidence from
   placeholder files. **~415 ability cards** currently have real command-driven
   proofs only under `src/cards/**` (excluded from package default
   `vp test run`). The coverage gate still counts them; migrating those files
   into `tests/cards/**` (or expanding the suite include for non-placeholder
   files) is the next operational improvement so CI always executes them.

## Target standard (hard requirements)

### 1. Coverage

- Every **non-vanilla** canonical Character, Event, Leader, and Stage has at
  least one file under `packages/engine/tests/cards/**` that drives
  `OnePieceTestEngine` with real player commands.
- Vanillas are covered by one parameterized **play-through** suite (play from
  hand with enough DON!!, no effect prompts) plus the catalog "no ability"
  invariant in the default suite.
- Reprints / alternate arts share the canonical test (no per-printing copy).

### 2. Ergonomic readability (not Cucumber)

Prefer ordinary TypeScript that still reads top-to-bottom like a match:

```ts
test("player activates Sanji, pays top Life, and takes two rested DON!!", () => {
  const engine = OnePieceTestEngine.create({
    character: [op01Sanji013],
    life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    restedDon: 2,
  });

  engine.activateMain(op01Sanji013);
  engine.accept(); // you may pay Life
  engine.chooseAmount(2); // give up to 2 rested DON!!

  const view = engine.getView("south").players.south;
  expect(view.characters[0]).toMatchObject({ attachedDon: 2, power: 7000 });
});
```

Rules of thumb for non-technical review:

- **One sentence** test name stating what the player does and what happens.
- **Arrange → Act → Assert** with blank lines between phases.
- Prefer helpers: `play`, `activateMain`, `choose`, `accept`, `decline`,
  `attack`, `passTurn` over raw command objects.
- Assert **what a player sees** (field, power, hand, DON!!, no leftover prompt).
- Avoid `getState().players` / internal zones unless testing projection itself.

### 3. User-like interaction

| Player does | Test calls |
| --- | --- |
| Play card from hand | `engine.play(card)` |
| Activate Main ability | `engine.activateMain(card)` |
| Pick targets on the board | `engine.choose("effectTargetSelection", [card])` |
| Accept optional text | `engine.accept()` |
| Decline optional text | `engine.decline()` |
| Attack | `engine.attack(attacker, defender)` |
| End turn | `engine.passTurn()` |

Do not enqueue effect blocks, mutate Life totals, or skip the prompt the UI
would show.

## Implementation delivered in this pass

1. **Readable helpers** on `OnePieceTestEngine`:
   `play`, `activateMain`, `choose`, `accept`, `decline`, `chooseAmount`,
   `attack`, `passTurn`, `hasPendingChoice`, `findOnField`.
2. **Coverage gate** `tests/cards/behavior-coverage-gate.test.ts` — fails if any
   non-vanilla canonical ability card lacks a command-driven test under
   `tests/cards/**`.
3. **Vanilla play-through** `tests/cards/vanilla-character-playthrough.test.ts`
   — each inventory vanilla is playable from hand without effect prompts.
4. **Vanilla catalog** moved into the default suite
   (`tests/cards/vanilla-character-catalog.test.ts`).
5. **Exemplar** rewrite of OP01-013 Sanji using the readable helpers.
6. **TESTING.md** updated with the ergonomic contract.

## Ongoing practice

- New cards: write the behavior test **before** or with the definition; use the
  helpers so reviews stay readable.
- Do not add new `validateCardAbility` placeholders under `src/cards/**`.
- Prefer extending shared helpers over copying fixture boilerplate.
- Keep parser unit tests in `op-card-parser`; keep engine play in
  `tests/cards`.

## Success metrics

| Metric | Target |
| --- | --- |
| Ability cards with `tests/cards` command-driven test | 100% of non-vanilla canonicals |
| Vanilla play-through in default suite | 100% of inventory vanillas |
| Placeholder-only generated tests | Not counted; not required in CI include |
| Test readability | Name + helpers allow a non-engineer to narrate the play |
