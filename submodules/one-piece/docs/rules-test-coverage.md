# One Piece Rules Test Coverage

This index maps the One Piece Card Game Comprehensive Rules (Version 1.2.0,
last updated 1/16/2026) to the executable test specification suite in
`packages/engine/tests/rules/`. The rules source of truth is
`.agents/skills/op-rules/comprehensive-rules.md`.

For a per-test evaluation of how each rule proves engine correctness (including negative/edge cases), see [`rules-test-evaluation-summary.md`](./rules-test-evaluation-summary.md).

## Conventions

- One spec file per rules chapter; every test name cites its rule numbers
  (e.g. `6-3-1: the first player does not draw on their first turn`).
- Tests drive real commands through `OnePieceTestEngine` (play, attack, give
  DON!!, activate, resolve prompts, end turn) and assert player-visible state
  through `getView` / `pendingDecision`. Data-level rules (categories, colors,
  printed fields) are proven as catalog invariants over `@tcg/op-cards`.
- Where a rule has no executable surface, it is classified below instead of
  being forced into a fragile scenario.

## Chapter Map

| Chapter | Spec file | Scope |
| ------- | --------- | ----- |
| 1. Game Overview | `01-game-overview.test.ts` | defeat conditions, impossible actions, precedence, numeric rules, cost definitions |
| 2. Card Information | `02-card-information.test.ts` | names, categories, colors, types, attributes, power, cost, Life, Counter, Trigger, card number |
| 3. Game Areas | `03-game-areas.test.ts` | open/secret areas, zone movement, area limits, Life stack |
| 4. Basic Terminology | `04-terminology.test.ts` | draw, damage processing, "up to", "base", if/then, Set Power to 0 |
| 5. Game Setup | `05-game-setup.test.ts` | deck construction, opening hand, mulligan, Life placement, first player |
| 6. Game Progression | `06-game-progression.test.ts` | phase sequence, Refresh/Draw/DON!!/Main/End, giving DON!!, durations |
| 7. Attacks and Battles | `07-battle.test.ts` | attack declaration, targets, Block/Counter/Damage steps, battle end |
| 8. Activating and Resolving Effects | `08-effects.test.ts` | effect categories, costs, conditions, resolution order, replacements |
| 9. Rule Processing | `09-rule-processing.test.ts` | defeat judgment timing |
| 10. Keyword Effects | `10-keyword-effects.test.ts` | Rush, Double Attack, Banish, Blocker, Trigger, Rush: Character, Unblockable |
| 10. Keywords | `10-keywords.test.ts` | K.O., Activate: Main, Main, Counter, DON!! xX / −X, Once Per Turn, On Play/K.O./Block, etc. |
| 11. Other | `11-other.test.ts` | revealing cards, viewing secret areas |

Deck-construction rules (5-1-2 family) are proven through the public
`validateDeckForFormat("standard", …)` API exported from `@tcg/op-cards`
(`packages/cards/src/deck-validation.ts`); the server adapter's
`onePieceServerAdapter.validateDeckForFormat` is a thin delegate over it.

## Non-Executable Rules

Classified during the specification pass; no test exists for these by design.

- **Physical/meta procedure**: 2-3-3-1 hexagon layout, 2-12/2-13/2-15/2-16/2-17 (copyright, rarity, block
  symbol, illustration, illustrator), 5-2-1-1 deck presentation, 5-2-1-4-1
  no-intervention in the first/second decision.
- **Definitional text** with no isolated observable: 1-1-1 support statement,
  2-8-4 / 2-8-4-1 / 2-8-4-2 (explanatory notes in parentheses; do not drive
  gameplay except when effect text is intentionally parenthesized — not a
  separate engine surface), 3-1-2 "the field", 3-1-5, 3-7-1/3-7-3, 3-8-1/3-8-3,
  3-9-1, 4-1/4-2/4-9-1, 4-11, 6-5-6-2 cross-reference, 8-1-3-3-1/8-1-3-3-4,
  8-3-1, 8-3-1-8, 8-3-2, 8-4-1 procedure steps, 8-4-4-3, 8-4-6, 8-5-1, 2-14-1.
  Parent intro clauses such as 2-2-1, 2-3-1, 2-4-1, 2-5-1, 2-6-1, 2-7-1, 2-8-1,
  2-9-1, 3-3-1, 5-1-1, 6-1-2, 8-1-1 are cited on sibling/parent outcome tests
  rather than as standalone specs.
- **Randomization**: 3-2-4 shuffle (harness is seeded; no player-visible
  contract), 3-3-3 DON!! deck process, 4-4-2 (given DON!! is a counter, not a
  rest-state card), 4-6-2-2 X=0 branch (no command deals 0 damage).
