# Migration Guide: @tcg/core v2.0.0

**Date:** 2025-10-09  
**Target Audience:** Game engine developers (lorcana-engine, gundam-engine)  
**Breaking Changes:** Yes

## Overview

This guide provides step-by-step instructions for migrating to `@tcg/core` v2.0.0. The new version consolidates types to eliminate duplication and provide a stronger foundation for TCG engines.

## Breaking Changes Summary

1. **Zone Visibility Model** - Changed from 2-tier to 3-tier
2. **Branded Types** - Games must use core's branded types
3. **Zone State** - New `ZoneState` utility type added
4. **Game State** - New base `GameState` type added
5. **Card Definition** - New optional metadata fields added

## Migration for @tcg/lorcana-engine

### Step 1: Remove Branded Type Duplications

**Files to modify:**
- `packages/lorcana-engine/src/types/branded-types.ts` ❌ DELETE
- All files importing from `./types/branded-types` ✏️ UPDATE

**Before:**
```typescript
// packages/lorcana-engine/src/types/branded-types.ts
export type Brand<K, T> = K & { readonly __brand: T };
export type PlayerId = Brand<string, "PlayerId">;
export type CardId = Brand<string, "CardId">;
export type ZoneId = Brand<string, "ZoneId">;
export type GameId = Brand<string, "GameId">;

export const createPlayerId = (value: string): PlayerId => {
  if (!value || value.length === 0) {
    throw new Error("PlayerId cannot be empty");
  }
  return value as PlayerId;
};
// ... other creators
```

**After:**
```typescript
// DELETE: packages/lorcana-engine/src/types/branded-types.ts
//  This file is no longer needed

// In all files that used branded types:
import type { CardId, PlayerId, ZoneId, GameId, AbilityId } from "@tcg/core";
import { createCardId, createPlayerId, createZoneId, createGameId, createAbilityId } from "@tcg/core";
```

**Files to update:**
```bash
# Find all imports
grep -r "from.*branded-types" packages/lorcana-engine/src

# Update each file to import from "@tcg/core" instead
```

### Step 2: Adopt Core's Zone Visibility Model

**Files to modify:**
- `packages/lorcana-engine/src/game-definition/zones.ts` ✏️ UPDATE

**Before:**
```typescript
export type ZoneVisibility = "owner" | "all";

export type ZoneConfig = {
  visibility: ZoneVisibility;
  ordered: boolean;
  facedown: boolean;
};

export const lorcanaZones: Record<LorcanaZoneId, ZoneConfig> = {
  deck: {
    visibility: "owner",
    ordered: true,
    facedown: true,
  },
  hand: {
    visibility: "owner",
    ordered: false,
    facedown: false,
  },
  play: {
    visibility: "all",
    ordered: false,
    facedown: false,
  },
  discard: {
    visibility: "all",
    ordered: true,
    facedown: false,
  },
  inkwell: {
    visibility: "owner",
    ordered: false,
    facedown: true,
  },
};
```

**After:**
```typescript
import type { ZoneVisibility, ZoneConfig } from "@tcg/core";
import { createZoneId } from "@tcg/core";

export type LorcanaZoneId = "deck" | "hand" | "play" | "discard" | "inkwell";

// Use core's ZoneConfig (includes id, name, visibility, ordered, faceDown, maxSize, owner)
export const lorcanaZones: Record<LorcanaZoneId, ZoneConfig> = {
  deck: {
    id: createZoneId("deck"),
    name: "Deck",
    visibility: "secret",  // Changed from "owner" + facedown: true
    ordered: true,
    faceDown: true,  // Capital D
  },
  hand: {
    id: createZoneId("hand"),
    name: "Hand",
    visibility: "private",  // Changed from "owner" + facedown: false
    ordered: false,
  },
  play: {
    id: createZoneId("play"),
    name: "Play",
    visibility: "public",  // Changed from "all"
    ordered: false,
  },
  discard: {
    id: createZoneId("discard"),
    name: "Discard",
    visibility: "public",  // Changed from "all"
    ordered: true,
  },
  inkwell: {
    id: createZoneId("inkwell"),
    name: "Inkwell",
    visibility: "secret",  // Changed from "owner" + facedown: true
    ordered: false,
    faceDown: true,  // Capital D
  },
};
```

**Visibility Migration Table:**

| Lorcana Old | Core New | Reasoning |
|-------------|----------|-----------|
| `"owner"` + `facedown: true` | `"secret"` | Nobody can see (even owner) |
| `"owner"` + `facedown: false` | `"private"` | Only owner can see |
| `"all"` + `facedown: false` | `"public"` | Everyone can see |

### Step 3: Use Core's Zone State Utilities

