# `automation/` — AI player layer

Pluggable AI players that drive the engine through the **same public surfaces a real client uses** — never raw `MatchState`, the effect bag, the trigger queue, or zone internals. Anything an AI does, a human player could do via `LocalEngine.processCommand`; anything a human player can do, an AI can do via the same public APIs.

## Current capabilities

What the AI layer ships today, at a glance:

**Strategies** — built-ins are boundary-clean:

- `defaultStrategy` — production-like heuristic selected by the `"default"` strategy id. It shares the greedy board-development plan but avoids Unit fights where the attacker dies and avoids direct attacks that a ready rival `BLOCKER` can profitably eat.
- `firstLegalStrategy` — picks the first actionable move; smoke-test bot.
- `randomStrategy` — uniform-random over actionable moves and candidates; deterministic given the seed; the cheapest fuzz opponent.
- `greedyStrategy` — static priority list with rival-aware adjustments: prefers blockers when threats are unanswered, deprioritises `sellCard` when rival is one gig from winning, switches to all-in attack mode when we're at gigCount ≥ 5, attaches gear to the strongest friendly unit, blocks during the defensive step instead of passing, runs a hand-quality mulligan heuristic.
- `passOnlyStrategy`, `attackUnitOnlyStrategy`, `callLegendOnlyStrategy` — forced test strategies for targeted simulator and QA scenarios.
- `monteCarloStrategy` — flat Monte Carlo: enumerates every legal action, forks the engine, runs K random rollouts (default 10) per candidate to game-end, picks the action with the highest empirical win-rate. Slower per decision but actually evaluates outcomes; outperforms the heuristic strategies in head-to-head play. Tunable via `createMonteCarloStrategy({ rolloutsPerAction, maxRolloutSteps, rolloutStrategy })`.
- `monteCarloGreedyStrategy` — same flat Monte Carlo framework but rollouts use `greedyStrategy` for both sides instead of random. Sharper win-rate signal because plausible play replaces noise; each rollout is more expensive so K must stay small. Recommended for balance/playtest runs.
- `mctsStrategy` — UCB1 / MCTS proper. Maintains a search tree across N iterations (default 50) within a single decision: select via UCB1 → expand one untried action → simulate rollout → backpropagate. After the budget, picks the root child with the highest visit count. Two-player aware (each node's `playerToMove` and per-player reward map) so UCB1 selection optimises from the parent's perspective. **Persistent tree across decisions**: caches the chosen child after each call (per-engine `WeakMap`); the next decision reuses any descendant whose stateID matches the live engine, inheriting the accumulated visits/rewards instead of rebuilding from scratch. Tunable via `createMctsStrategy({ iterations, explorationConstant, maxRolloutSteps, rolloutStrategy })`.
- `mctsGreedyStrategy` — MCTS with `greedyStrategy` rollouts instead of random.

**Resolvers** — every pending-choice variant the engine emits has a real heuristic:

- `searchDeck` filters revealed cards by `cardTypes` / `classifications` / `minCost` / `maxCost` / `minPower` / `maxPower`.
- `chooseTarget` handles both `discardFromHand` (cheapest cards) and `adjustGig` (own die → max face, rival die → min face).
- `chooseGigsToSteal` picks highest-face dice (max Street Cred swing).
- `chooseCardToPlay` picks highest-impact (`effectivePower → cost → id`).
- `chooseCardToMove` flips direction by destination — favourable destinations get the strongest card, unfavourable get the weakest sacrifice.
- `chooseEffect` returns `stuck` (no card emits it today; payload shape is locked as `options: ChooseEffectOption[]` so the first modal-effect card has a clear contract — see [Known limitations](#known-limitations)).

**Engine surface** — every move, every pending choice, every reachable game state has prompt support:

- `playCard` supports both regular cards and gear (with attach-target candidates).
- `activateAbility` projects `(cardId, abilityIndex)` candidates with full cost-payment validation.
- `mulligan`, `passPhase`, `useBlocker`, `attackUnit`, `attackRival`, `callLegend`, `sellCard`, `resolveAttack`, `resolveCardToPlay`, `resolveCardToMove`, `resolveSearchDeck`, `resolveDiscardFromHand`, `resolveAdjustGig`, `resolveStealGigs` — all reachable via the AI surface.

**Operational tooling** — `tools/ai-runner` CLI exits with code 2 on illegal moves, so it's CI-safe:

- Single matchup, tournament round-robin, verbose match-log dump, real-cards mode (`@tcg/cyberpunk-cards`), and parallel worker threads for large statistical runs.

**Verification** — 690 engine + ai-runner tests. Recent smoke runs across 100+ matches in every strategy pairing (fixture and real cards): **0 illegal moves**, every match terminates on a real `winCondition`.

## Architecture

```
                    ┌───────────────────────────────────┐
                    │             AIStrategy            │
                    │  decideAction(ctx) → MoveDecision │
                    │  decideChoice?: Partial<Map>      │
                    └────────────────┬──────────────────┘
                                     │ used by
                                     ▼
┌──────────────────┐         ┌──────────────────┐        ┌──────────────────────┐
│   runAutoMatch   │ ─drives→│     AIPlayer     │ ─via──→│ defaultChoiceResolvers│
│   (bot-vs-bot)   │         │  step / takeTurn │        │   (per pending-choice)│
└──────────────────┘         └────────┬─────────┘        └──────────┬───────────┘
                                      │                              │
                                      │ buildDecisionContext()       │
                                      ▼                              ▼
                              ┌────────────────────────────────────────┐
                              │         DecisionContext (read-only)    │
                              │  view: FilteredMatchView               │
                              │  prompt: PlayerPrompt                  │
                              │  rng: () => number                     │
                              └────────────────┬───────────────────────┘
                                               │ wraps
                                               ▼
                              ┌────────────────────────────────────────┐
                              │  LocalEngine — public surface only:    │
                              │   getFilteredView · getPrompt          │
                              │   processCommand                       │
                              └────────────────────────────────────────┘
```

## Files

| Path                   | Role                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`             | `AIStrategy`, `DecisionContext`, `MoveDecision`, `StepResult*`, `ChoiceResolverMap`                                                            |
| `ai-player.ts`         | The single-player driver: `step()`, `takeTurn()`, dispatches to strategy or resolver                                                           |
| `decision-context.ts`  | Builds the read-only context passed to strategies/resolvers                                                                                    |
| `run-auto-match.ts`    | Bot-vs-bot harness with per-step logging and a `maxSteps` safety cap                                                                           |
| `strategies/`          | Pure-view built-ins: `firstLegalStrategy`, `randomStrategy`, `greedyStrategy`, plus `move-args.ts` (the `AvailableMove → MoveDecision` mapper) |
| `search/`              | Engine-aware strategies: `monteCarloStrategy` (flat MC), `mctsStrategy` (UCB1 tree search), and `shared.ts` (action enumeration + rollout)     |
| `resolvers/`           | Default per-variant pending-choice resolvers, exported as `defaultChoiceResolvers`                                                             |
| `util/assert-never.ts` | Exhaustive-switch helper used at every dispatch site                                                                                           |

## Hard contracts

### 1. Player boundary

Strategies and resolvers see **only** `FilteredMatchView` + `PlayerPrompt`. They never import from `state/`, `active-effects/`, `triggers/`, `operations/`, or `command/`. This is enforced by `tests/automation/boundary.test.ts`, which lints the `automation/` directory for forbidden imports.

If your strategy needs information that isn't in the filtered view, the right fix is to expand the filtered view (and decide whether the new field would be safe to show a human opponent), not to reach into engine internals.

### 2. Type-level exhaustiveness

The harness is designed so adding a new move id, a new pending-choice variant, or a new prompt status is a **compile error** until the AI layer is updated:

- `MoveId` is derived from the `MOVE_IDS` const tuple (single source of truth)
- `ChoicePrompt` is a discriminated union keyed by `PendingChoiceType`
- `ChoiceResolverMap = { [K in PendingChoiceType]: ChoiceResolver<…> }` — adding a new pending-choice variant breaks `defaultChoiceResolvers` until you add a resolver
- Every dispatch site (`AIPlayer.runResolver`, `decisionFromMove`, `greedy.priorityOrder`, `runAutoMatch` step switch) ends in `assertNever(x, "…")`
- `tests/automation/exhaustiveness.test.ts` is a runtime belt-and-braces guard against widening a type back to `string`

### 3. Strategies cannot crash the loop

Every strategy/resolver returns `MoveDecision = { kind: "command" } | { kind: "stuck"; reason }`. A strategy that doesn't know what to do says so; the driver surfaces it as a `StepResult` rather than throwing. The harness aborts a match on `stuck` or `illegal`, never silently retries.

## The decision lifecycle

`AIPlayer.step()` performs exactly one decision:

1. Build `DecisionContext` from the engine's public surfaces.
2. If `view.gameEnded` → `idle`.
3. Switch on `prompt.status`:
   - `idle` / `waiting` → `idle` (other player's turn or game over)
   - `choice` → look up the resolver for `prompt.choice.type` (strategy override → default), call it
   - `action` → call `strategy.decideAction(ctx)`
4. Dispatch the resulting `MoveDecision`:
   - `stuck` → `StepResult { kind: "stuck", pendingType }`
   - `command` → `engine.processCommand(...)`; `success: false` becomes `illegal`, success becomes `acted`

`takeTurn()` loops `step()` until it returns `idle | stuck | illegal` (or a per-turn `maxSteps` cap is hit).

`runAutoMatch()` loops both AIs against each other until the engine signals `gameEnded`, an AI gets `stuck`/`illegal`, or the global `maxSteps` (default 5000) is exceeded.

## Authoring a strategy

```ts
import type { AIStrategy } from "@tcg/cyberpunk-engine";

export const myStrategy: AIStrategy = {
  name: "my-strategy",
  decideAction(ctx) {
    // ctx.prompt.availableMoves: AvailableMove[] with inputSpec for each
    // ctx.view: FilteredMatchView (player-safe projection)
    // ctx.rng(): seeded number in [0, 1)
    return { kind: "command", move: "passPhase" };
  },
};
```

`decideAction` is the only required method. To override how a specific pending choice is resolved (instead of using the shared default), add `decideChoice` — it's a `Partial<ChoiceResolverMap>`:

```ts
export const myStrategy: AIStrategy = {
  name: "my-strategy",
  decideAction(ctx) {
    /* … */
  },
  decideChoice: {
    chooseCardToPlay: (choice, ctx) => {
      // Override only this variant. All other pending-choice variants
      // still use defaultChoiceResolvers.
      return {
        kind: "command",
        move: "resolveCardToPlay",
        args: { cardId: choice.payload.cardIds[0] },
      };
    },
  },
};
```

### `decisionFromMove` helper

`strategies/move-args.ts` exports `decisionFromMove(available, picker)` which knows how each move's args are shaped from its `inputSpec`. A strategy supplies an `ArgPicker` that picks **which** candidate(s) to use; the helper handles the boilerplate of building the `MoveDecision`. Use this rather than constructing `args` by hand — it keeps the move-id → args mapping in one place and benefits from the `MoveId` exhaustive switch.

## Built-in strategies

| Strategy                   | Purpose                                  | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `firstLegalStrategy`       | Smoke-test bot — runnable but not strong | Picks the first **actionable** move (skips moves with empty candidate lists and repeated blocker redirects), prefers any meaningful action, falls back to `passPhase`, and only chooses `concede` when nothing else is available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `randomStrategy`           | Stress-test bot, RNG-driven              | Picks uniformly at random from the actionable moves and candidates, using `ctx.rng`. Deterministic given the seed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `greedyStrategy`           | Reasonable opponent for balance work     | Dynamic priority list driven by game state. Default order `attackRival → attackUnit → activateAbility → playCard → callLegend → sellCard → useBlocker → passPhase → resolveAttack`. When the rival is one gig from winning (`gigCount ≥ 5`), `sellCard` is deprioritised below `passPhase` so we don't trade hand size for marginal eddies. `useBlocker` always sits above `resolveAttack` so the strategy actually blocks during the defensive step instead of passing the attack through, but it skips `useBlocker` after this attack has already been redirected by a blocker. Rival-aware `playCard`: when the rival has an unanswered ready unit, switches from "highest cost" to "highest-power blocker". Otherwise picks highest-cost cards to play (gear attaches to highest-power friendly unit); lowest-cost to sell; only attacks when power ≥ defender; uses the cheapest, lowest-power blocker on the first redirect; activates the first available ability; mulligans the opening hand when it lacks ≥ 2 cards costing ≤ 2 or has no Sell-Tag card for eddie ramp. |
| `monteCarloStrategy`       | Search-based opponent (engine-aware)     | Flat Monte Carlo. For every legal action, forks the engine via `EngineHandle`, applies the action, then runs K random rollouts to game-end (default `rolloutsPerAction = 10`, `maxRolloutSteps = 200`). Picks the action with the highest empirical win-rate. Boundary-clean: only sees `EngineHandle` (filtered view + prompt + processCommand + fork), not raw state. Lives at `automation/search/monte-carlo.ts` outside the strict `strategies/` boundary because it imports `CommandEnvelope` directly to build sim commands.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `monteCarloGreedyStrategy` | Higher-fidelity Monte Carlo              | Same framework as `monteCarloStrategy`, but `rolloutStrategy = greedyStrategy`. Each rollout walks greedy's heuristics for both sides instead of one `rng()` per decision — the win-rate signal is much sharper (plausible play vs noise), at the cost of more work per rollout. Strong default for balance/playtest.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `mctsStrategy`             | UCB1 tree search (engine-aware)          | Builds a search tree across N iterations (default 50) within one decision. Each iteration: UCB1-selects a leaf → expands one untried action → rollout to game-end → backpropagates result. Each node tracks `playerToMove` and a per-player reward map so two-player UCB1 selects from the parent's perspective. Picks the root child with the highest visit count (tie-broken by win-rate, then move id). Lives at `automation/search/mcts.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `mctsGreedyStrategy`       | UCB1 tree search with greedy rollouts    | Same as `mctsStrategy` but `rolloutStrategy = greedyStrategy`. Slowest of the search strategies but the highest play strength.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**None of these are strong play.** They're fast, deterministic, and good enough to surface engine bugs (illegal moves, deadlocks). For real opponent AI, write a new strategy — the boundary contract makes that safe.

## Default resolvers (for pending choices)

`defaultChoiceResolvers` provides one entry per `PendingChoiceType`. Resolvers are intentionally **deterministic** (sorted-by-id ties, cheapest/highest-cost preferences) so a strategy that wants randomness opts in via `ctx.rng` rather than inheriting nondeterminism it didn't ask for.

Some defaults intentionally return `stuck` because the choice can't be safely resolved without information that isn't in the player view (e.g. `chooseEffect` — see "Known gaps" below). Strategies that care about those variants must override `decideChoice` for them.

### Variants emitted today

| Variant             | Engine emitter                                                   | Resolver behaviour                                                                                                                              |
| ------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `searchDeck`        | `handleSearchDeck` (effect handler)                              | Filters `revealedCards` by `target` (`cardTypes` / `classifications` / `maxCost`); picks deterministically up to `select.max` (or all matching) |
| `chooseTarget`      | `handleDiscardFromHand`, `handleAdjustGig`                       | `discardFromHand`: cheapest hand cards. `adjustGig`: own die → max face; rival die → 1; `direction: "either"` → ownership-driven                |
| `chooseGigsToSteal` | `resolveAttack` (direct attack with > steal-count eligible dice) | Picks highest-face dice (max Street Cred swing); ties by id                                                                                     |
| `chooseCardToPlay`  | Triggered "play one of these" effects                            | Picks highest-`effectivePower`, then highest-cost, then id                                                                                      |
| `chooseCardToMove`  | Triggered "move one of these" effects                            | Favourable destination (field/hand) → highest-impact; unfavourable (trash/deckBottom/unknown) → lowest-impact; pass when no candidates          |
| `chooseEffect`      | _Not emitted today_ (placeholder for future modal-effect cards)  | Returns `stuck` — see TODO in `resolvers/choose-effect.ts`                                                                                      |

## Player view surface (for strategy authors)

A strategy reads everything from `ctx.view` (`FilteredMatchView`) and `ctx.prompt` (`PlayerPrompt`). The fields below are what's currently projected; missing card metadata cannot be inferred from raw state because that would cross the boundary contract.

**`FilteredCardView` — per-card projection**

| Field                                   | Notes                                                                |
| --------------------------------------- | -------------------------------------------------------------------- |
| `instanceId`, `definitionId`            | The latter is `""` when face-down to the viewer                      |
| `zone`, `faceDown`, `spent`, `damage`   | Game-state flags                                                     |
| `power`, `effectivePower`               | `effectivePower` includes active-effect modifiers                    |
| `cost`                                  | Printed cost. `null` when face-down                                  |
| `type`                                  | `"legend" \| "unit" \| "gear" \| "program"`. `null` when face-down   |
| `classifications`                       | Faction tags (`"Netrunner"`, `"Cyberware"`, …). Empty when face-down |
| `hasSellTag`                            | True when the card carries the Sell Tag (`€$`). False when face-down |
| `attachedGearIds`, `attachedToId`       | Attachment graph                                                     |
| `playedThisTurn`, `hasAttackedThisTurn` | Turn-scoped meta                                                     |
| `grantedRules`, `keywords`              | Active rules text + printed keywords                                 |

**`MoveInputSpec` variants** — every `AvailableMove` carries one:

- `none` — move takes no args
- `selectCard { candidates: string[] }` — pick one card id
- `selectPair { fromCandidates, toCandidates }` — pick attacker + defender ids
- `selectAbility { candidates: { cardId, abilityIndex }[] }` — pick an activated ability
- `playCard { candidates: { cardId, attachTargets? }[] }` — gear has `attachTargets`, others don't

**`attackState`** — projected while an attack is in progress:

- `attackerId`, `defenderId`, `kind`, `step` — current attack state machine.
- `redirectedByBlocker` — true after `useBlocker` has already redirected this attack.

**Choice prompts** — pending-choice payloads (see [Variants emitted today](#variants-emitted-today)). Each variant projects everything the corresponding engine resolve-move's `validate` checks, so strategies can pre-filter without crossing the boundary.

## Notable design decisions

**StepResult is a tagged union with `acted | idle | stuck | illegal`.** The driver never silently retries an illegal command — illegal moves indicate a bug somewhere (engine validation drift or a strategy violating the type contract), and the harness surfaces them loudly so they aren't lost. `acted` carries the new `stateID` so callers can correlate steps with state snapshots.

**No `noProgress` detector.** An earlier version compared `stateID` before/after `acted` to detect "spinning" loops. But `processCommand` always increments `stateID` on success, so the comparison was unreachable dead code. Removed in favor of the global `maxSteps` cap as the only safety net.

**`pickActiveAi` is sort-by-active.** Both AIs may have actionable prompts at once (e.g. one on `action`, the other on `choice` for a triggered ability they own). The harness prefers the engine's `activePlayerId` first, falling back to whoever has an actionable prompt — this matches the order a human-vs-human client would prompt the players.

**Greedy never accesses raw state.** Even the heuristics (`pickHighestCost`, `pickFavourableFight`) walk `FilteredMatchView`. Adding card-cost / keywords to the filtered view (PR #44) was specifically to let greedy reason about plays without crossing the boundary.

**Strategies don't see opponent hand contents or deck order.** That's deliberate — the filtered view enforces it, and stronger strategies (MCTS, search) will need to do their own determinization rather than peeking. Anything else would be cheating.

**Resolvers are typed by `Extract<ChoicePrompt, { type: K }>`.** `decideChoice?.chooseTarget` only sees `ChooseTargetChoicePrompt`, not the whole union. This means narrowing inside a resolver is automatic and exhaustive sub-type switches are trivial.

## Testing & CLI

- **Boundary lint:** `tests/automation/boundary.test.ts` — fails CI if `automation/` imports an internals module
- **Exhaustiveness:** `tests/automation/exhaustiveness.test.ts` — runtime check that every `MoveId` and every `PendingChoiceType` has a handler
- **Per-strategy tests:** `tests/automation/strategies.test.ts` — unit tests for each built-in strategy's decision rules
- **Bot-vs-bot:** `tests/automation/run-auto-match.test.ts` — termination tests across multiple seeds and strategy pairings; asserts no `illegal` steps
- **CLI batch runner:** `tools/ai-runner` — exits with code 2 if any illegal moves occur, so it's CI-safe. Modes:
  - **Single matchup** (default): `--strategy-a greedy --strategy-b random --matches 25 --seed s1`
  - **Tournament**: `--tournament --matches 25 --seed t1` runs round-robin between every registered strategy and prints a win-matrix. Restrict the field with `--strategies greedy,random`.
  - **Verbose**: `-v` / `--verbose` dumps the per-step log of the first failing match (or the first match if all pass) — handy for debugging stuck/illegal results without rerunning.
  - **Real cards**: `--real-cards` swaps the hand-rolled test catalog for real `@tcg/cyberpunk-cards` decks. The deck-builder picks the first 3 legends (sorted by slug) and walks the non-legend pool greedily, respecting per-color RAM budgets totalled from the legends; refills the budget if needed to reach 40 cards. Surfaces real card-text issues that the fixture catalog can't.
  - **Parallel batches**: `--workers N` splits the matches across N worker threads (single-matchup mode only). Each worker gets a distinct seed prefix so results stay deterministic and reproducible. Falls back to single-process when matches don't justify the spawn overhead.
  - **Save / replay**: `--save-log <path>` records the first match (config + per-step log + stateID per acted step) to disk. `ai-runner replay <path>` re-runs it with the recorded seed/strategies/decks and asserts step-by-step parity, exiting with code 3 on any divergence — catches determinism regressions in CI.

## Roadmap

The roadmap is split into three buckets by what's actually blocking the work.
Items in **Next steps** are tractable improvements that can be tackled
incrementally; **Future plan** items are larger investments that warrant their
own design pass; **Known limitations** are edges that can't change without
external dependencies (a card needs the variant; the rules add a constraint).

### Next steps

These are concrete, scoped follow-ups. Roughly ordered by impact-per-effort.

1. **Engine: emit a real `chooseEffect` from a modal-effect card.** The
   payload shape is locked as `options: ChooseEffectOption[]` (each
   carrying `id`, `label`, and `effects: Effect[]`). The contract is
   spelled out at three sites tagged `CONTRACT(chooseEffect)`:
   `types/match-state.ts`, `view/player-prompt.ts`, and
   `automation/resolvers/choose-effect.ts`. Whoever lands the first
   modal-effect card needs to ship the engine handler that emits the
   choice, a new `resolveChooseEffect { optionId }` move, and a real
   AI scoring heuristic in the same change. Audit confirmed zero
   alpha cards have modal-effect text today, so this is purely
   waiting on first-card demand.

### Future plan (larger investments)

- **Card-text understanding.** Greedy's heuristics are positional. Reading
  card abilities (effects, triggers, costs) from the structured definitions
  would let strategies prefer plays that synergise with their own board
  state (e.g. play a triggered-on-attack card before swinging). Touches
  filtered view / strategy code; needs a careful boundary review of which
  ability fields are public vs. private.
- **Multi-match learning loop.** The runner could train weights on
  greedy's heuristics (e.g. "block-priority threshold", "near-win
  trigger gigCount") by running tournaments and adjusting. Would need a
  training harness and a parameterised `greedy` (currently hard-coded
  thresholds). Big effort; biggest open-ended quality lever.
- **Network-transport AI.** The boundary contract already separates
  strategies from `LocalEngine`. The same `AIPlayer` driver could front
  a remote engine over a transport (`processCommand` becomes async).
  Engine-side change to make `LocalEngine` interface async-compatible.

### Known limitations

These won't change in this layer until something external moves first.

- **`chooseEffect` returns `stuck`** until a modal-effect card lands. The
  payload shape is now locked (`options: ChooseEffectOption[]` with
  `id` / `label` / `effects`) and three `CONTRACT(chooseEffect)` markers
  document what the first card's PR must ship — engine emitter, new
  `resolveChooseEffect` move, and a real AI heuristic. Audit (run
  alongside this work) confirmed all 28 alpha cards are non-modal, so
  this is genuinely waiting on first-card demand, not a hidden gap.
- **Gear attach-target filter is permissive.** Currently any friendly
  unit qualifies. The engine's `attachGear` operation enforces no
  card-specific restrictions today (e.g. weapon→unit-only, cyberware
  on humans). When card text introduces such rules, the prompt's
  `attachTargets` list must mirror them.
- **`searchDeck` filter symmetry must be maintained.** The resolver
  covers `cardTypes` / `classifications` / `minCost` / `maxCost` /
  `minPower` / `maxPower`; the engine's `validate` covers the first
  three. If either side grows past this set, mirror the change in the
  other. Cross-referenced in `resolvers/search-deck.ts` so drift is
  caught at code-review time.
- **No multi-turn lookahead in greedy.** Greedy is a static-priority
  bot by design. Lookahead is the job of the planned MCTS strategy
  (see [Next steps](#next-steps)), not a modification to greedy.
- **Strategies don't see opponent hand contents or deck order.** This
  is deliberate cheating prevention. Stronger strategies (MCTS,
  search) need to do their own _determinisation_ — sample plausible
  hands from the public-info constraints — rather than peek at hidden
  state. The boundary lint enforces this.
