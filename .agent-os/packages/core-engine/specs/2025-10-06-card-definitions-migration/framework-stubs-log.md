# Framework Stubs Created for Migration

## Overview
This document tracks all framework stubs created to support type checking during the card definitions migration from legacy patterns to the new API.

## Date: 2025-10-06

### Test Engine Stubs

#### File: `src/game-engine/engines/lorcana/src/testing/lorcana-test-engine.ts`

**Changes:**
1. **playCard method** - Extended opts parameter type to include legacy properties:
   - `targetId?: string` - Legacy single target ID (use targets array instead)
   - `mode?: string` - Legacy modal ability selection
   - `acceptOptionalLayer?: boolean` - Legacy optional effect handling
   - `skip?: boolean` - Legacy effect skipping

2. **resolveTopOfStack method** - Extended opts parameter type to include:
   - `targets` changed from `string[]` to `Array<LorcanaCardDefinition | LorcanaCardInstance | string>` - Accepts card definitions and instances
   - `targetId?: string` - Legacy single target ID
   - `acceptOptionalLayer?: boolean` - Legacy optional effect handling
   - `skip?: boolean` - Legacy effect skipping

3. **questCard method** - Added new method stub:
   - Parameters: `card: LorcanaCardDefinition | LorcanaCardInstance | { id: string }`
   - Purpose: Legacy quest functionality (maps to exertCard internally)

### Card Instance Stubs

#### File: `src/game-engine/engines/lorcana/src/cards/lorcana-card-instance.ts`

**Changes:**
1. **hasRush property** - Added getter:
   - Returns: `boolean`
   - Purpose: Check if card has "rush" keyword ability

2. **isDead property** - Added getter:
   - Returns: `boolean`
   - Logic: `zone === "discard" || damage >= willpower`
   - Purpose: Check if character is dead/banished

### Ability Module Stubs

#### File: `src/game-engine/engines/lorcana/src/abilities/index.ts`

**Created new file** with exports:
- All core ability types and utilities
- Purpose: Central export point for ability system

#### File: `src/game-engine/engines/lorcana/src/abilities/whenAbilities.ts`

**Created new stub module:**
- Exports: `WhenAbility` type, `createWhenAbility` function
- Purpose: Legacy "when" triggered abilities compatibility

#### File: `src/game-engine/engines/lorcana/src/abilities/wheneverAbilities.ts`

**Created new stub module:**
- Exports: `WheneverAbility` type, `createWheneverAbility` function
- Purpose: Legacy "whenever" triggered abilities compatibility

#### File: `src/game-engine/engines/lorcana/src/abilities/whileAbilities.ts`

**Created new stub module:**
- Exports: `WhileAbility` type, `createWhileAbility` function
- Purpose: Legacy "while" static abilities compatibility

#### File: `src/game-engine/engines/lorcana/src/abilities/conditions/conditions.ts`

**Created new stub module:**
- Exports: `Condition` type, `createCondition` function
- Purpose: Legacy ability conditions compatibility

#### File: `src/game-engine/engines/lorcana/src/abilities/targets/index.ts`

**Created new file** with exports:
- All target types (card, player, base)
- Purpose: Centralized target exports

### Effect Type Stubs

#### File: `src/game-engine/engines/lorcana/src/abilities/effect-types.ts`

**Changes:**
1. **HealEffect** - Added legacy effect type:
   - Type: `"heal"`
   - Parameters: `{ value: number | DynamicValue }`
   - Purpose: Legacy heal effect (maps to removeDamage)

2. **AttributeEffect** - Added legacy effect type:
   - Type: `"attribute"`
   - Parameters: `{ attribute: "strength" | "lore" | "willpower", value: number | DynamicValue }`
   - Purpose: Legacy attribute modification (maps to get/modifyStat)

## Impact Summary

### Set 001 Action Cards
- **Total Files**: 35 card definitions + corresponding test files
- **TypeScript Errors Before**: ~30 errors
- **TypeScript Errors After**: 0 errors
- **Migration Status**: ✅ All type checks passing

### Stubs Created
- **Test Engine Methods**: 3 changes (playCard opts, resolveTopOfStack opts, questCard method)
- **Card Instance Properties**: 2 additions (hasRush, isDead)
- **Ability Modules**: 5 new stub modules
- **Effect Types**: 2 legacy effect types added

## Next Steps

The stubs created are minimal and only satisfy TypeScript's type checker. They do not implement actual functionality. As the new framework is developed, these stubs should be:

1. Reviewed for proper implementation
2. Replaced with actual functionality where needed
3. Deprecated and removed once legacy tests are updated

## Migration Status

- ✅ Set 001 Actions: Type checking passing
- ⏳ Set 001 Characters: Pending
- ⏳ Set 001 Items: Pending
- ⏳ Set 001 Locations: Pending
- ⏳ Sets 002-009: Pending