**Files to modify:**
- `packages/lorcana-engine/src/game-definition/zone-operations.ts` ❌ DELETE
- Files using zone operations ✏️ UPDATE

**Before:**
```typescript
// packages/lorcana-engine/src/game-definition/zone-operations.ts
export type ZoneState = Record<PlayerId, CardId[]>;

export const createZoneState = (players: PlayerId[]): ZoneState => {
  const zoneState: ZoneState = {} as ZoneState;
  for (const player of players) {
    zoneState[player] = [];
  }
  return zoneState;
};

export const addCardToZone = (
  zoneState: ZoneState,
  playerId: PlayerId,
  cardId: CardId,
): void => {
  if (!zoneState[playerId]) {
    zoneState[playerId] = [];
  }
  zoneState[playerId].push(cardId);
};

// ... other operations
```

**After:**
```typescript
// DELETE: packages/lorcana-engine/src/game-definition/zone-operations.ts
// Use core's zone operations instead

// In files that used zone operations:
import type { ZoneState } from "@tcg/core";
import {
  createZoneState,
  addCardToZone,
  addCardToTop,
  addCardToBottom,
  removeCardFromZone,
  moveCardBetweenZones,
  isCardInZone,
  getCardsInZone,
  getZoneSize,
  getTopCard,
  clearZone,
} from "@tcg/core";
```

**Note:** All function signatures are identical, so no code changes needed beyond imports!

### Step 4: Extend Core's Game State

**Files to modify:**
- `packages/lorcana-engine/src/types/lorcana-state.ts` ✏️ UPDATE

**Before:**
```typescript
export type LorcanaPhase = "beginning" | "main" | "end";

export type LorcanaState = {
  players: PlayerId[];
  currentPlayerIndex: number;
  turnNumber: number;
  phase: LorcanaPhase;
  lorcana: {
    lore: Record<PlayerId, number>;
    ink: { ... };
    // ... game-specific state
  };
};
```

**After:**
```typescript
import type { GameState, PlayerId, CardId } from "@tcg/core";

export type LorcanaPhase = "beginning" | "main" | "end";

// Extend core's GameState
export type LorcanaState = GameState & {
  // Override phase with specific type
  phase: LorcanaPhase;
  
  // Add game-specific state
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

**Benefits:**
- Eliminates duplication of `players`, `currentPlayerIndex`, `turnNumber`
- Clear extension pattern
- Type-safe override of `phase`

### Step 5: Update Zone Helper Functions

**Files to modify:**
- `packages/lorcana-engine/src/game-definition/zones.ts` ✏️ UPDATE

**Before:**
```typescript
export const isPublicZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "all";
};

export const isPrivateZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "owner";
};
```

**After:**
```typescript
export const isPublicZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "public";
};

export const isPrivateZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "private";
};

// Add new helper for secret zones
export const isSecretZone = (zoneId: LorcanaZoneId): boolean => {
  return lorcanaZones[zoneId].visibility === "secret";
};
```

### Step 6: Clean Up Index Exports

**Files to modify:**
- `packages/lorcana-engine/src/index.ts` ✏️ UPDATE

**Before:**
```typescript
// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
} from "@tcg/core";
```

**After:**
```typescript
// Re-export core framework types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
  RuleEngineOptions,
  // Add new exports
  GameState,
  ZoneState,
  ZoneConfig,
  ZoneVisibility,
  CardDefinition,
  CardInstance,
  PlayerId,
  CardId,
  ZoneId,
  GameId,
  AbilityId,
} from "@tcg/core";

export {
  // Re-export creator functions
  createPlayerId,
  createCardId,
  createZoneId,
  createGameId,
  createAbilityId,
  // Re-export zone operations
  createZoneState,
  addCardToZone,
  addCardToTop,
  addCardToBottom,
  removeCardFromZone,
  moveCardBetweenZones,
  isCardInZone,
  getCardsInZone,
  getZoneSize,
  getTopCard,
  clearZone,
} from "@tcg/core";
```

## Migration for @tcg/gundam-engine

### Status

Gundam engine is not yet implemented, so no migration needed. Follow these patterns from the start:

### Pattern 1: Import Branded Types

```typescript
import type { CardId, PlayerId, ZoneId, GameId, AbilityId } from "@tcg/core";
import { createCardId, createPlayerId, createZoneId, createGameId, createAbilityId } from "@tcg/core";
```

### Pattern 2: Extend Card Definitions

```typescript
import type { CardDefinition } from "@tcg/core";

export type GundamCardType = "UNIT" | "PILOT" | "COMMAND" | "BASE" | "RESOURCE";

export type GundamCard = CardDefinition & {
  cardType: GundamCardType;
  color?: "blue" | "red" | "green" | "white";
  level?: number;
  // ... other game-specific fields
};
```

### Pattern 3: Extend Game State

```typescript
import type { GameState, PlayerId, CardId } from "@tcg/core";

