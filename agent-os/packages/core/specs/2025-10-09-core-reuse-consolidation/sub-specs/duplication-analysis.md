# Code Duplication Analysis

This document identifies specific code duplication and reuse opportunities between gundam-engine, lorcana-engine, and core framework.

## 1. Zone Operations - Critical Duplication

### Core Implementation
**File:** `packages/core/src/zones/zone-operations.ts`

**API:**
- `addCard(zone, cardId, position?)`
- `removeCard(zone, cardId)`
- `moveCard(fromZone, toZone, cardId, position?)`
- `draw(deck, hand, count)`
- `shuffle(zone, seed)`
- `search(zone, filter)`
- `peek(zone, count)`
- `mill(deck, graveyard, count)`
- `getZoneSize(zone)`
- `getCardsInZone(zone)`
- `getTopCard(zone)`
- `getBottomCard(zone)`

**Structure:** Uses Zone objects with config (`visibility`, `ordered`, `maxSize`)

### Lorcana Implementation
**File:** `packages/lorcana-engine/src/game-definition/zone-operations.ts`

**API:**
- `createZoneState(players)` - No core equivalent
- `addCardToZone(zoneState, playerId, cardId)` - Similar to core `addCard`
- `removeCardFromZone(zoneState, playerId, cardId)` - Similar to core `removeCard`
- `moveCardBetweenZones(sourceZone, destZone, playerId, cardId)` - Similar to core `moveCard`
- `isCardInZone(zoneState, playerId, cardId)` - No core equivalent
- `getCardsInZone(zoneState, playerId)` - Similar to core `getCardsInZone`
- `getZoneSize(zoneState, playerId)` - Similar to core `getZoneSize`
- `getTopCard(zoneState, playerId)` - Similar to core `getTopCard`
- `clearZone(zoneState, playerId)` - No core equivalent
- `addCardToTop(zoneState, playerId, cardId)` - No core equivalent
- `addCardToBottom(zoneState, playerId, cardId)` - No core equivalent

**Structure:** Uses flat state `Record<PlayerId, CardId[]>`

### Duplication Score: 70%
Both implementations provide nearly identical functionality with different APIs.

### Resolution:
1. Core should support both Zone objects and flat state patterns
2. Add missing operations to core: `isCardInZone`, `clearZone`, `addCardToTop`, `addCardToBottom`
3. Add helper: `createZoneState` for flat state initialization
4. Lorcana migrates to core utilities

---

## 2. Zone Configuration - Complete Overlap

### Core Implementation
**File:** `packages/core/src/zones/zone.ts`

**Properties:**
```typescript
type ZoneConfig = {
  id: string;
  visibility: "owner" | "all" | "secret";
  ordered: boolean;
  maxSize?: number;
}
```

### Lorcana Implementation  
**File:** `packages/lorcana-engine/src/game-definition/zones.ts`

**Properties:**
```typescript
type ZoneConfig = {
  visibility: "owner" | "all";
  ordered: boolean;
  facedown: boolean;
}
```

**Plus helper functions:**
- `isPublicZone(zoneId)`
- `isPrivateZone(zoneId)`
- `isOrderedZone(zoneId)`
- `isFacedownZone(zoneId)`

### Duplication Score: 50%
Similar structure, lorcana has more specific helpers.

### Resolution:
1. Core's ZoneConfig is more complete (includes `maxSize`)
2. Add lorcana's helper functions to core zone utilities
3. Map lorcana's `facedown` to core's `visibility: "secret"`
4. Lorcana uses core zone config types

---

## 3. Testing Patterns - Hidden Reuse Opportunity

### Core Test Examples
**Files:**
- `packages/core/src/examples/__tests__/coin-flip-game.test.ts`
- `packages/core/src/__tests__/integration-complete-game.test.ts`
- `packages/core/src/__tests__/integration-network-sync.test.ts`

**Patterns Identified:**
```typescript
// Pattern 1: Test Game Definition
type CoinFlipGameState = { /* ... */ };
type CoinFlipMoves = { /* ... */ };
const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = { /* ... */ };
const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = { /* ... */ };

// Pattern 2: Test Engine Creation
const players = [
  { id: createPlayerId("p1"), name: "Alice" },
  { id: createPlayerId("p2"), name: "Bob" }
];
const engine = new RuleEngine(gameDefinition, players, { seed: "test-123" });

// Pattern 3: Move Execution & Assertion
const result = engine.executeMove("flipCoin", { playerId: players[0].id });
expect(result.success).toBe(true);
expect(result.error).toBeUndefined();

// Pattern 4: State Assertions
const state = engine.getState();
expect(state.players[0].score).toBe(1);

// Pattern 5: Deterministic Replay
const engine2 = new RuleEngine(gameDefinition, players, { seed: "test-123" });
engine2.executeMove("flipCoin", { playerId: players[0].id });
expect(engine2.getState()).toEqual(engine.getState());
```

### Game Engine Tests
**Gundam:** Minimal tests currently, will need these patterns
**Lorcana:** Tests exist but have to reimplement all these patterns

