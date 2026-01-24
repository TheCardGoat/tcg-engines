---
name: parser-pattern-create
description: Add new patterns to the split pattern files in packages/lorcana-cards/src/parser/patterns/. Handles proper pattern placement, type definitions, and extractor functions.
---

# Parser Pattern Create Skill

## Purpose

Add new patterns to the appropriate pattern files following the split pattern architecture. Handles V1 simple patterns and V2 atomic effects.

## Pattern File Structure

### V1 Pattern Files

```
packages/lorcana-cards/src/parser/patterns/
├── costs.ts        # Exert, ink cost patterns
├── conditions.ts   # If, while, may patterns
├── effects.ts      # Draw, damage, banish patterns
├── index.ts        # Central export
├── keywords.ts     # Keyword ability patterns
├── targets.ts      # Character, item target patterns
└── triggers.ts     # When, whenever, at start patterns
```

### V2 Atomic Effects

```
packages/lorcana-cards/src/parser/v2/effects/atomic/
├── banish-effect.ts
├── damage-effect.ts
├── discard-effect.ts
├── draw-effect.ts
├── exert-effect.ts
├── index.ts
├── inkwell-effect.ts
├── keyword-effect.ts
├── location-effect.ts
├── lore-effect.ts
├── play-effect.ts
├── return-effect.ts
├── reveal-effect.ts
├── stat-mod-effect.ts
└── ...
```

## Adding V1 Patterns

### Step 1: Choose Target File

```typescript
const patternFiles = {
  // Effect-producing patterns
  draw: "patterns/effects.ts",
  damage: "patterns/effects.ts",
  banish: "patterns/effects.ts",
  gainLore: "patterns/effects.ts",

  // Trigger patterns
  whenPlay: "patterns/triggers.ts",
  whenQuests: "patterns/triggers.ts",
  atStartOfTurn: "patterns/triggers.ts",

  // Condition patterns
  ifHave: "patterns/conditions.ts",
  whileHave: "patterns/conditions.ts",
  youMay: "patterns/conditions.ts",

  // Target patterns
  chosenCharacter: "patterns/targets.ts",
  opposingCharacter: "patterns/targets.ts",

  // Keyword patterns
  evasive: "patterns/keywords.ts",
  challenger: "patterns/keywords.ts",

  // Cost patterns
  exert: "patterns/costs.ts",
  inkCost: "patterns/costs.ts"
};
```

### Step 2: Read Existing File

```bash
# Read the target pattern file
cat packages/lorcana-cards/src/parser/patterns/effects.ts
```

### Step 3: Add Pattern

**Pattern Structure:**

```typescript
// In effects.ts
export const EFFECT_PATTERNS = {
  // Existing patterns...

  // New pattern
  opponentChoiceDiscard: {
    name: "opponent-choice-discard",
    pattern: /(?:have )?(?:each )?opponent(?:s)? choose (?:and )?discard (?:a )?cards?/i,
    type: "opponent-choice-discard",
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: "opponent-choice-discard",
      parameters: {
        target: "each-opponent",
        effect: "discard",
        amount: 1
      }
    })
  }
};
```

### Step 4: Add Type Definition

If new effect type, add to types:

```typescript
// In packages/lorcana-types/src/effect-types.ts or relevant type file
export interface OpponentChoiceDiscardEffect {
  type: "opponent-choice-discard";
  parameters: {
    target: "opponent" | "each-opponent";
    effect: "discard";
    amount: number;
  };
}

// Add to union type
export type ParsedEffect =
  | DrawEffect
  | DamageEffect
  | OpponentChoiceDiscardEffect // Add new type
  | ...;
```

### Step 5: Update Index

If creating new category, update index:

```typescript
// packages/lorcana-cards/src/parser/patterns/index.ts
export * from "./costs";
export * from "./keywords";
export * from "./triggers";
export * from "./effects";      // Add if new
export * from "./conditions";   // Add if new
export * from "./targets";      // Add if new
```

## Adding V2 Atomic Effects

### When to Use V2

- Complex multi-clause effects
- Effects with nested conditions
- Modal/choice effects
- Effects requiring composition

### Step 1: Create Atomic Effect File

```typescript
// packages/lorcana-cards/src/parser/v2/effects/atomic/opponent-choice-effect.ts

import type { AtomicEffect, EffectParser } from "../../types";

export interface OpponentChoiceEffect extends AtomicEffect {
  effectType: "opponent-choice";
  target: "opponent" | "each-opponent";
  choiceType: "discard" | "sacrifice" | "return";
  amount: number;
}

export const OPPONENT_CHOICE_PATTERNS: EffectParser<OpponentChoiceEffect>[] = [
  {
    name: "opponent-choice-discard",
    pattern: /(?:have )?(?:each )?opponent(?:s)? choose (?:and )?discard (?:a |(\d+) )?cards?/i,
    parse: (match): OpponentChoiceEffect => ({
      effectType: "opponent-choice",
      target: match[0].includes("each") ? "each-opponent" : "opponent",
      choiceType: "discard",
      amount: match[1] ? parseInt(match[1], 10) : 1
    })
  }
];

export function parseOpponentChoice(text: string): OpponentChoiceEffect | null {
  for (const parser of OPPONENT_CHOICE_PATTERNS) {
    const match = text.match(parser.pattern);
    if (match) {
      return parser.parse(match);
    }
  }
  return null;
}
```

