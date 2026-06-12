# Cyberpunk TCG Engine — Implementation Plan

## Architecture Decisions

| Decision         | Choice                    | Rationale                                                             |
| ---------------- | ------------------------- | --------------------------------------------------------------------- |
| Engine type      | Game-specific             | Existing types are rich and Cyberpunk-specific. Faster to ship.       |
| State management | `mutative`                | Immutable updates + patches for undo/replay/delta. Fastest option.    |
| Gig dice         | First-class entities      | Not cards. Separate model with id, dieType, faceValue, location.      |
| TargetDSL        | Extend existing           | `@tcg/cyberpunk-types` already has it. Add resolution-time selectors. |
| Effect model     | Use existing Effect union | Already defined with 18 effect types. Build resolver for each.        |
| Package dep      | Engine → types only       | Cards injected at runtime via catalog. Keeps engine testable.         |

## Dependency Graph

```
@tcg/cyberpunk-types       (no game deps)
  ↑
@tcg/cyberpunk-cards       (imports types)
  ↑
@tcg/cyberpunk-engine      (imports types; receives cards via injection)
  ↑
@tcg/cyberpunk-simulator   (imports everything)
```

---

## Phase 1: State Foundation

**Goal**: Define all runtime state types and initial state creation.

**Files**:

```
packages/engine/src/
  types/
    branded.ts              ← CardInstanceId, PlayerId, GigDieId (branded strings)
    card-instance.ts        ← CardInstance, CardMeta (runtime card with zone, controller, state)
    gig-die.ts              ← GigDie (id, dieType d4-d20, faceValue, location)
    zone-types.ts           ← ZoneKey, ZoneVisibility, ZoneConfig for each Cyberpunk zone
    match-state.ts          ← MatchState = { G: GameState, ctx: EngineCtx }
    commands.ts             ← CommandEnvelope, CommandResult, MoveInput
    game-events.ts          ← GameEvent union (cardMoved, damageDealt, gigStolen, etc.)
    index.ts
  state/
    initial-state.ts        ← createInitialState(players, catalog, seed) → MatchState
    zone-registry.ts        ← Zone configs for Cyberpunk zones
    index.ts
```

**State shape**:

```typescript
interface GameState {
  players: Record<string, PlayerState>;
  gigDice: GigDie[]; // All dice in the game
  turnMetadata: TurnMetadata; // Track per-turn limits
  continuousEffects: ContinuousEffect[]; // Ongoing modifiers
  effectBag: BagEntry[]; // Pending triggered effects
  gamePhase: GamePhase; // setup | play | attack | end
  attackState?: AttackState; // Active attack resolution state
}

interface PlayerState {
  zones: {
    legendArea: string[]; // CardInstanceIds (start face-down)
    field: string[]; // CardInstanceIds (units + their gear)
    hand: string[]; // CardInstanceIds
    deck: string[]; // CardInstanceIds (ordered)
    trash: string[]; // CardInstanceIds
    eddieArea: string[]; // CardInstanceIds (sold cards, face-down)
  };
  eddies: number; // Available eddie count
  fixerArea: string[]; // GigDieIds
  gigArea: string[]; // GigDieIds
  soldThisTurn: boolean;
  calledLegendThisTurn: boolean;
  calledLegendThisRivalTurn: boolean;
  firstPlayer?: boolean;
  mulliganDone: boolean;
}

interface CardMeta {
  spent: boolean;
  faceDown: boolean;
  damage: number;
  powerModifier: number;
  counters: Record<string, number>;
  attachedGearIds: string[];
  attachedToId?: string;
  playedThisTurn: boolean;
  hasAttackedThisTurn: boolean;
  grantedRules: RuleModifier[];
}
```

**Key design**: Zones store card instance ID arrays. A separate `cardIndex: Map<string, CardInstance>` gives O(1) card lookup. Each zone has a visibility rule used by the view filter.

**Deliverables**: State types compile. `createInitialState` produces valid initial state from player deck lists.

### Phase 1 Notes

**Completed**: All state types defined. `createMatchState` produces valid initial state with:

- Shuffled legends (face-down), shuffled decks, 6-card hands
- 6 gig dice per player in fixer area (d4-d20)
- First player gets 2 spent legends
- Seeded RNG for reproducibility
- Card index for O(1) lookup by instance ID
- 9/9 engine tests pass

## Phase 2: Command Processing & Operations

**Goal**: The core state machine that processes commands and produces patches.

**Files**:

```
packages/engine/src/
  command/
    processor.ts            ← processCommand(state, cmd, playerId) → CommandResult
    validation.ts           ← validateCommand (checks phase, priority, legality)
    move-types.ts           ← MoveDefinition interface, MoveContext
    index.ts
  operations/
    zone-ops.ts             ← moveCard, drawCards, shuffle, mill, discard
    card-ops.ts             ← spend, ready, setMeta, attachGear, detachGear
    game-ops.ts             ← spendEddies, gainEddies, checkWinCondition, setPhase
    event-emitter.ts        ← Emit game events during mutations
    index.ts                ← createOperations(draft, ctx) → Operations
```