- **No catalog card exercises the clause** (rules become testable when such a
  card exists): 1-3-6-2-1 (cost increase on a negative-cost card), 1-3-8
  (simultaneous rest + set-active), 2-1-2-1 (partial-name quotes), 2-4-4,
  2-5-7, 2-9-4 (Life value modifier), 4-9-2-2 (set base cost), 5-2-1-5-1/5-2-1-5-2
  ("at the start of the game"), 6-5-1 ("at the start of the Main Phase"),
  8-1-3-3-3 ("according to the rules" permanent in secret area), 8-1-3-4-2/4-3/4-4/4-6/4-7
  (stacked replacement chains), 8-2-2, 8-2-4, 8-3-1-2, 8-3-1-7, 8-3-2-2,
  10-2-8 ([End of Your Opponent's Turn]), 10-2-4-1-2 negative half.
- **Unreachable through the public command API**: 8-1-3-1-3 (source moves
  between timing and activation — the engine activates immediately),
  8-1-3-3-5 (iterative permanent ordering), 8-3-1-3-1 and 10-2-13-5
  (mid-payment cost failure — costs validate atomically), 8-6-1-1 (A→B→C
  chain), 11-1 infinite loops (no loop detection; the draw outcome itself is
  representable via `finalizeDraw` and proven in `11-other.test.ts`).

## Known Limitations

- 3-7-6-1 replacement play is implemented for both the `playCard` command
  path and effect-driven plays (`play`/`playThisCard` actions, search-to-play,
  reveal-from-Life plays, and `playCard` costs): the playing player chooses 1
  of their Characters to trash as rule processing, then the play completes
  into the freed slot. Residual: grouped plays (`playGrouped`) still cap
  selections at open Character-area slots instead of chaining replacements.
- The `don-deck` validation rule passes when no DON!! cards are submitted
  (the deck API has no DON!! slot); once present, exactly 10 is enforced.
- During setup (before `startGame`), projections show 0 Life and larger deck
  counts; Life is placed at game start per 5-2-1-6 → 5-2-1-7 ordering.
- Mid-game `OnePieceTestEngine.create` fixtures (`skipSetup: true`) start at
  `turnNumber` 3 so both seats are past 6-5-6-1; tests that must exercise a
  player's first-turn battle ban pass `{ turnNumber: 1 }` (or `2`). Fixture
  `playedOnTurn: 1` is remapped to the effective turn number (legacy
  "played this turn" convention when fixtures always started at turn 1).


## Runner wiring

The rules suite is included in the engine package default Vitest include
(`packages/engine/vite.config.ts` → `tests/rules/**/*.test.ts`). Run with:

```sh
cd packages/engine && vp test run tests/rules
```

## Engine Repairs Driven By This Suite

Writing the specification exposed and fixed these rule violations:

- 6-5-6-1: neither player can battle on their first turn. Tracked per seat via
  `PlayerState.turnsStarted` (not absolute game-turn indices), so an early
  extra turn cannot let the second player battle on their first active turn.
  [Rush] does not override this.
- 6-4-1: the first player now receives 1 DON!! on their first turn.
- 5-2-1-7 / 2-9-2-1: starting Life order corrected (deck-top card at the
  bottom of the Life stack); Life is placed after the mulligan per 5-2-1-6.
- 7-1-1-4 / 7-1-2-3 / 7-1-3-3: battle ends without damage when the attacker or
  target leaves the area at a step boundary.
- 10-2-2-1 / 10-2-3-1 / 6-5-5 / 6-5-6: `playCard`, `activateEffect`,
  `attachDon`, and `declareAttack` are rejected while a battle is in progress.
- 3-1-6: modifiers, once-per-turn usage (10-2-13-4), and battle history reset
  when a card leaves the field (new card in a new area); negation state is
  snapshotted so [On K.O.] activation checks stay correct (10-2-17-1).
- 4-9-2-1: competing set-base-power effects resolve highest-wins through a
  dedicated `basePower` modifier family.
- 8-6-1: coincident trigger timings resolve turn player first.
- 3-7-6-1: playing a sixth Character reveals the card, trashes one Character
  as rule processing (no effects, 3-7-6-1-1 / 10-2-1-3), then completes the
  play.
- 5-1-2 / 5-1-2-1 / 5-1-2-2: deck validation enforces exactly 50 main-deck
  cards, Character/Event/Stage only, and Leader-color legality (unlimited
  copies cards remain color-checked; 5-1-2-4 replaces only the copy limit).
- Card definitions: EB03-009 Makino (power 0, counter 2000) and EB03-050
  Conis (power 0) now carry their printed values.
