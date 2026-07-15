# Gundam Card Effects Migration Guide

This document tracks the migration from legacy `BaseEffect` type to the new consolidated `Effect` type for Gundam card definitions.

## Overview

The new `Effect` type consolidates and standardizes how card effects are defined across the Gundam TCG codebase. The new structure is more type-safe, enables better effect composition, and separates effect definitions from their execution logic.

## Type Comparison

### Legacy BaseEffect Structure

```typescript
interface BaseEffect {
  id: string;
  type: "ACTIVATED" | "TRIGGERED" | "CONSTANT" | "KEYWORD" | "COMMAND";
  timing?: string;
  description: string;
  restrictions: EffectRestriction[];
  costs?: EffectCost[];
  conditions?: EffectCondition[];
  action: LegacyAction;
}
```

### New Effect Structure

```typescript
interface Effect {
  id: string;
  category: "keyword" | "triggered" | "activated" | "command" | "constant";
  timing: EffectTiming;
  actions: EffectAction[];
  targeting?: TargetingSpec;
  text: string;
}
```

## Field Mapping

| Legacy Field | New Field | Notes |
|-------------|------------|-------|
| `type` | `category` | Uppercase → lowercase (e.g., "TRIGGERED" → "triggered") |
| `description` | `text` | Direct field rename |
| `action` | `actions` | Singular → array, wrap in brackets |
| `action.target` | `targeting` | Convert `TargetQuery` to `TargetingSpec` |
| `restrictions` | *(removed)* | Not represented in new Effect type |
| `costs` | *(removed)* | Not represented in new Effect type |
| `conditions` | *(removed)* | Not represented in new Effect type |

## Category Mapping

| Legacy `type` | New `category` |
|---------------|-----------------|
| `"ACTIVATED"` | `"activated"` |
| `"TRIGGERED"` | `"triggered"` |
| `"CONSTANT"` | `"constant"` |
| `"KEYWORD"` | `"keyword"` |
| `"COMMAND"` | `"command"` |

## Timing Mapping

| Legacy `timing` | New `timing` |
|----------------|---------------|
| `"BURST"` | `{ phase: "burst", event: "immediate" }` |
| `"MAIN"` | `{ phase: "main", event: "immediate" }` |
| `"ACTION"` | `{ phase: "action", event: "immediate" }` |
| `"DEPLOY"` | `{ phase: "deploy", event: "after" }` |
| `"ATTACK"` | `{ phase: "attack", event: "after" }` |
| `"DESTROYED"` | `{ phase: "combat", event: "after" }` |
| `"START_OF_TURN"` | `{ phase: "start", event: "immediate" }` |
| `"END_OF_TURN"` | `{ phase: "end", event: "immediate" }` |

## Action Type Mapping

| Legacy Action Type | New Action Type | Notes |
|-------------------|-----------------|-------|
| `"DRAW"` | `"DRAW"` | `value` → `count` |
| `"REST"` | `"REST"` | Add `target: TargetingSpec` |
| `"STAND"` | `"ACTIVATE"` | Renamed for clarity |
| `"DAMAGE"` | `"DAMAGE"` | `value` → `amount` |
| `"DEPLOY"` | `"MOVE_CARD"` | With `from: "hand", to: "battleArea"` |
| `"ADD_TO_HAND"` | `"MOVE_CARD"` | With `from: "battleArea", to: "hand"` |
| `"DISCARD"` | `"DISCARD"` | `value` → `count` |
| `"SEARCH"` | `"SEARCH"` | Map `destination` to `ZoneType` |
| `"MODIFY_STATS"` | `"MODIFY_STATS"` | Add `target: TargetingSpec` |
| `"HEAL"` | *(not implemented)* | Would be negative DAMAGE |
| `"GAIN_KEYWORDS"` | `"GRANT_KEYWORD"` | Map to `KeywordEffect` |
| `"CONDITIONAL"` | *(inline in actions)* | Extract true action |
| `"SEQUENCE"` | *(flatten)* | Use multiple actions |
| `"CUSTOM"` | *(not supported)* | Requires custom implementation |

## Targeting Conversion

### Legacy TargetQuery
```typescript
{
  controller: "OPPONENT",
  cardType: "UNIT",
  count: { min: 1, max: 2 },
  filters: [{ type: "hp", comparison: "lte", value: 5 }],
}
```

### New TargetingSpec
```typescript
{
  count: { min: 1, max: 2 },
  validTargets: [{
    type: "unit",
    owner: "opponent",
    state: { hasDamageAtLeast: 0 },
  }],
  chooser: "controller",
  timing: "on_resolution",
}
```