**Command processing pipeline**:

```
CommandEnvelope → validateCommand → executeMove(draft) → emit events → produce patches
                                              ↑
                                    operations layer (zone/card/game ops)
```

**Undo support**: Each command stores `[patches, inversePatches]` from mutative. `undo()` applies inverse patches.

**Deliverables**: `processCommand` works end-to-end. Operations layer handles all state mutations with event emission.

### Phase 2 Notes

**Completed.** Mutative `create()` with `enablePatches` returns `[newState, patches, inversePatches]` tuple. Operations layer uses `Draft<GameState>` + event accumulator array. All mutations go through `createOperations()` which returns `{ zone, card, game, gig, event }` sub-apis. Moves receive `operations: Operations` in their execution context.

## Phase 3: Core Moves

**Goal**: Implement all player-facing moves.

**Files**:

```
packages/engine/src/moves/
  play-card.ts              ← Play unit/program/gear (pay cost, resolve PLAY trigger)
  play-gosolo.ts            ← GO SOLO: play as ready unit that can attack
  sell-card.ts              ← Sell for 1 eddie (hasSellTag check)
  call-legend.ts            ← Flip face-down legend for 2 eddies, resolve FLIP trigger
  attack-unit.ts            ← Attack spent rival unit → fight resolution
  attack-rival.ts           ← Direct attack → steal gigs
  use-blocker.ts            ← Defensive interrupt: redirect attack
  pass-phase.ts             ← End current phase
  concede.ts                ← Forfeit
  mulligan.ts               ← Shuffle hand back, draw 6
  choose-first-player.ts    ← First player selection
  index.ts                  ← Move registry
```

**Attack resolution state machine**:

```
declareAttack → [ATTACK trigger] → defensiveWindow → [BLOCKER check] → resolve
                                                                    ↓
                                                          fight or steal gigs
```

**Deliverables**: All moves defined. Basic game flow works.

### Phase 3 Notes

**Completed.** 10 moves: playCard, sellCard, callLegend, attackUnit, attackRival, useBlocker, passPhase, concede, mulligan, resolveAttack. Attack flow has 3-step state machine (offensive → defensive → resolve). Turn end in passPhase handles draw, gig take, ready, win check, overtime.

## Phase 4: Effect Resolution Engine

**Goal**: Resolve every Effect type and evaluate every Condition type.

**Files**:

```
packages/engine/src/effects/
  context.ts                ← EffectResolutionContext
  resolver.ts               ← resolveEffect(effect, ctx) → result
  target-resolver.ts        ← resolveTarget(TargetDSL, ctx) → string[]
  condition-evaluator.ts    ← evaluateCondition(Condition, ctx) → boolean
  amount-resolver.ts        ← resolveNumericValue(NumericValue, ctx) → number
  handlers/
    draw.ts, defeat.ts, spend.ts, ready.ts, return-to-hand.ts,
    modify-power.ts, modify-gig.ts, adjust-gig.ts, grant-rule.ts,
    search-deck.ts, move-card.ts, play-card.ts, steal-gig.ts,
    discard.ts, trash-from-deck.ts, if-you-do.ts, delayed.ts,
    look-at.ts, remove-from-game.ts
    index.ts                ← Handler registry
  index.ts
```

**Target resolver** — single consolidated TargetDSL:

| TargetDSL selector | Resolution logic                                            |
| ------------------ | ----------------------------------------------------------- |
| `self`             | Card that owns the ability                                  |
| `host`             | Card the gear is attached to                                |
| `bound`            | Look up bound target by id from ability bindings            |
| `context`          | Dynamic target from resolution context                      |
| `card`             | Query: filter all card instances by zone, type, color, etc. |
| `gig`              | Query: filter gig dice by controller, value/sides           |

**Read optimization**: Resolver receives read-only snapshot. Derived values computed lazily.

**Deliverables**: All 18 effect types handled. All 10 condition types evaluated.

### Phase 4 Notes

**Completed.** Target resolver handles all 6 selectors (self, host, bound, context, card, gig). Condition evaluator handles all 10 conditions. 18 effect handlers registered. Effect handler result is discriminated union (resolved/suspended/partial). `ifYouDo` returns partial with remaining effects.

## Phase 5: Turn Flow & Triggers

**Goal**: Full turn lifecycle and triggered ability system.

**Files**:

```
packages/engine/src/flow/
  setup.ts, turn-lifecycle.ts, phase-transitions.ts, priority.ts
packages/engine/src/triggers/
  matching.ts, bag.ts, replacement.ts
packages/engine/src/static-effects/
  registry.ts, materialize.ts
```