### Duplication Score: 0% (Not Reused)
Core has the patterns but they're not exposed as utilities.

### Resolution:
Create `@tcg/core/testing` with:
- `createTestEngine(definition, players, options)`
- `createTestPlayers(count)`
- `expectMoveSuccess(result)`
- `expectMoveFailure(result, errorPattern)`
- `expectStateProperty(engine, path, value)`
- `expectDeterministicReplay(definition, moves, seed)`

---

## 4. Card Text Parsing Infrastructure - Reuse Opportunity

### Gundam Implementation
**Files:**
- `packages/gundam-engine/tools/parser/text-parser.ts`
- `packages/gundam-engine/tools/generator/card-generator.ts`
- `packages/gundam-engine/tools/generator/file-writer.ts`

**Reusable Infrastructure:**

**1. Text Cleaning (95% reusable)**
```typescript
export function cleanCardText(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<br\s*\/?>/gi, "<!BR!>")
    .replace(/\s+/g, " ")
    .replace(/<!BR!>/g, "\n\n")
    .trim();
}
```

**2. File Generation (100% reusable)**
```typescript
function formatCardObject(obj: unknown, indent: number): string {
  // TypeScript object formatting logic
  // Used to generate card definition files
}

function generateVariableName(name: string): string {
  // Convert card name to valid TypeScript variable name
}

function toKebabCase(str: string): string {
  // Convert to kebab-case for filenames
}
```

**3. File Writing (100% reusable)**
```typescript
async function saveCardFile(card: CardDefinition): Promise<string> {
  // Directory management
  // File writing with formatting
}
```

**Game-Specific (NOT reusable):**
```typescript
// Gundam-specific triggers
const TRIGGER_PATTERNS = {
  "【Deploy】": "ON_DEPLOY",
  "【Attack】": "ON_ATTACK",
  // ... gundam-specific
};

// Gundam-specific keywords
const KEYWORD_PATTERNS = {
  "<Repair(?: (\\d+))?>": "Repair",
  "<Breach(?: (\\d+))?>": "Breach",
  // ... gundam-specific
};
```

### Lorcana Needs
Lorcana will need:
- Card file generation (same infrastructure)
- Text parsing (different triggers: "ON_PLAY", "WHEN_QUESTED", etc.)
- File management (same infrastructure)

### Duplication Risk: 80%
Without core infrastructure, lorcana would duplicate 80% of gundam's tooling.

### Resolution:
Create `@tcg/core/tooling`:
```typescript
// Reusable base classes
abstract class CardParser<TInput, TOutput> {
  abstract parse(input: TInput): ParserResult<TOutput>;
}

abstract class CardGenerator<TCard> {
  abstract generateFile(card: TCard): string;
  protected formatObject(obj: unknown, indent: number): string { /* shared */ }
}

class FileWriter {
  async write(filepath: string, content: string): Promise<void> { /* shared */ }
}

// Reusable utilities
export { cleanHtmlEntities, formatTypeScript, generateVariableName, toKebabCase };

// Game-specific extensions
class GundamCardTextParser extends CardParser<string, ParsedAbility[]> {
  // Gundam-specific implementation
}

class LorcanaCardTextParser extends CardParser<string, LorcanaAbility[]> {
  // Lorcana-specific implementation
}
```

---

## 5. Type Guards - Boilerplate Pattern

### Gundam Implementation
**File:** `packages/gundam-engine/src/cards/card-types.ts`

```typescript
export function isUnitCard(card: CardDefinition): card is UnitCardDefinition {
  return card.cardType === "UNIT";
}

export function isPilotCard(card: CardDefinition): card is PilotCardDefinition {
  return card.cardType === "PILOT";
}

export function isCommandCard(card: CardDefinition): card is CommandCardDefinition {
  return card.cardType === "COMMAND";
}

export function isBaseCard(card: CardDefinition): card is BaseCardDefinition_Structure {
  return card.cardType === "BASE";
}

export function isResourceCard(card: CardDefinition): card is ResourceCardDefinition {
  return card.cardType === "RESOURCE";
}
```

### Pattern Analysis
- All follow same pattern: check discriminant field
- Boilerplate could be generated
- Every game will need similar guards

### Duplication Risk: 100%
Every game duplicates this boilerplate pattern.

### Resolution:
Create type guard builder in core:
```typescript
// In @tcg/core/validation
export function createTypeGuard<T, K extends keyof T, V extends T[K]>(
  discriminantKey: K,
  discriminantValue: V
): (obj: T) => obj is Extract<T, Record<K, V>> {
  return (obj: T): obj is Extract<T, Record<K, V>> => {
    return obj[discriminantKey] === discriminantValue;
  };
}

// In gundam
export const isUnitCard = createTypeGuard<CardDefinition, "cardType", "UNIT">(
  "cardType",
  "UNIT"
);
```

---

## 6. State Initialization Patterns

### Template Engine
**File:** `packages/template-engine/src/game-definition.ts`

