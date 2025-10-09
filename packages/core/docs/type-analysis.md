# @tcg/core Type Analysis

**Date:** 2025-10-09  
**Purpose:** Complete inventory and analysis of types across core, lorcana-engine, and gundam-engine  
**Spec Reference:** Core Type System Consolidation

## Executive Summary

This document provides a comprehensive analysis of type definitions across the three packages. Key findings:

1. **Branded Types:** All three packages redefine branded types (PlayerId, CardId, ZoneId, GameId)
2. **Zone Visibility:** Conflicting visibility models between core and lorcana
3. **Card Definitions:** Different approaches to card structure
4. **Missing Abstractions:** Core lacks game state base type, zone state management

## 1. Branded Types System

### 1.1 @tcg/core (Current)

**File:** `packages/core/src/types/branded.ts`

```typescript
export type Brand<T, TBrand> = T & { readonly [brand]: TBrand };
export type CardId = Brand<string, "CardId">;
export type PlayerId = Brand<string, "PlayerId">;
export type GameId = Brand<string, "GameId">;
export type ZoneId = Brand<string, "ZoneId">;
```

**Utilities:** `packages/core/src/types/branded-utils.ts`
- `createCardId(value: string): CardId`
- `createPlayerId(value: string): PlayerId`
- `createGameId(value: string): GameId`
- `createZoneId(value: string): ZoneId`

###

 1.2 @tcg/lorcana-engine (Duplication)

**File:** `packages/lorcana-engine/src/types/branded-types.ts`

```typescript
export type Brand<K, T> = K & { readonly __brand: T };
export type PlayerId = Brand<string, "PlayerId">;
export type CardId = Brand<string, "CardId">;
export type ZoneId = Brand<string, "ZoneId">;
export type AbilityId = Brand<string, "AbilityId">;  // Extra
export type GameId = Brand<string, "GameId">;
```

**Utilities:** Same file includes creator functions with validation
- `createPlayerId(value: string): PlayerId`
- `createCardId(value: string): CardId`
- `createZoneId(value: string): ZoneId`
- `createAbilityId(value: string): AbilityId`
- `createGameId(value: string): GameId`

**Differences:**
- Uses `__brand` instead of `[brand]` symbol
- Includes `AbilityId` type not in core
- Adds validation (throws on empty string)

### 1.3 @tcg/gundam-engine

**Status:** No branded types redefined, would use core types (not yet implemented)

### 1.4 Analysis

**Issue:** Complete duplication between core and lorcana  
**Cause:** Lorcana was implemented before core types were stable  
**Impact:** Type incompatibility, cannot pass lorcana types to core functions

**Recommendation:**
- Keep core's branded types as definitive
- Add `AbilityId` to core (valid TCG concept)
- Engines should import from core, not redefine
- Validation logic can stay in core utils

---

## 2. Zone System

### 2.1 @tcg/core (Current)

**File:** `packages/core/src/zones/zone.ts`

```typescript
export type ZoneVisibility = "public" | "private" | "secret";

export type ZoneConfig = {
  id: ZoneId;
  name: string;
  visibility: ZoneVisibility;
  ordered: boolean;
  owner?: PlayerId;
  faceDown?: boolean;
  maxSize?: number;
};

export type Zone = {
  config: ZoneConfig;
  cards: CardId[];
};
```

**Zone Operations:** `packages/core/src/zones/zone-operations.ts`
- `addCard`, `removeCard`, `moveCard`
- `getCardsInZone`, `getZoneSize`
- `shuffle`, `draw`, `mill`, `peek`, `reveal`, `search`
- `getTopCard`, `getBottomCard`

### 2.2 @tcg/lorcana-engine (Conflict)

**File:** `packages/lorcana-engine/src/game-definition/zones.ts`

```typescript
export type ZoneVisibility = "owner" | "all";

export type ZoneConfig = {
  visibility: ZoneVisibility;
  ordered: boolean;
  facedown: boolean;
};

export type LorcanaZoneId = "deck" | "hand" | "play" | "discard" | "inkwell";

export type ZoneState = Record<PlayerId, CardId[]>;
```

**Zone Operations:** `packages/lorcana-engine/src/game-definition/zone-operations.ts`
- `createZoneState(players: PlayerId[]): ZoneState`
- `addCardToZone`, `removeCardFromZone`, `moveCardBetweenZones`
- `isCardInZone`, `getCardsInZone`, `getZoneSize`
- `getTopCard`, `clearZone`
- `addCardToTop`, `addCardToBottom`

**Differences:**
- Visibility: "owner"/"all" vs "public"/"private"/"secret"
- `facedown` (boolean) vs `faceDown` (optional boolean)
- No `id`, `name` fields in config
- Different state structure: Record vs Zone object
- Simpler operations (no shuffle, search, etc.)

