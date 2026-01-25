# Incomplete Effect Objects - Fix Prompt

## Context

After revamping the type definitions in `@tcg/lorcana-types`, there are ~663 type errors in the test files (`set-001.test.ts` through `set-010.test.ts`) where test expectations use incomplete effect objects that are missing required properties.

## Incomplete Effect Patterns Found

The following effect types are used in tests without their required properties:

### High Priority (Most Common)

| Effect Type | Count | Missing Required Properties |
|-------------|-------|----------------------------|
| `{ type: "gain-keyword" }` | 70 | `keyword`, `target` |
| `{ type: "optional" }` | 67 | `effect` |
| `{ type: "conditional" }` | 45 | `condition`, `then` |
| `{ type: "restriction" }` | 34 | `restriction`, `target` |
| `{ type: "compound" }` | 31 | `effects` |
| `{ type: "modify-stat" }` | 28 | `stat`, `modifier`, `target` |
| `{ type: "return-to-hand" }` | 14 | `target` |
| `{ type: "banish" }` | 14 | `target` |
| `{ type: "for-each" }` | 12 | `counter`, `effect` |

### Medium Priority

| Effect Type | Count | Missing Required Properties |
|-------------|-------|----------------------------|
| `{ type: "modify-stat", stat: "strength", modifier: N }` | 11 | `target` |
| `{ type: "gain-lore" }` | 9 | `amount` |
| `{ type: "deal-damage", amount: N }` | 9 | `target` |
| `{ type: "remove-damage", amount: N }` | 8 | `target` |
| `{ type: "exert" }` | 8 | `target` |
| `{ type: "draw" }` | 8 | `amount` |
| `{ type: "deal-damage" }` | 8 | `amount`, `target` |

### Lower Priority

| Effect Type | Count | Missing Required Properties |
|-------------|-------|----------------------------|
| `{ type: "draw", amount: N }` | 7 | (complete, but may need `target`) |
| `{ type: "property-modification" }` | 6 | `property`, `value`, `operation`, `target` |
| `{ type: "move-damage", amount: N }` | 6 | `from`, `to` |
| `{ type: "look-at-top" }` | 6 | `amount` |
| `{ type: "grant-ability" }` | 6 | `ability`, `target` |
| `{ type: "ready" }` | 4 | `target` |
| `{ type: "discard" }` | 4 | `amount` |
| `{ type: "modal" }` | 3 | `options` |
| `{ type: "scry" }` | 2 | `amount` |
| `{ type: "replacement" }` | 2 | `replaces` |
| `{ type: "shuffle-into-deck" }` | 1 | `target` |
| `{ type: "reveal-hand" }` | 1 | `target` |
| `{ type: "return-from-discard" }` | 1 | `target` |
| `{ type: "put-on-top" }` | 1 | `source` |

---

## LLM Prompt for Fixing

