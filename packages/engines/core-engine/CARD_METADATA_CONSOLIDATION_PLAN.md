# Card Metadata Consolidation Plan

## Overview
This document outlines the plan to consolidate card metadata across all game engines to use a unified approach via the core context (`ctx.cardMetas`), replacing the current fragmented patterns.

## Current State Analysis

### Game Engine Metadata Patterns

| Engine | Current Pattern | Complexity | Migration Effort |
|--------|----------------|------------|------------------|
| **Lorcana** | `G.metas: Record<InstanceId, LorcanaCardMeta>` | Low | Easy - Direct move |
| **Grand Archive** | `GrandArchiveEnrichedCard` with embedded metadata | High | Hard - Major restructure |
| **One Piece** | `CardInstanceState` interface | Medium | Medium - Interface conversion |
| **Riftbound** | `CardInstanceState` interface | High | Hard - Complex metadata |
| **Alpha Clash** | Mixed patterns (`EnrichedCard` + game state) | Medium | Medium - Pattern consolidation |
| **Gundam** | Context provider pattern | Medium | Medium - Provider migration |

### Metadata Properties by Engine

#### Lorcana (Already using meta pattern)
```typescript
LorcanaCardMeta {
  exerted?: boolean | null;
  playedThisTurn?: boolean | null;
  damage?: number | null;
  shifter?: string | null;
  shifted?: string | null;
  revealed?: boolean | null;
  location?: string | null;
  characters?: string[] | null;
}
```

#### Grand Archive (From GrandArchiveEnrichedCard)
```typescript
GrandArchiveCardMeta {
  isRested: boolean;
  counters: Record<GrandArchiveCounterType, number>;
  states: Set<GrandArchiveObjectState>;
  timestamp: number;
  turnPlayed?: number;
  activationsThisTurn: number;
}
```

#### One Piece (From CardInstanceState)
```typescript
OnePieceCardMeta {
  state: CardState; // Active or rested
  power?: number;
  attachedDon: string[];
  powerModifier: number;
  canAttack: boolean;
  hasAttacked: boolean;
  playedThisTurn: boolean;
}
```

#### Riftbound (From CardInstanceState)
```typescript
RiftboundCardMeta {
  damage: number;
  buffs: number;
  statusConditions: Set<StatusCondition>;
  mightModifier: number;
  costModifier: { energy: number; power: Record<Domain, number>; };
  temporaryKeywords: string[];
  temporaryAbilities: string[];
  combatRole: CombatRole;
  combatDamageAssigned: number;
  location?: string;
  isHidden?: boolean;
  hiddenAt?: string;
  attachedTo?: string;
  attachments: string[];
}
```

#### Alpha Clash (From multiple sources)
```typescript
AlphaClashCardMeta {
  status: AlphaClashCardStatus;
  damage?: number;
  damageType?: AlphaClashDamageType;
  counters?: Map<string, number>;
  attachments?: string[];
  attachedTo?: string;
  modifiers?: Array<{ source: string; effect: string; duration?: string; }>;
}
```

#### Gundam (From context provider)
```typescript
GundamCardMeta {
  modifiers: any[];
  counters: Record<string, number>;
  statusEffects: Set<string>;
  // Additional properties to be defined
}
```

## Implementation Plan

### Phase 1: Core Engine Infrastructure (High Priority)

#### 1.1 Update Core Context Type
**File**: `src/game-engine/core-engine/state/context.ts`
```typescript
// Add CardMeta generic parameter
export interface CoreCtx<TurnHistory = unknown, CardMeta = BaseCardMeta> {
  // ... existing fields ...
  cardMetas: Record<string, CardMeta>;
}
```

#### 1.2 Extend Game-Specific Types System
**File**: `src/game-engine/core-engine/types/game-specific-types.ts`
```typescript
// Add base card metadata type
export type BaseCardMeta = Record<string, any>;

// Add extension utility
export type ExtendCardMeta<T> = BaseCardMeta & T;

// Update validation types
export type ValidateGameTypes<
  GameState extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition,
  PlayerState extends GameSpecificPlayerState,
  CardFilter extends GameSpecificCardFilter,
  CardMeta extends BaseCardMeta = BaseCardMeta
> = {
  gameState: GameState;
  cardDefinition: CardDefinition;
  playerState: PlayerState;
  cardFilter: CardFilter;
  cardMeta: CardMeta;
};
```

#### 1.3 Add Core Metadata Operations
**File**: `src/game-engine/core-engine/engine/core-operation.ts`
```typescript
export class CoreOperation<
  G extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardMeta extends BaseCardMeta = BaseCardMeta,
  CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>
> {
  // CRUD operations for card metadata
  getCardMeta(instanceId: string): CardMeta;
  setCardMeta(instanceId: string, meta: Partial<CardMeta>): void;
  updateCardMeta<K extends keyof CardMeta>(instanceId: string, field: K, value: CardMeta[K]): void;
  removeCardMeta(instanceId: string): void;
  clearCardMetaField<K extends keyof CardMeta>(instanceId: string, field: K): void;
  
  // Bulk operations
  setCardMetas(metas: Record<string, CardMeta>): void;
  getCardMetas(): Record<string, CardMeta>;
  clearAllCardMetas(): void;
  
  // Query operations
  getCardsWithMeta<K extends keyof CardMeta>(field: K, value: CardMeta[K]): string[];
  queryCardsByMeta(predicate: (meta: CardMeta) => boolean): string[];
}
```

#### 1.4 Update Core Engine Generics
**Files**: All core engine files that use generic types
- `core-engine.ts`
- `game-configuration.ts` 
- `core-card-instance-store.ts`
- All related interfaces and types

### Phase 2: Game Engine Migrations (Incremental)