### TargetFilter Property Mapping

| Legacy Filter | New Filter | Notes |
|--------------|-------------|-------|
| `controller: "OPPONENT"` | `owner: "opponent"` | Uppercase → lowercase |
| `controller: "SELF"` | `owner: "self"` | Uppercase → lowercase |
| `cardType: "UNIT"` | `type: "unit"` | Uppercase → lowercase |
| `filters: [{ type: "hp", comparison: "lte", value: 5 }]` | *(custom handling)* | HP threshold filters require custom logic |
| `filters: [{ type: "exerted" }]` | `state: { rested: false }` | Boolean filter |
| `filters: [{ type: "ready" }]` | `state: { rested: true }` | Boolean filter |
| `filters: [{ type: "damaged" }]` | `state: { damaged: true }` | Boolean filter |

## Migration Status

### Completed Cards

| Card ID | Card Name | Date | Notes |
|----------|-----------|------|-------|
| gd01-099 | Intercept Orders | 2026-02-11 | First migrated card; HP filters need custom handling |

### Cards Using Legacy Format (Remaining)

As of 2026-02-11, only `gd01-099` (Intercept Orders) was using the legacy `BaseEffect` format. This card has now been migrated.

**All other cards** in the `packages/gundam-cards/src/cards/` directory use raw `text` field only (no structured effects). These cards will need future parsing to extract structured effects.

### Cards by Set

#### GD01 (121 cards total)
- **Command Cards**: 23 cards (gd01-099 through gd01-121)
  - Migrated: 1 (gd01-099)
  - Raw text only: 22
- **Pilot Cards**: 12 cards (gd01-087 through gd01-098)
  - All raw text only
- **Unit Cards**: 73 cards (gd01-001 through gd01-073)
  - All raw text only
- **Base Cards**: 8 cards (gd01-123 through gd01-130)
  - All raw text only
- **Resource Cards**: 5 cards
  - All raw text only

## Known Limitations

### HP Threshold Filters

The legacy `HpFilter` with comparison operators (`lte`, `gte`, etc.) does not have a direct mapping to `TargetStateFilter`. The new system supports:
- `damaged: boolean` - has any damage
- `hasDamageAtLeast: number` - minimum damage

**Workaround**: For HP threshold effects like "5 or less HP", the filter should be handled in the effect execution layer, or the `TargetingSpec` should be extended to support property filters.

## Migration Steps

When migrating a card from legacy to new format:

1. **Update imports**: Add `Effect` to imports from `@tcg/gundam-types`
2. **Map effect type**: Change `type` field to `category` (lowercase)
3. **Update timing**: Convert string timing to `EffectTiming` object
4. **Convert action**: Wrap single `action` in `actions` array
5. **Add targeting**: Convert `action.target` (if present) to `targeting` field
6. **Rename description**: Change `description` to `text`
7. **Remove unused fields**: Delete `restrictions`, `costs`, `conditions`
8. **Test**: Run `bun run check-types` and `bun test` to verify

## Helper Functions

The `legacy-mapper.ts` module provides conversion utilities:

```typescript
import { legacyToNewEffect, legacyToNewEffects } from "@tcg/gundam-types";

// Convert single effect
const newEffect = legacyToNewEffect(legacyBaseEffect);

// Convert array of effects
const newEffects = legacyToNewEffects(legacyBaseEffects);
```

## Type Enforcement

After migration is complete, update `packages/gundam-types/src/cards/card-types.ts`:

```typescript
// Current (transitional)
export type CardEffects = BaseEffect[] | Effect[];

// Post-migration (strict)
export type CardEffects = Effect[];
```

And remove the transitional union type.

## References

- **New Effect Types**: `packages/gundam-types/src/effects/effect-definition.ts`
- **Legacy Types**: `packages/gundam-types/src/effects/legacy-types.ts`
- **Mapper**: `packages/gundam-types/src/effects/legacy-mapper.ts`
- **Targeting**: `packages/gundam-types/src/effects/targeting.ts`
- **DSL**: `packages/gundam-types/src/targeting/gundam-target-dsl.ts`

## TODO

- [ ] Implement HP threshold filter support in `TargetingSpec`
- [ ] Parse structured effects from raw card text for all cards
- [ ] Remove `BaseEffect` and related legacy types after full migration
- [ ] Remove `legacy-mapper.ts` after all cards are migrated
- [ ] Update `CardEffects` type to strict `Effect[]`