### 2.3 @tcg/gundam-engine

**Status:** Not yet implemented, documented intention to use core

### 2.4 Analysis

**Issue:** Completely incompatible zone systems  
**Cause:** Lorcana implemented custom zone system before core was defined

**Visibility Model Comparison:**

| Core | Lorcana | Meaning |
|------|---------|---------|
| "public" | "all" | Everyone can see cards |
| "private" | "owner" | Only owner can see cards |
| "secret" | N/A | Nobody can see cards (even owner) |
| N/A | N/A | (deck/inkwell are "owner" + facedown) |

Lorcana's model combines visibility with the `facedown` property:
- `visibility: "owner", facedown: true` = Core's "secret"
- `visibility: "owner", facedown: false` = Core's "private"  
- `visibility: "all", facedown: false` = Core's "public"

**Recommendation:**
- **Keep core's three-tier visibility model** - more flexible
- Lorcana deck/inkwell = `visibility: "secret"` (simpler than owner+facedown)
- Keep `faceDown` optional boolean for card orientation
- Core should provide `ZoneState = Record<PlayerId, CardId[]>` utility type
- Core operations should work with both Zone objects and ZoneState records

---

## 3. Card System

### 3.1 @tcg/core (Current)

**File:** `packages/core/src/cards/card-definition.ts`

```typescript
export type CardDefinition = {
  id: string;
  name: string;
  type: string;
  basePower?: number;
  baseToughness?: number;
  baseCost?: number;
  abilities?: string[];
};

export type DefinitionRegistry = Map<string, CardDefinition>;
```

**File:** `packages/core/src/cards/card-instance.ts`

```typescript
export type CardInstanceBase = {
  instanceId: string;
  definitionId: string;
  ownerId: string;
  zoneId?: string;
};

export type CardInstance<TCustomState = Record<string, never>> =
  CardInstanceBase & TCustomState;
```

**Modifiers:** `packages/core/src/cards/modifiers.ts`
- `Modifier<TGameState>` type with duration, conditions, effects

### 3.2 @tcg/lorcana-engine

**Status:** Not yet implemented (README.md only)

Planned structure (from README):
```typescript
export type LorcanaCardType = "character" | "action" | "item" | "location";

export type LorcanaCard = {
  id: CardId;
  name: string;
  type: LorcanaCardType;
  inkwell: boolean;  // Game-specific
  cost: number;
  // ... character/action/item/location specific fields
};
```

### 3.3 @tcg/gundam-engine

**File:** `packages/gundam-engine/src/cards/card-types.ts`

```typescript
export type BaseCardDefinition = {
  id: string;
  name: string;
  cardNumber: string;
  setCode: string;
  cardType: "UNIT" | "PILOT" | "COMMAND" | "BASE" | "RESOURCE";
  rarity: string;
  color?: string;
  level?: number;
  cost?: number;
  text?: string;
  imageUrl?: string;
  sourceTitle?: string;
};

// Specific card types extend BaseCardDefinition
export type UnitCardDefinition = BaseCardDefinition & {
  cardType: "UNIT";
  ap: number;
  hp: number;
  zones: Array<"space" | "earth">;
  traits: string[];
  linkRequirements?: string[];
  keywords?: KeywordAbility[];
  abilities?: ParsedAbility[];
};

export type CardDefinition = 
  | UnitCardDefinition 
  | PilotCardDefinition 
  | CommandCardDefinition 
  | BaseCardDefinition_Structure
  | ResourceCardDefinition;
```

**Analysis:**
- Gundam has rich card metadata (cardNumber, setCode, rarity, imageUrl)
- Uses discriminated unions with `cardType` discriminator
- Type guards for runtime type checking
- No separation between definition and instance yet

### 3.4 Analysis

**Core's Approach:** Minimal, extensible
- Simple base properties
- Games extend with intersection types

**Gundam's Approach:** Rich, specific
- Comprehensive metadata
- Discriminated unions for type safety
- Focus on card definitions (static data)

**Missing in Core:**
- Card instance state (damage, counters, etc.)
- Clear extension pattern
- Metadata fields (rarity, set, image, etc.)

**Recommendation:**
- Core provides minimal `CardDefinition` base
- Core provides `CardInstance` with runtime state
- Games extend via intersection types
- Add optional metadata fields to core base

---

## 4. Move System

### 4.1 @tcg/core (Current)

**File:** `packages/core/src/moves/move-system.ts`