#### 2.1 Lorcana Migration (Low Risk - Priority 1)
**Effort**: ~4 hours
**Files**: 
- `lorcana-engine-types.ts`
- `lorcana-engine.ts`
- `lorcana-core-operations.ts`
- All Lorcana card operations

**Changes**:
- Remove `metas` from `LorcanaGameState`
- Update all `G.metas[instanceId]` to `this.getCardMeta(instanceId)`
- Update all meta assignments to use `this.setCardMeta()` or `this.updateCardMeta()`
- Test existing Lorcana functionality

#### 2.2 Gundam Migration (Medium Risk - Priority 2)
**Effort**: ~8 hours
**Files**:
- `gundam-engine-types.ts`
- `gundam-card-context-provider.ts`
- `gundam-engine.ts`

**Changes**:
- Define `GundamCardMeta` type
- Replace context provider pattern with core meta operations
- Migrate existing metadata logic
- Update card instance creation

#### 2.3 Alpha Clash Migration (Medium Risk - Priority 3)
**Effort**: ~10 hours
**Files**:
- `alpha-clash-engine-types.ts`
- `src/cards/definitions/cardTypes.ts`
- All Alpha Clash card operations

**Changes**:
- Remove `EnrichedAlphaClashCard` and `AlphaClashCardInstance`
- Extract metadata to `AlphaClashCardMeta`
- Update game state damage tracking to use meta
- Consolidate multiple metadata patterns

#### 2.4 One Piece Migration (Medium Risk - Priority 4)
**Effort**: ~8 hours
**Files**:
- `one-piece-engine-types.ts`
- All One Piece card operations

**Changes**:
- Remove `CardInstanceState` interface
- Define `OnePieceCardMeta` type
- Move all state tracking to meta operations
- Update attachment system

#### 2.5 Riftbound Migration (High Risk - Priority 5)
**Effort**: ~12 hours
**Files**:
- `riftbound-engine-types.ts`
- All Riftbound card operations
- Combat system files

**Changes**:
- Remove complex `CardInstanceState` interface
- Define comprehensive `RiftboundCardMeta` type
- Migrate complex state tracking (damage, buffs, conditions)
- Update combat role and attachment systems

#### 2.6 Grand Archive Migration (High Risk - Priority 6)
**Effort**: ~14 hours
**Files**:
- `grand-archive-engine-types.ts`
- All Grand Archive card operations
- Combat and effect systems

**Changes**:
- Complete restructure from `GrandArchiveEnrichedCard`
- Separate card definition from metadata
- Define `GrandArchiveCardMeta` type
- Update all card instance handling
- Migrate counter and state systems

### Phase 3: Cleanup and Validation (Final Phase)

#### 3.1 Remove Legacy Patterns
- Delete obsolete interfaces (`CardInstanceState`, `EnrichedCard`, etc.)
- Remove unused metadata handling code
- Clean up type exports

#### 3.2 Update Documentation
- Update engine README files
- Update architectural documentation
- Create migration guide for future games

#### 3.3 Comprehensive Testing
- Unit tests for all core metadata operations
- Integration tests for each game engine
- Performance testing for metadata access patterns
- Regression testing for existing functionality

#### 3.4 Type System Validation
- Ensure all generic type parameters are consistent
- Validate type safety across all engines
- Update type exports and imports

## Risk Assessment

### High Risk Areas
1. **Grand Archive**: Most complex metadata, requires complete restructure
2. **Riftbound**: Extensive metadata with complex relationships
3. **Type System**: Generic type parameter cascading changes

### Medium Risk Areas
1. **Alpha Clash**: Multiple metadata patterns to consolidate
2. **One Piece & Gundam**: Moderate complexity migrations
3. **Performance**: Potential impact from centralized metadata storage

### Low Risk Areas
1. **Lorcana**: Already using similar pattern
2. **Core Operations**: Additive changes to existing functionality
3. **Documentation**: No functional impact

## Success Criteria

### Technical Goals
- [ ] All games use unified `ctx.cardMetas` pattern
- [ ] Type safety maintained across all engines
- [ ] No performance regression (< 5% overhead)
- [ ] All existing tests pass after migration

### Quality Goals
- [ ] Consistent metadata API across all games  
- [ ] Reduced code duplication in metadata handling
- [ ] Improved debugging and inspection capabilities
- [ ] Simplified onboarding for new game engines

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Core Infrastructure | 2-3 days | None |
| Phase 2.1: Lorcana | 1 day | Phase 1 complete |
| Phase 2.2: Gundam | 1 day | Phase 1 complete |
| Phase 2.3: Alpha Clash | 1.5 days | Phase 1 complete |
| Phase 2.4: One Piece | 1 day | Phase 1 complete |
| Phase 2.5: Riftbound | 2 days | Phase 1 complete |
| Phase 2.6: Grand Archive | 2 days | Phase 1 complete |
| Phase 3: Cleanup & Validation | 1-2 days | All migrations complete |

**Total Estimated Duration**: 10-14 days

## Benefits Post-Migration

### Developer Experience
- Unified API for card metadata across all games
- Consistent debugging and inspection tools
- Reduced learning curve for new team members
- Standardized patterns for future game engines

### Performance
- Centralized metadata storage reduces memory fragmentation
- Optimized access patterns for metadata queries
- Reduced object creation overhead

### Maintainability  
- Single pattern to maintain instead of 6 different approaches
- Easier to add cross-game features and analytics
- Simplified testing and validation procedures
- Consistent error handling and validation

### Type Safety
- Strong typing for all metadata operations
- Compile-time validation of metadata access
- IntelliSense support for all metadata properties
- Prevents runtime errors from metadata misuse

---

**Note**: This plan should be executed after completion of current tasks. Each phase can be implemented incrementally with thorough testing between phases. 