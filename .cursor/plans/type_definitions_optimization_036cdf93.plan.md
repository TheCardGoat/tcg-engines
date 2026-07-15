---
name: Type Definitions Optimization
overview: Optimize and consolidate Lorcana Engine type definitions following the new API redesign architecture, using a systematic approach similar to the card-texts parser plan.
todos:
  - id: phase-1-card-typess
    content: Update card-types.ts with CardColors, CardColor, Duration, Zone shared types and LocationCard enhancements
    status: pending
  - id: phase-2-targets
    content: Consolidate target system - reduce CharacterTargetEnum explosion, enhance TargetFilter types
    status: pending
  - id: phase-3-effects
    content: Add missing effect types (~28 new types) to effect-types directory
    status: pending
  - id: phase-4-conditions
    content: Add missing condition types (~15 new types) to condition-types.ts
    status: pending
  - id: phase-5-triggers
    content: Add missing trigger types (~8 new types) to trigger-types.ts
    status: pending
  - id: phase-6-helpers
    content: Create helper namespaces (Abilities, Costs, Triggers, Targets, Effects, Conditions) in packages/lorcana-types/src/helpers/
    status: pending
  - id: phase-7-dedup
    content: Remove type duplicates from lorcana-engine, re-export from lorcana-types
    status: pending
isProject: false
---

# Lorcana Engine Type Definitions Optimization Plan

## Overview

This plan optimizes the type definitions across `@tcg/lorcana-types` and `@tcg/lorcana-engine` packages to align with the new API redesign architecture. The approach mirrors the card-texts parser plan: document expected structures first, then implement systematically.

## Current State Analysis

### Existing Type Locations

- **`@tcg/lorcana-types`** (primary source of truth):
  - [`src/abilities/ability-types.ts`](packages/lorcana-types/src/abilities/ability-types.ts) - 767 lines, well-structured
  - [`src/abilities/effect-types/`](packages/lorcana-types/src/abilities/effect-types/) - 6 files, comprehensive
  - [`src/abilities/target-types.ts`](packages/lorcana-types/src/abilities/target-types.ts) - 792 lines, extensive enums
  - [`src/abilities/condition-types.ts`](packages/lorcana-types/src/abilities/condition-types.ts) - 1203 lines, many condition types
  - [`src/abilities/trigger-types.ts`](packages/lorcana-types/src/abilities/trigger-types.ts) - 531 lines
  - [`src/abilities/cost-types.ts`](packages/lorcana-types/src/abilities/cost-types.ts) - 345 lines
  - [`src/cards/card-types.ts`](packages/lorcana-types/src/cards/card-types.ts) - 503 lines

- **`@tcg/lorcana-engine`** (duplicates some types):
  - [`src/cards/abilities/types/`](packages/lorcana-engine/src/cards/abilities/types/) - 6 files, duplicates lorcana-types
  - [`src/types/branded-types.ts`](packages/lorcana-engine/src/types/branded-types.ts) - 107 lines

### Key Issues Identified

1. **Type Duplication**: `lorcana-engine` duplicates types from `lorcana-types`
2. **Incomplete Effect Types**: ~68+ effect types needed, current has ~40
3. **Missing Helper Namespaces**: `Abilities`, `Costs`, `Triggers`, `Targets`, `Effects`, `Conditions`
4. **Target Enum Explosion**: 250+ string literal targets, needs consolidation

---

## Phase 1: Card Type Consolidation

### 1.1 Update Card Hierarchy

Modify [`packages/lorcana-types/src/cards/card-types.ts`](packages/lorcana-types/src/cards/card-types.ts):

- Add `CardColors` tuple type: `[CardColor, CardColor] | [CardColor]`
- Add `CardColor` union: `"amber" | "amethyst" | "emerald" | "ruby" | "sapphire" | "steel"`
- Consolidate `Characteristics` type (currently in classifications.ts)
- Add `Duration` shared type: `"turn" | "next_turn" | "until_start_of_your_next_turn" | "while-condition" | "permanent"`
- Add `Zone` shared type: `"hand" | "discard" | "deck" | "inkwell" | "play"`

### 1.2 Location Card Enhancements

Add to `LocationCard` interface:

- `movementDiscounts?: readonly MovementDiscount[]`
- `entersPlayExerted?: boolean`

---

## Phase 2: Effect System Expansion

### 2.1 New Effect Types Needed

Add to [`packages/lorcana-types/src/abilities/effect-types/`](packages/lorcana-types/src/abilities/effect-types/):

**Player Effects** (12 types):

- `RevealHandEffect`
- `DiscardCardsEffect` (with chooser)
- `GainLoreDynamicEffect`
- `DiscardCardsDynamicEffect`
- `ScryDynamicEffect`
- `SkipPhaseEffect`

**Movement Effects** (new):

- `ShuffleIntoDeckEffect`
- `PutCardUnderEffect`
- `PlayForFreeEffect`
- `MoveDamageEffect`

**Keyword Effects** (new):

- `GrantChallengerEffect`
- `GrantAbilityEffect`
- `CanChallengeReadyEffect`

**Restriction Effects** (new):

- `CannotSingEffect`
- `PreventDamageEffect`
- `PreventAttributeReductionEffect`
- `GlobalRestrictionEffect`

**Complex Effects** (new):

- `UnlessEffect`
- `ForEachTargetEffect`
- `CostReductionEffect`
- `DynamicCostReductionEffect`
- `AdditionalInkwellEffect`
- `HealAndCostReductionEffect`
- `AllowInkFromEffect`