```typescript
export type MoveContext = {
  playerId: PlayerId;
  sourceCardId?: CardId;
  targets?: string[][];
  data?: Record<string, unknown>;
  timestamp?: number;
  rng?: SeededRNG;
};

export type MoveReducer<TGameState> = (
  draft: Draft<TGameState>,
  context: MoveContext,
) => void;

export type MoveCondition<TGameState> = (
  state: TGameState,
  context: MoveContext,
) => boolean;

export type MoveDefinition<TGameState> = {
  id: string;
  name: string;
  description?: string;
  condition?: MoveCondition<TGameState>;
  reducer: MoveReducer<TGameState>;
  metadata?: { category?: string; tags?: string[]; [key: string]: unknown };
};

export type MoveResult<TGameState> =
  | { success: true; state: TGameState }
  | { success: false; error: string; errorCode?: string; errorContext?: Record<string, unknown> };
```

**File:** `packages/core/src/game-definition/move-definitions.ts`

```typescript
export type GameMoveDefinition<TState> = {
  condition?: (state: TState, context: MoveContext) => boolean;
  reducer: (draft: Draft<TState>, context: MoveContext) => void;
};

export type GameMoveDefinitions<TState, TMoves extends Record<string, any>> = {
  [K in keyof TMoves]: GameMoveDefinition<TState>;
};
```

### 4.2 @tcg/lorcana-engine

**Status:** Not yet implemented (README.md only)

Planned moves (from README):
- PlayCardMove
- QuestMove
- ChallengeMove
- InkCardMove
- ActivateAbilityMove

Move parameter types planned but not implemented.

### 4.3 @tcg/gundam-engine

**Status:** Not yet implemented (documented in architecture)

### 4.4 Analysis

**Core provides:**
- Rich `MoveContext` with player, card, targets, data, RNG
- Type-safe move definitions
- Validation via conditions
- Execution via reducers
- Typed move results

**Well designed:** Both engines can use as-is

**Recommendation:** No changes needed to move system

---

## 5. Game State

### 5.1 @tcg/core (Current)

**Status:** No base game state type defined

**File:** `packages/core/src/game-definition/game-definition.ts`

```typescript
export type Player = {
  id: string;
  name?: string;
};

export type GameDefinition<TState, TMoves extends Record<string, any>> = {
  name: string;
  setup: (players: Player[]) => TState;
  moves: GameMoveDefinitions<TState, TMoves>;
  flow?: FlowDefinition<TState>;
  endIf?: (state: TState) => GameEndResult | undefined;
  playerView?: (state: TState, playerId: string) => TState;
};
```

**Observation:** `TState` is completely generic, no base structure

### 5.2 @tcg/lorcana-engine

**File:** `packages/lorcana-engine/src/types/lorcana-state.ts`

```typescript
export type LorcanaPhase = "beginning" | "main" | "end";

export type LorcanaState = {
  players: PlayerId[];
  currentPlayerIndex: number;
  turnNumber: number;
  phase: LorcanaPhase;
  lorcana: {
    lore: Record<PlayerId, number>;
    ink: {
      available: Record<PlayerId, number>;
      total: Record<PlayerId, number>;
    };
    turnMetadata: TurnMetadata;
    characterStates: Record<CardId, CharacterState>;
    permanentStates: Record<CardId, PermanentState>;
    challengeState?: ChallengeState;
  };
};
```

### 5.3 @tcg/gundam-engine

**Status:** Documented structure (from ARCHITECTURE.md):

```typescript
type GundamGameState = CoreGameState & {
  gundam: {
    shields: Record<PlayerId, CardId[]>;
    bases: Record<PlayerId, CardId | null>;
    battlePositions: Record<PlayerId, BattlePosition[]>;
    activeResources: Record<PlayerId, number>;
    currentAttack: AttackSequence | null;
  };
};
```

### 5.4 Analysis

**Common Pattern:** Both engines have:
- `players: PlayerId[]`
- `currentPlayerIndex: number`
- `turnNumber: number`
- `phase: string` (game-specific)
- Game-specific nested object

**Missing in Core:**
- Base `GameState` type with common fields
- Pattern for game-specific extensions
- Zone state management in base state

**Recommendation:**
- Core provides minimal `GameState` base:
```typescript
export type GameState = {
  players: PlayerId[];
  currentPlayerIndex: number;
  turnNumber: number;
  phase: string;
};
```
- Games extend via intersection:
```typescript
type LorcanaState = GameState & {
  phase: LorcanaPhase;  // override with specific type
  lorcana: { ... };
};
```

---

## 6. Flow System

### 6.1 @tcg/core (Current)

**File:** `packages/core/src/flow/flow-definition.ts`

Comprehensive flow system with:
- `FlowContext<TState>` - Rich context with state mutation and flow control
- `LifecycleHook<TState>` - Hooks for onBegin/onEnd
- `EndCondition<TState>` - Automatic end conditions
- `SegmentDefinition<TState>` - Steps within phases
- `PhaseDefinition<TState>` - Phases within turns
- `TurnDefinition<TState>` - Turn structure
- `FlowDefinition<TState>` - Complete flow orchestration