**Turn structure**:

```
Setup: shuffle legends, shuffle deck, place gig dice, random first player, draw 6, mulligan
Start of Turn: draw 1, take 1 gig die, ready all spent
Play Phase: sell, call legend, play cards (any order)
Attack Phase: sequential attacks, full resolution each
End of Turn: check win (6+ gigs), clear turn metadata, switch player
```

**Deliverables**: Full game loop works. Triggers fire at correct timing.

### Phase 5 Notes

**Completed.** `startTurn` draws 1, takes fixer die, readies cards. `checkWinConditions` checks gig >= 6 and deck-out. Trigger matching handles cardPlayed, attackDeclared, legendFlipped, legendCalled, cardDefeated, gigStolen, gigValueChanged. Static effects compute effective power, keywords, rules, street cred.

## Phase 6: View Filtering & Projection

**Goal**: Per-player filtered views for the UI.

**Files**:

```
packages/engine/src/view/
  filter.ts, projection.ts, animations.ts
```

**Visibility rules**: hand (owner sees all, opponent sees count), field (public), legends (face-down hidden), eddieArea (owner sees, opponent sees count), gig/fixer areas (public).

**Delta patches**: Server sends `{ stateID, patches }` after each command.

**Deliverables**: Filtered views work. Board projection computes derived stats.

### Phase 6 Notes

**Completed.** filterMatchView hides opponent hand (shows count only), deck (count only). Face-down legends show no definitionId. Gig/fixer areas public. Effective power computed from base + meta + gear + continuous.

## Phase 7: Transport & Authority Models

**Goal**: Server-authoritative, client-authoritative, and local engine.

**Files**:

```
packages/engine/src/transport/
  types.ts, in-memory-transport.ts, server-engine.ts, client-engine.ts, local-engine.ts
```

**Deliverables**: All three authority models work.

### Phase 7 Notes

**Completed.** LocalEngine wraps MatchState with processCommand, undo stack, filtered views. InMemoryTransport for testing. Transport types defined.

## Phase 8: Replay & Logging

**Goal**: Record, replay, and export games.

**Files**:

```
packages/engine/src/replay/
  builder.ts, engine.ts, exporter.ts
packages/engine/src/logging/
  game-log.ts
```

**Deliverables**: Replays record and replay. Undo works with barriers.

### Phase 8 Notes

**Completed.** ReplayBuilder records initial state + commands. ReplayEngine steps through. ReplayExporter serializes. GameLogEntry type defined.

## Phase 9: Testing Infrastructure

**Goal**: Rich test harness.

**Files**:

```
packages/engine/src/testing/
  test-engine.ts, fixture-builder.ts, card-mocks.ts, matchers.ts
```

**Deliverables**: Test engine works. Fixture builder creates any state.

### Phase 9 Notes

**Completed.** 9 engine tests pass. Tests validate: initial state creation, legends face-down, opponent lookup, command processing, view filtering, concede, mulligan, undo, move enumeration.

## Phase 10: Automation (Bot Play)

**Goal**: Basic bot for solo play.

**Files**:

```
packages/engine/src/automation/
  strategy.ts, basic-bot.ts, planner.ts
```

**Deliverables**: Bot can play a complete game.

### Phase 10 Notes

**Completed.** BasicBotStrategy with pluggable AutomationStrategy interface. AutomationContext provides state + available moves.

## Summary

| Phase                    | Depends on  | Estimated files |
| ------------------------ | ----------- | --------------- |
| 1. State Foundation      | Nothing     | ~8 files        |
| 2. Command Processing    | Phase 1     | ~6 files        |
| 3. Core Moves            | Phase 2     | ~11 files       |
| 4. Effect Resolution     | Phase 2     | ~22 files       |
| 5. Turn Flow & Triggers  | Phase 3 + 4 | ~8 files        |
| 6. View & Projection     | Phase 5     | ~4 files        |
| 7. Transport & Authority | Phase 5 + 6 | ~6 files        |
| 8. Replay & Logging      | Phase 7     | ~5 files        |
| 9. Testing               | Phase 7     | ~5 files        |
| 10. Automation           | Phase 9     | ~4 files        |

**Total**: ~79 files in the engine package.

## Design Principles

1. **Operations layer is the only mutation path** — moves compose operations, never touch state directly
2. **Events are emitted by operations** — every mutation auto-generates game events
3. **Read-optimized derived state** — power, street cred, keywords computed on demand from base + modifiers
4. **TargetDSL is the single targeting vocabulary** — used by effects, conditions, triggers, and UI
5. **Patches for everything** — undo, replay, network sync all use mutative patches
6. **State is the source of truth** — no hidden runtime state outside `MatchState`