### 2.2 DynamicAmount Enhancement

Update `DynamicAmountConfig`:

```typescript
interface DynamicAmountConfig {
  readonly type: "dynamic";
  readonly filters: readonly TargetFilter[];
  readonly excludeSelf?: boolean;
  readonly multiplier?: number;
}
```

---

## Phase 3: Condition System Expansion

### 3.1 New Condition Types

Add to [`packages/lorcana-types/src/abilities/condition-types.ts`](packages/lorcana-types/src/abilities/condition-types.ts):

**Compound Conditions**:

- Ensure `NotCondition`, `AndCondition`, `OrCondition` are complete

**Turn-based Conditions**:

- `FirstTurnCondition`
- `NotFirstPlayerCondition`
- `NoChallengesThisTurnCondition`

**Card State Conditions**:

- `DamagedCondition` (with target)
- `NoDamageCondition` (with target)
- `ExertedCondition` (with target)
- `HandSizeCondition`
- `HandSizeComparisonCondition`
- `InkwellCountCondition`

**Zone Tracking Conditions**:

- `CardLeftZoneThisTurnCondition`
- `CardPutUnderThisTurnCondition`
- `CharacterBanishedInChallengeCondition`
- `HadExertedCharacterAtLocationCondition`
- `HaveInPlayCondition`
- `ExistsCondition`

---

## Phase 4: Trigger System Expansion

### 4.1 New Trigger Types

Add to [`packages/lorcana-types/src/abilities/trigger-types.ts`](packages/lorcana-types/src/abilities/trigger-types.ts):

- `LeavesPlayTrigger`
- `BanishAnotherTrigger`
- `CardPutUnderTrigger`
- `CardPutIntoZoneTrigger`
- `AfterChallengeTrigger`
- `AbilityUsedTrigger`
- `DamageTrigger`
- `HealTrigger`

---

## Phase 5: Target System Consolidation

### 5.1 Reduce Target Enum Explosion

Current `CharacterTargetEnum` has 250+ values. Consolidate to:

1. **Core targets** (~20): `SELF`, `CHOSEN_CHARACTER`, `YOUR_CHARACTERS`, etc.
2. **Query-based targets**: Use `CharacterTargetQuery` for complex filtering
3. **Deprecate** specific targets like `YOUR_OTHER_SAPPHIRE_CHARACTERS`

### 5.2 Enhanced Filter Types

Add to `TargetFilter`:

```typescript
| { readonly filter: "name"; readonly value: string }
| { readonly filter: "keyword"; readonly value: string; readonly negate?: boolean }
| { readonly filter: "status"; readonly value: "damaged" | "exerted" | "ready" }
| { readonly filter: "has-ability"; readonly abilityType?: string }
| { readonly filter: "cards-under"; readonly comparison?: NumericComparison }
```

---

## Phase 6: Helper Namespaces

### 6.1 Create Helper Files

Create [`packages/lorcana-types/src/helpers/`](packages/lorcana-types/src/helpers/) directory:

- `Abilities.ts` - 50+ helper functions
- `Costs.ts` - 12+ helper functions
- `Triggers.ts` - 25+ helper functions
- `Targets.ts` - 70+ helper functions
- `Effects.ts` - 80+ helper functions
- `Conditions.ts` - 40+ helper functions

### 6.2 Example Helper Structure

```typescript
// packages/lorcana-types/src/helpers/Abilities.ts
export namespace Abilities {
  export function shift(cost: number | Cost[], name: string | string[]): StaticAbility;
  export function singer(value: number): StaticAbility;
  export function ward(): StaticAbility;
  export function rush(): StaticAbility;
  // ... 50+ more
}
```

---

## Phase 7: Remove Duplicates

### 7.1 Consolidate lorcana-engine Types

Update [`packages/lorcana-engine/src/cards/abilities/types/`](packages/lorcana-engine/src/cards/abilities/types/):

- Re-export from `@tcg/lorcana-types` instead of duplicating
- Keep only engine-specific types (runtime state, not definitions)
```typescript
// packages/lorcana-engine/src/cards/abilities/types/index.ts
export * from "@tcg/lorcana-types";
// Engine-specific additions only
export type { RuntimeAbilityState } from "./runtime-types";
```


---

## Implementation Order

1. **Phase 1**: Card type consolidation
2. **Phase 5**: Target system consolidation (reduces complexity)
3. **Phase 2**: Effect system expansion
4. **Phase 3**: Condition system expansion
5. **Phase 4**: Trigger system expansion
6. **Phase 6**: Helper namespaces
7. **Phase 7**: Remove duplicates

---

## Verification Strategy

For each phase:

1. Add types with `// TODO: Implement` comments
2. Run `bun run check-types` to verify no regressions
3. Update existing card definitions to use new types
4. Run `bun test` to verify behavior unchanged

---

## Files to Modify

| File | Action |

|------|--------|

| `packages/lorcana-types/src/cards/card-types.ts` | Modify |

| `packages/lorcana-types/src/abilities/effect-types/*.ts` | Modify |

| `packages/lorcana-types/src/abilities/condition-types.ts` | Modify |

| `packages/lorcana-types/src/abilities/trigger-types.ts` | Modify |

| `packages/lorcana-types/src/abilities/target-types.ts` | Modify |

| `packages/lorcana-types/src/helpers/*.ts` | Create |

| `packages/lorcana-engine/src/cards/abilities/types/*.ts` | Modify (re-export) |