**Features:**
- Hierarchical: Turn → Phases → Segments
- Programmatic control (endPhase, endSegment, endTurn)
- Lifecycle hooks at every level
- Automatic end conditions

### 6.2 @tcg/lorcana-engine

**Status:** Not yet implemented

Planned:
- 3 phases (beginning, main, end)
- 3 steps in beginning phase (ready, set, draw)

### 6.3 @tcg/gundam-engine

**Status:** Documented structure (from ARCHITECTURE.md):

Planned:
- 5 phases (start, draw, resource, main, end)

### 6.4 Analysis

**Core's flow system is comprehensive and well-designed.**

Both engines can use as-is:
- Lorcana: 3 phases, beginning phase has 3 segments
- Gundam: 5 phases, no segments

**Recommendation:** No changes needed, both games fit the model

---

## 7. Targeting System

### 7.1 @tcg/core (Current)

**File:** `packages/core/src/targeting/target-definition.ts`

```typescript
export type TargetRestriction =
  | "self-only"
  | "not-self"
  | "controller-only"
  | "not-controller"
  | "opponent-only";

export type TargetCount =
  | number
  | { min: number; max: number }
  | { min: number; max?: number }
  | { min?: number; max: number };

export type TargetDefinition = {
  count: TargetCount;
  filter?: CardFilter;
  restrictions?: TargetRestriction[];
};
```

**File:** `packages/core/src/targeting/target-validation.ts`
- `validateTargetSelection` function

### 7.2 @tcg/lorcana-engine

**Status:** Not yet implemented

### 7.3 @tcg/gundam-engine

**Status:** Not yet implemented

### 7.4 Analysis

**Core provides:** Complete targeting system

Both games can use as-is for abilities that target cards.

**Recommendation:** No changes needed

---

## Summary of Issues

### Critical Issues

1. **Branded Types Duplication**
   - **Impact:** Type incompatibility
   - **Affected:** lorcana-engine
   - **Fix:** Remove from lorcana, import from core

2. **Zone Visibility Conflict**
   - **Impact:** Incompatible zone systems
   - **Affected:** lorcana-engine
   - **Fix:** Lorcana adopts core's visibility model

3. **Zone State Structure**
   - **Impact:** Different zone implementations
   - **Affected:** lorcana-engine  
   - **Fix:** Core adds `ZoneState` utility type

### Minor Issues

4. **Missing AbilityId**
   - **Impact:** Low (lorcana-specific currently)
   - **Fix:** Add to core branded types

5. **No Base GameState**
   - **Impact:** Medium (duplicated fields)
   - **Fix:** Add minimal base GameState to core

6. **Card Definition Extension Pattern Unclear**
   - **Impact:** Medium (each engine reinvents)
   - **Fix:** Document extension pattern clearly

---

## Comparison Matrix

| System | Core | Lorcana | Gundam | Status |
|--------|------|---------|--------|--------|
| **Branded Types** | ✅ Defined | ❌ Redefined | ⚠️ Not impl | Conflict |
| **Zone Visibility** | ✅ 3-tier | ❌ 2-tier | ⚠️ Not impl | Conflict |
| **Zone Operations** | ✅ Rich | ⚠️ Basic | ⚠️ Not impl | Partial |
| **Zone State** | ❌ Missing | ✅ Record | ⚠️ Not impl | Gap in core |
| **Card Definition** | ✅ Minimal | ⚠️ Not impl | ✅ Rich | Works |
| **Card Instance** | ✅ Defined | ⚠️ Not impl | ⚠️ Not impl | Works |
| **Move System** | ✅ Complete | ⚠️ Not impl | ⚠️ Not impl | Good |
| **Game State** | ❌ No base | ✅ Full | ⚠️ Planned | Gap in core |
| **Flow System** | ✅ Complete | ⚠️ Not impl | ⚠️ Not impl | Good |
| **Targeting** | ✅ Complete | ⚠️ Not impl | ⚠️ Not impl | Good |

**Legend:**
- ✅ Properly defined
- ⚠️ Not yet implemented
- ❌ Missing or conflicting

---

## Recommendations Priority

### High Priority (Breaking Changes)

1. **Remove branded type duplications** from lorcana-engine
2. **Add `ZoneState` utility type** to core
3. **Add base `GameState` type** to core
4. **Document zone visibility mapping** for lorcana migration

### Medium Priority (Additions)

5. **Add `AbilityId` branded type** to core
6. **Add card metadata fields** to core CardDefinition (optional)
7. **Document card extension patterns** with examples

### Low Priority (Documentation)

8. **Create lorcana migration guide** for zones
9. **Create gundam integration examples**
10. **Document best practices** for state extension

---

## Next Steps

1. Create Type Specification document with redesigned types
2. Create Migration Guide for lorcana-engine
3. Create Integration Examples for both engines
4. Update core type definitions
5. Test type compatibility with both engines