```
You are a TypeScript expert fixing type errors in test files for a Lorcana TCG card game engine.

## Task

Fix incomplete effect objects in test files to match the required type definitions. Each effect type has required properties that must be present.

## Type Definitions Reference

### OptionalEffect
```typescript
interface OptionalEffect {
  type: "optional";
  effect: Effect;  // REQUIRED - the effect that may be performed
  prompt?: string;
}
```

### ConditionalEffect
```typescript
interface ConditionalEffect {
  type: "conditional";
  condition: Condition;  // REQUIRED
  then: Effect;          // REQUIRED
  else?: Effect;
}
```

### ModifyStatEffect
```typescript
interface ModifyStatEffect {
  type: "modify-stat";
  stat: "strength" | "willpower" | "lore";  // REQUIRED
  modifier: Amount;                          // REQUIRED
  target: CharacterTarget | LocationTarget;  // REQUIRED
  duration?: EffectDuration;
}
```

### GainKeywordEffect
```typescript
interface GainKeywordEffect {
  type: "gain-keyword";
  keyword: "Rush" | "Ward" | "Evasive" | "Bodyguard" | "Support" | "Reckless" | "Alert" | "Challenger" | "Resist";  // REQUIRED
  value?: number;  // For Challenger +X and Resist +X
  target: CharacterTarget;  // REQUIRED
  duration?: EffectDuration;
}
```

### RestrictionEffect
```typescript
interface RestrictionEffect {
  type: "restriction";
  restriction: "cant-quest" | "cant-challenge" | "cant-be-challenged" | "cant-ready" | ...;  // REQUIRED
  target: CharacterTarget | PlayerTarget;  // REQUIRED
  duration?: EffectDuration;
}
```

### CompoundEffect
```typescript
interface CompoundEffect {
  type: "compound";
  effects: Effect[];  // REQUIRED
}
```

### BanishEffect
```typescript
interface BanishEffect {
  type: "banish";
  target: CharacterTarget | ItemTarget | LocationTarget;  // REQUIRED
}
```

### ReturnToHandEffect
```typescript
interface ReturnToHandEffect {
  type: "return-to-hand";
  target: CardTarget;  // REQUIRED
}
```

### ForEachEffect
```typescript
interface ForEachEffect {
  type: "for-each";
  counter: ForEachCounter;  // REQUIRED
  effect: Effect;           // REQUIRED
  maximum?: number;
}
```

### GainLoreEffect
```typescript
interface GainLoreEffect {
  type: "gain-lore";
  amount: Amount;  // REQUIRED
  target?: PlayerTarget;
}
```

### DealDamageEffect
```typescript
interface DealDamageEffect {
  type: "deal-damage";
  amount: Amount;           // REQUIRED
  target: CharacterTarget;  // REQUIRED
}
```

### RemoveDamageEffect
```typescript
interface RemoveDamageEffect {
  type: "remove-damage";
  amount: Amount;           // REQUIRED
  target: CharacterTarget;  // REQUIRED
}
```

### ExertEffect
```typescript
interface ExertEffect {
  type: "exert";
  target: CharacterTarget | ItemTarget;  // REQUIRED
}
```

### DrawEffect
```typescript
interface DrawEffect {
  type: "draw";
  amount: Amount;  // REQUIRED
  target?: PlayerTarget;
}
```

### DiscardEffect
```typescript
interface DiscardEffect {
  type: "discard";
  amount: Amount;  // REQUIRED
  target?: PlayerTarget;
  random?: boolean;
}
```

### MoveDamageEffect
```typescript
interface MoveDamageEffect {
  type: "move-damage";
  amount: Amount;           // REQUIRED
  from: CharacterTarget;    // REQUIRED
  to: CharacterTarget;      // REQUIRED
}
```

## Instructions

1. For each test file, find the incomplete effect objects
2. Look at the card text being parsed to understand what the effect should do
3. Add the missing required properties based on the card's actual behavior
4. Common targets:
   - `"SELF"` - this character
   - `"CHOSEN_CHARACTER"` - a chosen character
   - `"CHOSEN_OPPOSING_CHARACTER"` - opponent's chosen character
   - `"CONTROLLER"` - the player who controls this card
   - `"OPPONENT"` - the opposing player

## Example Fix

Before:
```typescript
effect: {
  type: "optional",
}
```

After (based on card text "You may draw a card"):
```typescript
effect: {
  type: "optional",
  effect: { type: "draw", amount: 1 }
}
```

Before:
```typescript
effect: {
  type: "modify-stat",
  stat: "strength",
  modifier: -3,
}
```

After:
```typescript
effect: {
  type: "modify-stat",
  stat: "strength",
  modifier: -3,
  target: "CHOSEN_OPPOSING_CHARACTER"
}
```

## Files to Fix

- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-001.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-002.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-003.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-004.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-005.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-006.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-007.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-008.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-009.test.ts`
- `packages/lorcana-cards/src/parser/v2/__tests__/card-texts/set-010.test.ts`

Process one file at a time. For each incomplete effect, read the card text in the test to understand what the effect should do, then add the appropriate required properties.
```

---

## Verification Command

After fixing, run:
```bash
cd packages/lorcana-cards && bun run check-types
```

Target: 0 type errors in the test files.
