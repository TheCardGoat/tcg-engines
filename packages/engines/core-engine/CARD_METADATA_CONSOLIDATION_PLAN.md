# Card Metadata Consolidation Plan

## Overview
This document outlines the plan to consolidate card metadata across all game engines to use a unified approach via the core context (`ctx.cardMetas`), replacing the current fragmented patterns.

## Current State Analysis

### Game Engine Metadata Patterns

| Engine | Current Pattern | Complexity | Migration Effort | Status |
|--------|----------------|------------|------------------|--------|
| **Lorcana** | `G.metas: Record<InstanceId, LorcanaCardMeta>` | Low | Easy - Direct move | ✅ COMPLETE |
| **Grand Archive** | `GrandArchiveEnrichedCard` with embedded metadata | High | Hard - Major restructure | 🔄 PENDING |
| **One Piece** | `CardInstanceState` interface | Medium | Medium - Interface conversion | 🔄 PENDING |
| **Riftbound** | `CardInstanceState` interface | High | Hard - Complex metadata | 🔄 PENDING |
| **Alpha Clash** | Mixed patterns (`EnrichedCard` + game state) | Medium | Medium - Pattern consolidation | ✅ COMPLETE |
| **Gundam** | Context provider pattern | Medium | Medium - Provider migration | ✅ COMPLETE |

## Implementation Plan

### Phase 1: Core Engine Infrastructure (High Priority) ✅ COMPLETED

#### 1.1 Update Core Context Type ✅ DONE
**File**: `src/game-engine/core-engine/state/context.ts`
```typescript
// Add CardMeta generic parameter
export interface CoreCtx<TurnHistory = unknown, CardMeta = BaseCardMeta> {
  // ... existing fields ...
  cardMetas: Record<string, CardMeta>;
}
```

#### 1.2 Extend Game-Specific Types System ✅ DONE
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

#### 1.3 Add Core Metadata Operations ✅ DONE
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
  setCardMeta(instanceId: string, meta: CardMeta): void;
  updateCardMeta(instanceId: string, meta: Partial<CardMeta>): void;
  updateCardMetaField<K extends keyof CardMeta>(instanceId: string, field: K, value: CardMeta[K]): void;
  removeCardMeta(instanceId: string): void;
  clearCardMetaField<K extends keyof CardMeta>(instanceId: string, field: K): void;
  
  // Bulk operations
  setCardMetas(metas: Record<string, CardMeta>): void;
  getCardMetas(): Record<string, CardMeta>;
  clearAllCardMetas(): void;
}
```

#### 1.4 Update Core Engine Generics ✅ DONE
**Files**: All core engine files that use generic types
- `core-engine.ts`
- `game-configuration.ts` 
- `core-card-instance-store.ts`
- All related interfaces and types

### Phase 2: Game Engine Migrations (Incremental)

#### 2.1 Lorcana Migration (Low Risk - Priority 1) ✅ COMPLETE
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

#### 2.2 Gundam Migration (Medium Risk - Priority 2) ✅ COMPLETE
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

#### 2.3 Alpha Clash Migration (Medium Risk - Priority 3) ✅ COMPLETE
**Effort**: ~10 hours
**Files**:
- `alpha-clash-engine-types.ts`
- `src/cards/definitions/cardTypes.ts`
- All Alpha Clash card operations

**Changes**:
- Created `AlphaClashCardMeta` type to extend `BaseCardMeta`
- Added `AlphaClashCardMeta` as a generic type parameter to the `AlphaClashEngine`
- Created `AlphaClashCoreOperations` class extending `CoreOperation`
- Implemented all metadata operations (damage, counters, modifiers, etc.)
- Added comprehensive tests for card metadata operations

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

## Progress Summary

### Completed Tasks
- ✅ Core engine infrastructure updates
- ✅ Core metadata operations implementation
- ✅ Lorcana migration
- ✅ Gundam migration
- ✅ Alpha Clash migration

### Pending Tasks
- 🔄 One Piece migration
- 🔄 Riftbound migration
- 🔄 Grand Archive migration
- 🔄 Final cleanup and validation

## Success Criteria

### Technical Goals
- [x] Core engine updates for unified metadata pattern
- [x] Type safety maintained across completed migrations
- [ ] All games use unified `ctx.cardMetas` pattern (3/6 complete)
- [ ] No performance regression (< 5% overhead)
- [ ] All existing tests pass after migration

### Quality Goals
- [x] Consistent metadata API across migrated games
- [x] Reduced code duplication in metadata handling
- [x] Improved debugging and inspection capabilities
- [x] Simplified onboarding for new game engines

## Revised Timeline Estimate

| Phase | Duration | Dependencies | Status |
|-------|----------|--------------|--------|
| Phase 1: Core Infrastructure | 2-3 days | None | ✅ COMPLETE |
| Phase 2.1: Lorcana | 1 day | Phase 1 complete | ✅ COMPLETE |
| Phase 2.2: Gundam | 1 day | Phase 1 complete | ✅ COMPLETE |
| Phase 2.3: Alpha Clash | 1.5 days | Phase 1 complete | ✅ COMPLETE |
| Phase 2.4: One Piece | 1 day | Phase 1 complete | 🔄 PENDING |
| Phase 2.5: Riftbound | 2 days | Phase 1 complete | 🔄 PENDING |
| Phase 2.6: Grand Archive | 2 days | Phase 1 complete | 🔄 PENDING |
| Phase 3: Cleanup & Validation | 1-2 days | All migrations complete | 🔄 PENDING |

**Completion Progress**: 50% (3/6 engines migrated) 