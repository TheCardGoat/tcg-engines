# One Piece Testing

This submodule is a copied One Piece simulator snapshot with engine, cards,
types, utils, and tooling. Browser gameplay is handled by the game-agnostic
simulator in `../agnostic-simulator`.

## Test Boundaries

Engine behavior is centered in `packages/engine/tests/index.test.ts` and
`packages/engine/tests/test-engine.test.ts`. These tests cover match creation,
projection, mulligan/start, legal commands, patches, prompts, attack/counter
flow, triggers, replay determinism, unsupported capability issues, and
invariant failures.

Test fixtures and command helpers live in `packages/engine/src/testing`.
Card and engine tests should drive real commands through `OnePieceTestEngine`
instead of mutating state directly, except for fixture and invariant tests.

The Comprehensive Rules are pinned as executable specifications in
`packages/engine/tests/rules/`, one file per chapter with rule-cited test
names. The engine package Vitest include loads `tests/rules/**/*.test.ts`.
`docs/rules-test-coverage.md` indexes the mapping, classifies non-executable
rules, and lists known limitations. From `packages/engine`:

```sh
vp test run tests/rules
```

Parser and import edge cases belong in `tools/op-card-parser/tests`, not in
engine happy paths. Catalog/type utility checks live in `packages/cards/tests`,
`packages/types/tests`, and `packages/utils/tests`.

## Card Tests

**Authoritative behavior tests** live under:

```text
packages/engine/tests/cards/**/*.test.ts
```

Requirements (see also `docs/unit-test-strategy-analysis.md`):

1. Every non-vanilla canonical ability card has at least one **command-driven**
   test in this tree (enforced by `behavior-coverage-gate.test.ts`).
2. Tests use `OnePieceTestEngine` and **user-like** helpers: `play`,
   `activateMain`, `choose`, `accept`, `decline`, `attack`, `passTurn`.
3. Test names and bodies should be readable by non-engineers: arrange the
   board, act as a player would, assert what that player sees.
4. Vanillas are covered by parameterized play-through + catalog tests in
   `tests/cards/vanilla-character-*.test.ts`.

Generated placeholders under `packages/engine/src/cards/**/*.test.ts` that only
call `validateCardAbility(card)` are **not** behavior proof and are excluded
from the default engine suite. Do not add new ones.

Broad edge cases belong in shared engine modules (targeting, prompts, combat,
DON!!, zones), not copied into every card file.

## Bot Automation

Two challenging oracle bots live in
`packages/engine/src/automation/heuristic-strategy.ts`:

| Id | Style | Role |
|----|--------|------|
| `heuristic` | Balanced board-control / value | Promoted production default (`promotions/current.json`) |
| `aggressive` | Life-race tempo | Complementary challenger |

Both score main-phase commands and resolve blocker/counter/trigger/target
prompts through the `OnePieceBotAgent` interface in `bot-strategies.ts`.
Weaker baselines: `value-ranked`, `greedy`, `first-legal`, `random`.

Diverse archetype decks for benchmarks live in
`packages/engine/src/automation/test-decks.ts` (six mono-color archetypes plus
ST01 in bot-lab). Run ad-hoc deck-pair benchmarks from `packages/engine`:

```sh
bun run src/automation/benchmark.ts --games=20 --full
bun run src/automation/benchmark.ts --games=12 --decks=red-aggro,blue-control --challengers=heuristic,aggressive --opponents=firstLegal,random,greedy
RUN_OP_BOT_BATCHES=1 vp test run src/automation
```

### Bot-lab (gauntlet / tournament)

The cross-game CLI is `pnpm bot-lab` (from repo root) or
`submodules/agnostic-simulator/tools/bot-lab`. One Piece suites:

| suiteId | Decks |
|---------|-------|
| `smoke` | ST01 + red/blue/green sample (3 pairs) |
| `promotion` | ST01 + 6 archetypes, mirror + cyclic cross (14 pairs) |
| `tournament` | Fixed randomized cross pairings of all 7 decks (7 pairs) |

```sh
# From repo root
pnpm bot-lab doctor --game one-piece

# Generate manifests with live engineRevision/catalog hashes, then evaluate
cd submodules/agnostic-simulator/tools/bot-lab
bun ./src/cli.ts evaluate --game one-piece \
  --candidate examples/one-piece-tournament-heuristic-vs-value.json \
  --out reports/op-tournament-heuristic-vs-value.json
```

Committed example manifests under `tools/bot-lab/examples/one-piece-*.json`
must be regenerated after engine or catalog changes (revisions are content
hashes). Evaluation reports belong in `reports/` or a scratch dir — do not
commit full match logs.

Benchmark batches must stay at zero illegal commands and zero stuck games;
investigate any regression as an engine or bot-logic defect before tuning.

## Commands

From repo root:

```sh
bun run ci:one-piece:check
bun run ci:one-piece
```

From `submodules/one-piece`:

```sh
vp install
pnpm run ci-check
pnpm run ci-check-full
vp run ci:check
vp run ci:full
```

Focused package examples:

```sh
vp run @tcg/op-engine#test
vp run @tcg/op-card-parser#test
```

Or from a package directory:

```sh
vp test run
```

## Caveats

The One Piece runtime and platform web content/deck code use `one-piece`.
Check the layer before changing slugs.

Per-card generated tests and card coverage inventory are not currently enough
to prove printed card behavior. Treat executable engine-command happy paths as
the required standard for new card work.

Before rules-facing work, read `.agents/skills/op-rules/comprehensive-rules.md`.
