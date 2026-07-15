# Effect Type Migration Documentation

## Overview

This document tracks the migration from legacy effect shapes to the new `Effect` type in `@tcg/gundam-types`.

## Field Mapping Reference

When migrating card definitions from the legacy `BaseEffect` shape to the new `Effect` type, apply the following mappings:

| Legacy Field | New Field | Notes |
|-------------|-----------|-------|
| `type: "TRIGGERED"` | `category: "triggered"` | Effect category |
| `type: "ACTIVATED"` | `category: "activated"` | Effect category |
| `type: "CONSTANT"` | `category: "constant"` | Effect category |
| `type: "KEYWORD"` | `category: "keyword"` | Effect category |
| `type: "COMMAND"` | `category: "command"` | Effect category |
| `description` | `text` | Display text shown on the card |
| `action` | `actions: [action]` | Now an array of `EffectAction` |
| `restrictions` | *(removed)* | Handled by move validation |
| `costs` | *(removed)* | Handled by move validation |
| `conditions` | *(removed)* | Handled by move validation |
| *(new)* | `targeting` | `TargetingSpec` for target selection |

## Timing Type Mapping

Legacy timing strings map to the new `EffectTiming` type:

| Legacy Timing | New Timing | Notes |
|---------------|------------|-------|
| `"DEPLOY"` | `{ phase: "deploy", event: "after" }` | After unit deploys |
| `"ATTACK"` | `{ phase: "attack", event: "after" }` | After attack completes |
| `"DESTROYED"` | `{ phase: "combat", event: "after" }` | When card is destroyed |
| `"BURST"` | `{ phase: "burst", event: "immediate" }` | Burst timing |
| `"WHEN_PAIRED"` | `{ phase: "deploy", event: "after" }` | When pilot pairs |
| `"WHEN_LINKED"` | `{ phase: "deploy", event: "after" }` | When pilot links |
| `"START_OF_TURN"` | `{ phase: "start", event: "immediate" }` | Start of turn |
| `"END_OF_TURN"` | `{ phase: "end", event: "immediate" }` | End of turn |
| `"MAIN"` | `{ phase: "main", event: "immediate" }` | Main phase |
| `"ACTION"` | `{ phase: "action", event: "immediate" }` | Action phase |

## Action Type Mapping

Legacy `Action` types need to be converted to `EffectAction`:

| Legacy Action | New EffectAction | Conversion Notes |
|---------------|------------------|------------------|
| `DRAW` | `DRAW` | Map `value` → `count`, add `player` |
| `REST` | `REST` | Convert `target` to `TargetingSpec` |
| `STAND` | `ACTIVATE` | Convert `target` to `TargetingSpec` |
| `DEPLOY` | `MOVE_CARD` | `from: "hand"`, `to: "battleArea"` |
| `ADD_TO_HAND` | `MOVE_CARD` | `from: "battleArea"`, `to: "hand"` |
| `DAMAGE` | `DAMAGE` | Map `value` → `amount` |
| `HEAL` | *(custom)* | Not directly in EffectAction |
| `MODIFY_STATS` | `MODIFY_STATS` | Map attribute/value fields |
| `GAIN_KEYWORDS` | `GRANT_KEYWORD` | Convert to `KeywordEffect` |
| `DISCARD` | `DISCARD` | Map `value` → `count` |
| `SEARCH` | `SEARCH` | Add `reveal`, `shuffleAfter` |
| `SEQUENCE` | *(expand)* | Flatten to multiple actions |
| `CONDITIONAL` | *(custom)* | Not directly in EffectAction |
| `CUSTOM` | *(custom)* | Cannot be converted |

## Files Using Legacy Effects

As of this migration phase, the following files have been identified as using the legacy effect shape:

### Card Definition Files
- `packages/gundam-cards/src/cards/gd01/command/099-intercept-orders.ts`

### Parser/Tool Files
- `packages/gundam-cards/tools/parser/text-parser.ts` (outputs BaseEffect)
- `packages/gundam-cards/tools/parser/__tests__/text-parser.test.ts`
- `packages/gundam-cards/tools/generator/__tests__/card-generator.test.ts`
- `packages/gundam-cards/tools/coverage/validate-parser-coverage.ts`

## Transitional Type Support

The following transitional types have been added to maintain backward compatibility:

1. **`BaseEffect`** - Legacy effect shape with `type`, `description`, `restrictions`, `costs`, `conditions`, `action`
2. **`LegacyAction`** - Legacy action types (prefixed with "Legacy" to avoid conflicts)
3. **`CardEffects`** - Union type: `BaseEffect[] | Effect[]` for use in card definitions

## Mapper Function

Use the `legacyToNewEffect()` function from `@tcg/gundam-types` to convert legacy effects:

```typescript
import { legacyToNewEffect, legacyToNewEffects } from "@tcg/gundam-types";

// Convert single effect
const newEffect = legacyToNewEffect(legacyBaseEffect);

// Convert array of effects
const newEffects = legacyToNewEffects(legacyBaseEffects);
```

## Next Steps

1. **Update card definitions** to use the new `Effect` shape
2. **Update parser output** to generate new `Effect` shapes directly
3. **Remove legacy types** once migration is complete:
   - Remove `legacy-types.ts`
   - Remove `legacy-mapper.ts`
   - Change `CardEffects` to just `Effect[]`

## Status

- ✅ Duplicate identifier issues fixed in `@tcg/gundam-types`
- ✅ `CardEffects` union type added for transitional support
- ✅ Parser returns `BaseEffect[]` instead of `Effect[]`
- ✅ Legacy types exported from `@tcg/gundam-types`
- ⏳ Card definitions need migration to new `Effect` shape
- ⏳ Tests need updating to work with new types

## Type Errors Remaining

As of the latest check, there are 26 type errors remaining, all in test files that reference the new `Effect` type on parser output (which returns `BaseEffect`). These tests need to be updated to either:
1. Cast to `BaseEffect` and use legacy properties
2. Use the `legacyToNewEffect()` mapper before testing