### Step 2: Register in Index

```typescript
// packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts

export * from "./banish-effect";
export * from "./damage-effect";
export * from "./opponent-choice-effect"; // Add new
// ... etc
```

### Step 3: Add to Effect Registry

```typescript
// packages/lorcana-cards/src/parser/v2/effects/registry.ts

import { parseOpponentChoice } from "./atomic/opponent-choice-effect";

export const EFFECT_PARSERS = [
  parseDraw,
  parseDamage,
  parseOpponentChoice, // Add new
  // ... etc
];
```

## Pattern Placement Rules

### Priority Order

Within each pattern file, order patterns by specificity:

```typescript
export const EFFECT_PATTERNS = {
  // 1. Most specific patterns (multi-condition, exact text)
  dealDamageToEachOpposing: { priority: 1, ... },

  // 2. Moderately specific (single condition)
  dealDamageToChosen: { priority: 5, ... },

  // 3. General patterns (catch-all)
  dealDamage: { priority: 10, ... }
};
```

### Conflict Resolution

If patterns could overlap:

```typescript
// BAD: General pattern matches before specific
const patterns = [
  /deal (\d+) damage/i,                    // Matches first, loses context
  /deal (\d+) damage to each opposing/i   // Never reached
];

// GOOD: Specific first
const patterns = [
  /deal (\d+) damage to each opposing/i,  // Checked first
  /deal (\d+) damage to chosen/i,          // Then this
  /deal (\d+) damage/i                     // Fallback
];
```

## Verification Steps

### Step 1: Type Check

```bash
cd packages/lorcana-cards && bun run check-types
```

### Step 2: Run Pattern Tests

```bash
cd packages/lorcana-cards && bun test patterns
```

### Step 3: Test Integration

```bash
cd packages/lorcana-cards && bun test parser
```

## Code Templates

### Simple Effect Pattern

```typescript
export const NEW_EFFECT_PATTERNS = {
  patternName: {
    name: "pattern-name",
    pattern: /regex pattern here/i,
    type: "effect-type",
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: "effect-type",
      parameters: {
        param: match[1]
      }
    })
  }
};
```

### Trigger Pattern

```typescript
export const NEW_TRIGGER_PATTERNS = {
  triggerName: {
    name: "trigger-name",
    pattern: /when(?:ever)? event happens/i,
    type: "triggered",
    triggerType: "event-type",
    extractor: (match: RegExpMatchArray): ParsedTrigger => ({
      type: "triggered",
      trigger: "event-type",
      parameters: {}
    })
  }
};
```

### Condition Pattern

```typescript
export const NEW_CONDITION_PATTERNS = {
  conditionName: {
    name: "condition-name",
    pattern: /if you have (.+?) in play/i,
    type: "condition",
    extractor: (match: RegExpMatchArray): ParsedCondition => ({
      type: "condition",
      conditionType: "has-in-play",
      target: match[1]
    })
  }
};
```

## Common Mistakes

### Missing Type Export

```typescript
// Don't forget to add to type unions
// In effect-types.ts
export type ParsedEffect = ... | NewEffectType;
```

### Wrong Pattern Order

```typescript
// Check that new pattern doesn't shadow existing patterns
// Run all tests to verify
```

### Missing Capture Groups

```typescript
// Ensure all capture groups are used in extractor
pattern: /pattern (group1) and (group2)/i,
extractor: (match) => ({
  field1: match[1], // group1
  field2: match[2]  // group2 - don't forget!
})
```

## Output Protocol

Report pattern creation result:

```typescript
{
  success: true,
  patternName: "opponent-choice-discard",
  patternFile: "packages/lorcana-cards/src/parser/patterns/effects.ts",
  typeFile: "packages/lorcana-types/src/effect-types.ts",
  changes: [
    { file: "effects.ts", action: "added-pattern" },
    { file: "effect-types.ts", action: "added-type" }
  ],
  nextStep: "run-tests"
}
```

## Quick Reference

### Files to Modify

| Pattern Type | V1 File | V2 Directory |
|--------------|---------|--------------|
| Effects | `patterns/effects.ts` | `v2/effects/atomic/*.ts` |
| Triggers | `patterns/triggers.ts` | N/A |
| Conditions | `patterns/conditions.ts` | N/A |
| Targets | `patterns/targets.ts` | N/A |
| Keywords | `patterns/keywords.ts` | N/A |
| Costs | `patterns/costs.ts` | N/A |

### Type Files

- `packages/lorcana-types/src/effect-types.ts`
- `packages/lorcana-types/src/ability-types.ts`

## Keywords

patterns, implementation, regex, effects, triggers, conditions, lorcana, parser
