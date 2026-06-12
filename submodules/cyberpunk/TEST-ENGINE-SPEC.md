# Cyberpunk Simulator Test Engine Specification

## 1. Architecture

The engine depends on real cards. `@tcg/cyberpunk-cards` is a **devDependency** of the engine package. At runtime, cards are injected via `CardCatalog`. In tests, real card definitions are imported directly.

```
@tcg/cyberpunk-types       (no game deps)
      ↑
@tcg/cyberpunk-cards       (imports types only)
      ↑ (devDep only)
@tcg/cyberpunk-engine      (imports cards in tests only)
```

## 2. Design Principles

1. **Direct card imports** - tests import card variables from `@tcg/cyberpunk-cards`, never slug lookups
2. **Auto-fill from fixtures** - `createWithFixture` builds valid DeckLists + CardCatalog from fixture cards + real card pool
3. **Move methods accept card objects** - engine resolves `StructuredCardDefinition → CardInstanceId` internally
4. **`P1`/`P2` constants** - single canonical player ID system, no branded casts in tests
5. **`skipSetup` defaults to `true`** - tests start in play phase
6. **Default player is P1** - `.as(P2)` to switch perspective
7. **5 custom matchers** - minimal, high-value set
8. **`using` keyword** - auto-dispose via `Symbol.dispose`
9. **4 files** - not 6; card/deck helpers are internal to test-engine.ts
10. **Built-in `getEvents()`** - no verbose log inspection chains

## 3. Directory Structure

```
packages/engine/
├── src/testing/
│   ├── index.ts              # Public barrel export
│   ├── test-engine.ts        # CyberpunkTestEngine + internal helpers
│   ├── test-fixtures.ts      # Fixture types
│   ├── register-matchers.ts  # Custom Vitest matchers
│   └── matchers.d.ts         # Matcher type declarations
├── tests/
│   ├── engine.test.ts        # Existing
│   ├── moves/                # Per-move test files
│   ├── effects/              # Effect resolver tests
│   ├── operations/           # Operations tests
│   ├── flow/                 # Turn flow tests
│   ├── view/                 # View filter tests
│   ├── static-effects/       # Static effect tests
│   ├── triggers/             # Trigger matching tests
│   └── state/                # Initial state tests
```

## 4. Fixture Types

```typescript
type FixtureCardEntry = StructuredCardDefinition | FixtureCardState;

interface FixtureCardState {
  card: StructuredCardDefinition;
  spent?: boolean;
  faceDown?: boolean;
  damage?: number;
  powerModifier?: number;
  playedThisTurn?: boolean;
  hasAttackedThisTurn?: boolean;
  counters?: Record<string, number>;
  attachedGearIds?: string[];
}

interface PlayerFixture {
  hand?: number | FixtureCardEntry[];
  deck?: number | FixtureCardEntry[];
  field?: number | FixtureCardEntry[];
  trash?: number | FixtureCardEntry[];
  legendArea?: number | FixtureCardEntry[];
  eddies?: number;
}
```

Zones as numbers create placeholder filler cards. Zones as arrays place those specific cards. Unspecified zones get sensible defaults (deck = 40 filler cards, legendArea = 3 random legends).

## 5. CyberpunkTestEngine API

```typescript
class CyberpunkTestEngine {
  static createWithFixture(
    p1: PlayerFixture,
    p2?: PlayerFixture,
    opts?: Options,
  ): CyberpunkTestEngine;
  static createFromState(state: MatchState): CyberpunkTestEngine;

  // Moves (default as P1)
  playCard(card: CardRef, opts?: MoveOpts): CommandResult;
  sellCard(card: CardRef, opts?: MoveOpts): CommandResult;
  callLegend(card: CardRef, opts?: MoveOpts): CommandResult;
  attackUnit(attacker: CardRef, defender: CardRef, opts?: MoveOpts): CommandResult;
  attackRival(attacker: CardRef, opts?: MoveOpts): CommandResult;
  useBlocker(blocker: CardRef, opts?: MoveOpts): CommandResult;
  passPhase(opts?: MoveOpts): CommandResult;
  concede(opts?: MoveOpts): CommandResult;
  mulligan(opts?: MoveOpts): CommandResult;
  resolveAttack(opts?: ResolveAttackOpts): CommandResult;

  // Player switching
  as(playerId: PlayerId): PlayerHandle;

  // Card queries
  getCard(card: CardRef): CardInstance;
  getCardsInZone(zone: CardZone, playerId: PlayerId): CardInstance[];
  findCardId(card: CardRef, zone: CardZone, playerId: PlayerId): CardInstanceId;

  // Gig queries
  getGigCount(playerId: PlayerId): number;
  getStreetCred(playerId: PlayerId): number;
  getFixerDice(playerId: PlayerId): GigDie[];
  getGigDice(playerId: PlayerId): GigDie[];

  // State queries
  getPhase(): GamePhase;
  getActivePlayerId(): PlayerId;
  getEddies(playerId: PlayerId): number;
  isGameOver(): boolean;
  getWinnerId(): PlayerId | null;

  // Events
  getEvents(type?: string): GameEvent[];
  getLastEvent(type: string): GameEvent | undefined;

  // Lifecycle
  getState(): MatchState;
  getFilteredView(playerId: PlayerId): FilteredMatchView;
  undo(): boolean;
  dispose(): void;
  [Symbol.dispose](): void;
}

type CardRef = string | CardInstance | StructuredCardDefinition;
interface MoveOpts {
  as?: PlayerId;
}
interface ResolveAttackOpts extends MoveOpts {
  gigIdsToSteal?: string[];
  pass?: boolean;
}
interface PlayerHandle {
  /* same move methods bound to a playerId */
}

interface TestEngineOptions {
  seed?: string;
  skipSetup?: boolean; // default true
}
```

## 6. Custom Matchers (5)

| Matcher                               | Asserts                             |
| ------------------------------------- | ----------------------------------- |
| `toBeSuccessfulCommand()`             | `CommandResult` is success          |
| `toBeInZone(zone)`                    | `CardInstance` is in the given zone |
| `toHaveEddies({player, count})`       | Player has N eddies                 |
| `toBeInPhase(phase)`                  | Game is in given phase              |
| `toHaveEffectivePower({card, value})` | Card's computed power matches       |

## 7. Example Test

```typescript
import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing";
import { alphaArmoredMinotaur, alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";

describe("playCard", () => {
  it("moves a unit from hand to field", () => {
    using engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaArmoredMinotaur],
      eddies: 10,
    });

    const result = engine.playCard(alphaArmoredMinotaur);

    expect(result).toBeSuccessfulCommand();
    expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("rejects when not enough eddies", () => {
    using engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaArmoredMinotaur],
      eddies: 0,
    });

    const result = engine.playCard(alphaArmoredMinotaur);

    expect(result.success).toBe(false);
  });
});
```
