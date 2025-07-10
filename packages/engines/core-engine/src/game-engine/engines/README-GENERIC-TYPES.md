# Generic Type System Implementation

## Overview

This document explains the implementation of **Solution 1: Generic Type Parameters** for the CoreEngine system. This solution provides complete compile-time type safety for game-specific implementations with a clean, modern API.

## Architecture

### Core Components

1. **Base Type System** (`/src/game-engine/core-engine/types/game-specific-types.ts`)
   - Defines foundational interfaces that all games must implement
   - Provides utility types for type-safe extensions
   - Ensures type constraints are met at compile time

2. **Generic CoreEngine** (`/src/game-engine/core-engine/engine/core-engine.ts`)
   - Accepts 4 generic type parameters for complete type safety
   - Provides type-safe card filtering and state management
   - Clean, modern API without legacy cruft

3. **Game-Specific Type Definitions**
   - **Gundam**: `/src/game-engine/engines/gundam/src/gundam-generic-types.ts`
   - **Lorcana**: `/src/game-engine/engines/lorcana/src/lorcana-generic-types.ts`

## Type Safety Benefits

### Before (Limited Type Safety)
```typescript
// Basic filtering with no game-specific validation
const cards = engine.queryCards({
  zone: "hand",
  cardType: "invalid-type", // ❌ No compile-time validation
  cost: "expensive",        // ❌ Wrong type accepted
});
```

### After (Complete Type Safety)
```typescript
// Gundam engine with full type safety
const gundamCards = gundamEngine.queryCardsByFilter({
  zone: "battleArea",
  cardType: "Unit",           // ✅ Only valid Gundam card types
  color: "blue",              // ✅ Only valid Gundam colors
  cost: { min: 2, max: 5 },   // ✅ Proper cost structure
  canDeploy: true,            // ✅ Game-specific properties
});

// Lorcana engine with different type safety
const lorcanaCards = lorcanaEngine.queryCardsByFilter({
  zone: "play",
  cardType: "character",      // ✅ Only valid Lorcana card types
  exerted: false,             // ✅ Lorcana-specific state
  lore: { min: 1 },          // ✅ Proper lore constraints
  rarity: "rare",            // ✅ Collection filtering
});
```

## Generic Type Parameters

The CoreEngine now uses 4 generic type parameters:

```typescript
export class CoreEngine<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
>
```

### Parameter Explanations

1. **GameState**: Game-specific state structure
   - Gundam: Includes phase, priority, turn tracking
   - Lorcana: Includes effects, bag, layer system

2. **CardDefinition**: Game-specific card properties
   - Gundam: Unit/Pilot/Base/Command cards with attack/defense
   - Lorcana: Character/Action/Item/Location cards with lore/strength

3. **PlayerState**: Player-specific data
   - Gundam: Zones, turn history, resources
   - Lorcana: Lore, ink, quest progress

4. **CardFilter**: Game-specific filtering capabilities
   - Gundam: Cost, color, pairing, deployment zones
   - Lorcana: Exerted state, ink colors, keywords, rarity

## Implementation Details

### Type Extension Pattern

Games extend base types using intersection types:

```typescript
// Base type (minimal requirements)
export interface BaseCoreCardFilter {
  zone?: string;
  owner?: string;
  publicId?: string;
  instanceId?: string;
}

// Game-specific extension
export type GundamCardFilter = ExtendCardFilter<{
  cardType?: "Unit" | "Pilot" | "Command" | "Base" | "Resource";
  color?: "blue" | "green" | "red" | "white";
  cost?: { min?: number; max?: number; exact?: number };
  canDeploy?: boolean;
  // ... more Gundam-specific properties
}>;
```

### Engine Integration

Game engines specify their types during instantiation:

```typescript
// Gundam Engine
export class GundamEngine {
  private client: CoreEngine<
    GundamGameState,      // Game state
    GundamCardDefinition, // Card definitions
    GundamPlayerState,    // Player state
    GundamCardFilter      // Card filtering
  >;
}

// Lorcana Engine
export class LorcanaEngine {
  private coreEngine: CoreEngine<
    LorcanaGameState,      // Different game state
    LorcanaCardDefinition, // Different card definitions
    LorcanaPlayerState,    // Different player state
    LorcanaCardFilter      // Different filtering
  >;
}
```

## Usage Examples

### Gundam-Specific Filtering

```typescript
// Find all deployable blue units in hand
const deployableUnits = gundamEngine.queryCardsByFilter({
  zone: "hand",
  cardType: "Unit",
  color: "blue",
  canDeploy: true,
  cost: { max: 3 }
});

// Find paired pilots
const pairedPilots = gundamEngine.queryCardsByFilter({
  cardType: "Pilot",
  isPaired: true,
  zone: "battleArea"
});
```

### Lorcana-Specific Filtering

```typescript
// Find questable characters
const questableCharacters = lorcanaEngine.queryCardsByFilter({
  zone: "play",
  cardType: "character",
  exerted: false,
  canQuest: true,
  lore: { min: 1 }
});

// Find affordable cards
const affordableCards = lorcanaEngine.queryCardsByFilter({
  zone: "hand",
  cost: { max: 4 },
  ink: ["amber", "steel"],
  canBePlayed: true
});
```

## Clean API Design

The implementation provides a clean, type-safe API:

1. **Single Method**: `queryCardsByFilter()` handles all filtering needs
2. **Type Safety**: Complete compile-time validation of filter properties
3. **Game-Specific**: Each game gets its own strongly-typed filtering capabilities

```typescript
// Type-safe filtering with game-specific properties
const typedCards = engine.queryCardsByFilter({ 
  zone: "hand", 
  cardType: "Unit",
  cost: { min: 2, max: 5 }
});
```

## Runtime Validation

While the system provides compile-time safety, runtime validation helpers are available:

```typescript
// Type guards for runtime validation
if (isGundamCardFilter(unknownFilter)) {
  // TypeScript now knows it's a GundamCardFilter
  const results = gundamEngine.queryCardsByFilter(unknownFilter);
}
```

## Performance Impact

The generic type system has **zero runtime overhead**:
- All type checking happens at compile time
- No additional memory usage
- No performance degradation
- Same runtime behavior as before

## Implementation Guide

### For Game Developers

1. **Define your game types** using the extension pattern
2. **Update your engine class** to use the generic CoreEngine
3. **Export your types** for external usage
4. **Implement type-safe filtering methods**

### For Engine Users

1. **Import game-specific types** from engine modules
2. **Use `queryCardsByFilter()`** with type-safe filters
3. **Leverage TypeScript autocomplete** for better DX
4. **Benefit from compile-time validation** to catch errors early

## Benefits Summary

✅ **Complete Compile-Time Type Safety**
✅ **Zero Runtime Overhead**
✅ **Clean, Modern API**
✅ **Game-Specific Property Support**
✅ **Enhanced Developer Experience**
✅ **Automatic Type Inference**
✅ **Comprehensive Error Prevention**
✅ **Scalable Architecture**

This implementation provides the robust foundation needed for type-safe, game-specific TCG engines with a clean, modern API design that eliminates legacy complexity.