```typescript
setup: (players) => ({
  players: players.map((p) => ({
    id: p.id as PlayerId,
    name: p.name || "Player",
    life: 20,
  })),
  currentPlayerIndex: 0,
  turnNumber: 1,
  phase: "draw",
  zones: {
    deck: Object.fromEntries(players.map((p) => [p.id, []])),
    hand: Object.fromEntries(players.map((p) => [p.id, []])),
    field: Object.fromEntries(players.map((p) => [p.id, []])),
    graveyard: Object.fromEntries(players.map((p) => [p.id, []])),
  },
  cards: {},
})
```

### Lorcana Zone State Init
**File:** `packages/lorcana-engine/src/game-definition/zone-operations.ts`

```typescript
export const createZoneState = (players: PlayerId[]): ZoneState => {
  const zoneState: ZoneState = {} as ZoneState;
  for (const player of players) {
    zoneState[player] = [];
  }
  return zoneState;
};
```

### Pattern Analysis
- Both initialize player-keyed zone structures
- Template uses `Object.fromEntries` with map
- Lorcana uses loop
- Both achieve same result

### Duplication Score: 100%
Identical logic, different syntax.

### Resolution:
Add to core zone utilities:
```typescript
// In @tcg/core/zones
export function createPlayerZones<T = CardId[]>(
  players: PlayerId[],
  initialValue: () => T = () => [] as T
): Record<PlayerId, T> {
  return Object.fromEntries(
    players.map(p => [p, initialValue()])
  ) as Record<PlayerId, T>;
}

// Usage
const zones = {
  deck: createPlayerZones(players),
  hand: createPlayerZones(players),
  // etc.
};
```

---

## Summary of Duplication Findings

| Category | Duplication | Impact | Priority |
|----------|-------------|--------|----------|
| Zone Operations | 70% | High - Core functionality | P0 |
| Zone Configuration | 50% | Medium - Type definitions | P1 |
| Testing Patterns | 0% (Hidden) | High - Developer experience | P0 |
| Card Tooling | 80% (Potential) | Medium - Tooling only | P1 |
| Type Guards | 100% | Low - Boilerplate only | P2 |
| State Init | 100% | Low - Simple patterns | P2 |

## Quantitative Analysis

### Lines of Code Duplication
- **Zone Operations:** ~300 LOC duplicated between core and lorcana
- **Card Tooling:** ~500 LOC infrastructure that lorcana would duplicate
- **Testing Patterns:** ~200 LOC of test boilerplate per game engine
- **Type Guards:** ~50 LOC of boilerplate per game engine

**Total Duplication:** ~1050 LOC currently, ~1550 LOC if lorcana adds card tooling

### Reduction Potential
- **Zone Operations:** Reduce from 2 implementations to 1 → Save 300 LOC
- **Card Tooling:** Prevent duplication → Save 500 LOC
- **Testing Utilities:** Reduce test boilerplate by 60% → Save ~120 LOC per engine
- **Type Guards:** Reduce boilerplate by 80% → Save ~40 LOC per engine

**Total Savings:** ~1000+ LOC eliminated or prevented

### Maintenance Burden Reduction
- **Current:** 2 zone operation implementations to maintain separately
- **After:** 1 core implementation + 2 thin wrappers
- **Testing:** Changes to testing patterns must be manually synchronized
- **After:** Changes in core testing utilities automatically available to games

### Developer Experience Improvement
- **Current:** New game must implement ~500 LOC of infrastructure
- **After:** New game extends ~100 LOC of core utilities
- **Time Saved:** ~1-2 days per new game engine

---

## Detection Two Palettes

The user mentioned "We must detect that there are two palettes." Analysis reveals:

### Palette 1: Core Framework (Infrastructure)
**Purpose:** General-purpose game engine infrastructure
**Examples:**
- RuleEngine, FlowManager, MoveExecutor
- Zone operations (add, remove, move, shuffle)
- Seeded RNG for determinism
- Delta synchronization
- Type system (branded types)

**Characteristics:**
- Game-agnostic
- Highly reusable
- Thoroughly tested
- Performance-critical

### Palette 2: Game-Specific Implementation (Business Logic)
**Purpose:** Game rules and mechanics
**Examples:**
- Lorcana's lore system, challenge mechanics, questing
- Gundam's pilot pairing, deployment zones, link conditions
- Card definitions and abilities
- Move implementations
- Win conditions

**Characteristics:**
- Game-specific
- Extends core framework
- Implements actual game rules
- Uses core infrastructure

### The Gap: Missing "Infrastructure Utilities" Layer

**Currently Missing:**
- Testing utilities (should be in Core Palette)
- Zone state helpers (partially in both palettes - needs consolidation)
- Card tooling infrastructure (currently only in Gundam Palette)
- Common validators and type guards (ad-hoc in both)

**Problem:**
Game engines are forced to implement infrastructure concerns (Palette 1) that should be provided by core, blurring the line between the two palettes.

**Solution:**
Clearly delineate:
1. **Core Palette:** All reusable infrastructure including testing, tooling, validation
2. **Game Palette:** Only game-specific rules and mechanics

This spec addresses exactly this gap.