export type GundamPhase = "start" | "draw" | "resource" | "main" | "end";

export type GundamGameState = GameState & {
  phase: GundamPhase;
  gundam: {
    shields: Record<PlayerId, CardId[]>;
    bases: Record<PlayerId, CardId | null>;
    battlePositions: Record<PlayerId, BattlePosition[]>;
    activeResources: Record<PlayerId, number>;
    currentAttack: AttackSequence | null;
  };
};
```

### Pattern 4: Use Zone System

```typescript
import type { ZoneConfig, ZoneState } from "@tcg/core";
import { createZoneId, createZoneState, moveCardBetweenZones } from "@tcg/core";

export type GundamZoneId = "deck" | "hand" | "battle" | "shield" | "resource" | "trash" | "removal";

export const gundamZones: Record<GundamZoneId, ZoneConfig> = {
  deck: {
    id: createZoneId("deck"),
    name: "Deck",
    visibility: "secret",
    ordered: true,
    faceDown: true,
  },
  battle: {
    id: createZoneId("battle"),
    name: "Battle Area",
    visibility: "public",
    ordered: true,
    maxSize: 6,
  },
  shield: {
    id: createZoneId("shield"),
    name: "Shield Area",
    visibility: "private",
    ordered: false,
    faceDown: true,
    maxSize: 6,
  },
  // ... other zones
};
```

## Validation Checklist

After migration, verify:

- [ ] No TypeScript errors
- [ ] All tests pass
- [ ] No custom branded type implementations
- [ ] All zone operations use core utilities
- [ ] Game state extends `GameState`
- [ ] Zone visibility uses 3-tier model
- [ ] Imports come from `@tcg/core`

## Testing Strategy

### Unit Tests

Update import statements in test files:

```typescript
// Before
import { createPlayerId, createCardId } from "../types/branded-types";
import { createZoneState, addCardToZone } from "../game-definition/zone-operations";

// After
import { createPlayerId, createCardId, createZoneState, addCardToZone } from "@tcg/core";
```

### Integration Tests

Verify zone visibility behavior:

```typescript
import { describe, it, expect } from "bun:test";
import { lorcanaZones } from "../game-definition/zones";

describe("Zone Visibility Migration", () => {
  it("deck uses secret visibility", () => {
    expect(lorcanaZones.deck.visibility).toBe("secret");
  });

  it("hand uses private visibility", () => {
    expect(lorcanaZones.hand.visibility).toBe("private");
  });

  it("play uses public visibility", () => {
    expect(lorcanaZones.play.visibility).toBe("public");
  });

  it("discard uses public visibility", () => {
    expect(lorcanaZones.discard.visibility).toBe("public");
  });

  it("inkwell uses secret visibility", () => {
    expect(lorcanaZones.inkwell.visibility).toBe("secret");
  });
});
```

## Common Issues & Solutions

### Issue 1: Type Incompatibility

**Symptom:** `Type 'PlayerId' is not assignable to type 'PlayerId'`

**Cause:** Mixing old lorcana PlayerId with new core PlayerId

**Solution:** Ensure all imports come from `@tcg/core`, not local types

### Issue 2: Zone Visibility Checks Fail

**Symptom:** `visibility === "owner"` checks fail

**Cause:** Lorcana still using old visibility values

**Solution:** Update to `visibility === "private"` or `visibility === "secret"`

### Issue 3: Zone Config Missing Properties

**Symptom:** `Property 'id' is missing in type 'ZoneConfig'`

**Cause:** Lorcana's old ZoneConfig didn't have `id` and `name`

**Solution:** Add `id` and `name` to all zone configs

### Issue 4: faceDown vs facedown

**Symptom:** `Property 'facedown' does not exist on type 'ZoneConfig'`

**Cause:** Core uses `faceDown` (capital D), lorcana used `facedown` (lowercase)

**Solution:** Update to `faceDown` everywhere

## Rollback Plan

If migration fails:

1. Revert core package to v1.x
2. Keep lorcana types as-is
3. File issues for type compatibility problems
4. Plan incremental migration

## Timeline Estimate

- **Small engines (< 10 files):** 1-2 hours
- **Medium engines (10-50 files):** 2-4 hours
- **Large engines (50+ files):** 4-8 hours

**Lorcana engine:** Estimated 2-3 hours (minimal implementation currently)

## Support

For migration issues:

1. Check this guide first
2. Review type-analysis.md for detailed comparisons
3. Review type-specification.md for design rationale
4. File issue with migration context

## Next Steps After Migration

1. Run `bun run check` to verify everything passes
2. Update documentation to reflect core types
3. Remove unused type files
4. Add integration examples
5. Commit with clear migration message


