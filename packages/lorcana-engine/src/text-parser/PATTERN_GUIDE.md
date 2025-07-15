# Pattern Addition Guide

This guide explains how to add new patterns to the Action Text Parser for future maintenance and expansion.

## Table of Contents

- [Overview](#overview)
- [Pattern Structure](#pattern-structure)
- [Adding Basic Patterns](#adding-basic-patterns)
- [Advanced Pattern Techniques](#advanced-pattern-techniques)
- [Testing New Patterns](#testing-new-patterns)
- [Pattern Optimization](#pattern-optimization)
- [Common Pitfalls](#common-pitfalls)
- [Examples](#examples)

## Overview

The Action Text Parser uses a pattern-based system to recognize different types of effects in card text. Patterns are defined as regular expressions with associated extractor functions that convert matched text into structured effect objects.

### Pattern Database Structure

Patterns are organized in the `EFFECT_PATTERNS` object in `patterns.ts`:

```typescript
export const EFFECT_PATTERNS: Record<string, EffectPattern[]> = {
  effectType: [
    {
      pattern: /regex pattern/i,
      type: 'effectType',
      extractor: (match: RegExpMatchArray) => ParsedEffect
    }
  ]
};
```

## Pattern Structure

### EffectPattern Interface

```typescript
interface EffectPattern {
  pattern: RegExp;           // The regex pattern to match
  type: string;             // The effect type identifier
  extractor: (match: RegExpMatchArray) => ParsedEffect;  // Function to extract effect data
}
```

### ParsedEffect Interface

```typescript
interface ParsedEffect {
  type: string;                           // Effect type (must match pattern type)
  amount?: number | DynamicAmount;        // Numeric amount if applicable
  duration?: string;                      // Duration modifier if applicable
  target?: EffectTargets;                 // Target object if applicable
  parameters: Record<string, any>;        // Additional parameters
}
```

## Adding Basic Patterns

### Step 1: Identify the Pattern

First, analyze the card text you want to support:

```typescript
// Example card text: "Restore 3 health to chosen character"
// Pattern elements:
// - Action: "Restore"
// - Amount: "3" 
// - Resource: "health"
// - Target: "chosen character"
```

### Step 2: Create the Regex Pattern

```typescript
// Basic pattern for the example above
const pattern = /restore (\d+) health to (.+)/i;

// Breakdown:
// - /restore/i - matches "restore" (case insensitive)
// - (\d+) - captures one or more digits (the amount)
// - health - matches literal "health"
// - to - matches literal "to"
// - (.+) - captures everything after "to" (the target)
```

### Step 3: Create the Extractor Function

```typescript
const extractor = (match: RegExpMatchArray): ParsedEffect => {
  return {
    type: 'restore',
    amount: parseInt(match[1], 10),  // Convert captured amount to number
    parameters: {
      resource: 'health',
      targetText: match[2].trim()    // Store target text for later processing
    }
  };
};
```

### Step 4: Add to Pattern Database

```typescript
// In patterns.ts, add to EFFECT_PATTERNS
EFFECT_PATTERNS.restore = [
  {
    pattern: /restore (\d+) health to (.+)/i,
    type: 'restore',
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: 'restore',
      amount: parseInt(match[1], 10),
      parameters: {
        resource: 'health',
        targetText: match[2].trim()
      }
    })
  }
];
```

### Step 5: Test the Pattern

```typescript
import { generateActionAbilitiesFromText } from '../parser';

// Test the new pattern
const result = generateActionAbilitiesFromText("Restore 3 health to chosen character");
console.log(result);
```

## Advanced Pattern Techniques

### Handling Multiple Variations

Often, the same effect can be expressed in different ways. Create multiple patterns for the same effect type:

```typescript
EFFECT_PATTERNS.draw = [
  // Most specific patterns first
  {
    pattern: /draw (\d+) cards? from (?:your )?deck/i,
    type: 'draw',
    extractor: (match) => ({
      type: 'draw',
      amount: parseInt(match[1], 10),
      parameters: { source: 'deck' }
    })
  },
  {
    pattern: /draw (\d+) cards?/i,
    type: 'draw',
    extractor: (match) => ({
      type: 'draw',
      amount: parseInt(match[1], 10),
      parameters: {}
    })
  },
  {
    pattern: /draw a card/i,
    type: 'draw',
    extractor: () => ({
      type: 'draw',
      amount: 1,
      parameters: {}
    })
  }
];
```

### Dynamic Amounts

Handle variable amounts like "X" or word numbers:

```typescript
const extractor = (match: RegExpMatchArray): ParsedEffect => {
  const amountText = match[1].toLowerCase();
  let amount: number | DynamicAmount;

  // Handle numeric amounts
  if (/^\d+$/.test(amountText)) {
    amount = parseInt(amountText, 10);
  }
  // Handle word numbers
  else if (amountText === 'one') {
    amount = 1;
  }
  else if (amountText === 'two') {
    amount = 2;
  }
  // Handle variables
  else {
    amount = {
      type: 'variable',
      value: amountText.toUpperCase()
    } as DynamicAmount;
  }

  return {
    type: 'yourEffect',
    amount,
    parameters: {}
  };
};
```

### Optional Pattern Elements

Use regex groups and optional matching:

```typescript
// Pattern that handles optional elements
const pattern = /deal (\d+) damage(?: to (.+?))?(?:\s+this turn)?/i;

const extractor = (match: RegExpMatchArray): ParsedEffect => {
  const effect: ParsedEffect = {
    type: 'damage',
    amount: parseInt(match[1], 10),
    parameters: {}
  };

  // Optional target
  if (match[2]) {
    effect.parameters.targetText = match[2].trim();
  }

  // Optional duration (detected by presence of "this turn")
  if (match[0].includes('this turn')) {
    effect.duration = 'turn';
  }

  return effect;
};
```

### Complex Target Patterns

Handle complex targeting with multiple conditions:

```typescript
const pattern = /banish (?:up to )?(\d+) (.+?) (?:with (\d+) or (?:more|less) (.+?))?/i;

const extractor = (match: RegExpMatchArray): ParsedEffect => {
  const effect: ParsedEffect = {
    type: 'banish',
    amount: parseInt(match[1], 10),
    parameters: {
      targetText: match[2].trim()
    }
  };

  // Optional condition
  if (match[3] && match[4]) {
    effect.parameters.condition = {
      type: 'attribute_comparison',
      attribute: match[4].trim(),
      value: parseInt(match[3], 10),
      operator: match[0].includes('or more') ? 'gte' : 'lte'
    };
  }

  return effect;
};
```

## Testing New Patterns

### Unit Tests

Create unit tests for each new pattern:

```typescript
// In __tests__/patterns.test.ts
describe('Restore Effect Patterns', () => {
  it('should parse basic restore effect', () => {
    const text = "Restore 3 health to chosen character";
    const effects = extractEffectsFromText(text);
    
    expect(effects).toHaveLength(1);
    expect(effects[0].type).toBe('restore');
    expect(effects[0].amount).toBe(3);
    expect(effects[0].parameters.resource).toBe('health');
    expect(effects[0].parameters.targetText).toBe('chosen character');
  });

  it('should handle variable amounts', () => {
    const text = "Restore X health to chosen character";
    const effects = extractEffectsFromText(text);
    
    expect(effects[0].amount).toEqual({
      type: 'variable',
      value: 'X'
    });
  });
});
```

### Integration Tests

Test with the full parser:

```typescript
describe('Restore Effect Integration', () => {
  it('should generate complete abilities', () => {
    const abilities = generateActionAbilitiesFromText("Restore 3 health to chosen character");
    
    expect(abilities).toHaveLength(1);
    expect(abilities[0].type).toBe('resolution');
    expect(abilities[0].effects).toHaveLength(1);
    expect(abilities[0].effects[0].type).toBe('restore');
  });
});
```

### Real Card Tests

Test with actual card text:

```typescript
const realCardTests = [
  {
    name: "Healing Potion",
    text: "Restore 5 health to chosen character",
    expectedEffects: 1
  },
  {
    name: "Mass Heal",
    text: "Restore 2 health to each of your characters",
    expectedEffects: 1
  }
];

for (const test of realCardTests) {
  const abilities = generateActionAbilitiesFromText(test.text);
  console.log(`${test.name}: ${abilities.length} abilities (expected ${test.expectedEffects})`);
}
```

## Pattern Optimization

### Performance Considerations

1. **Order patterns by specificity** - More specific patterns should come first
2. **Use non-capturing groups** when you don't need the match: `(?:pattern)`
3. **Avoid excessive backtracking** - Be careful with nested quantifiers
4. **Cache compiled patterns** - The performance optimization system handles this

### Regex Best Practices

```typescript
// Good: Specific and efficient
/deal (\d+) damage to chosen character/i

// Bad: Too greedy, might match too much
/deal .+ damage to .+/i

// Good: Non-capturing group for optional elements
/deal (\d+) damage(?: to (.+?))?/i

// Bad: Capturing unnecessary groups
/deal (\d+) (damage) (to) (.+)/i

// Good: Word boundaries for exact matches
/\bdraw (\d+) cards?\b/i

// Bad: Might match partial words
/draw (\d+) cards?/i
```

### Memory Efficiency

```typescript
// Good: Reuse pattern objects
const DAMAGE_PATTERN = /deal (\d+) damage to (.+)/i;

EFFECT_PATTERNS.damage = [
  {
    pattern: DAMAGE_PATTERN,
    type: 'damage',
    extractor: damageExtractor
  }
];

// Bad: Create new regex each time
EFFECT_PATTERNS.damage = [
  {
    pattern: new RegExp('deal (\\d+) damage to (.+)', 'i'),
    type: 'damage',
    extractor: damageExtractor
  }
];
```

## Common Pitfalls

### 1. Pattern Order Issues

```typescript
// Problem: General pattern matches before specific one
EFFECT_PATTERNS.draw = [
  {
    pattern: /draw (.+)/i,  // Too general - matches everything
    // ...
  },
  {
    pattern: /draw (\d+) cards from deck/i,  // Never reached
    // ...
  }
];

// Solution: Put specific patterns first
EFFECT_PATTERNS.draw = [
  {
    pattern: /draw (\d+) cards from deck/i,  // Specific first
    // ...
  },
  {
    pattern: /draw (.+)/i,  // General last
    // ...
  }
];
```

### 2. Greedy Matching

```typescript
// Problem: Greedy matching captures too much
const pattern = /deal (.+) damage to (.+)/i;
const text = "Deal 2 damage to chosen character and draw a card";
// match[1] = "2 damage to chosen character and draw a card"
// match[2] = undefined

// Solution: Use non-greedy matching
const pattern = /deal (.+?) damage to (.+)/i;
// match[1] = "2"
// match[2] = "chosen character and draw a card"
```

### 3. Missing Edge Cases

```typescript
// Problem: Doesn't handle plurals
const pattern = /draw (\d+) card/i;  // Only matches "card", not "cards"

// Solution: Handle both singular and plural
const pattern = /draw (\d+) cards?/i;  // Matches both "card" and "cards"
```

### 4. Incorrect Capturing Groups

```typescript
// Problem: Wrong group numbers
const pattern = /(?:deal|cause) (\d+) (?:damage|harm) to (.+)/i;
const extractor = (match) => ({
  amount: parseInt(match[2], 10),  // Wrong! Should be match[1]
  targetText: match[1]             // Wrong! Should be match[2]
});

// Solution: Test your capturing groups
const testText = "Deal 3 damage to chosen character";
const match = testText.match(pattern);
console.log("Groups:", match);  // Check which group contains what
```

### 5. Case Sensitivity Issues

```typescript
// Problem: Missing case variations
const pattern = /Draw (\d+) cards/;  // Only matches capitalized "Draw"

// Solution: Use case-insensitive flag
const pattern = /draw (\d+) cards/i;  // Matches any case
```

## Examples

### Example 1: Simple Effect Pattern

```typescript
// Card text: "Gain 2 lore"
EFFECT_PATTERNS.gainLore = [
  {
    pattern: /gain (\d+) lore/i,
    type: 'gainLore',
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: 'gainLore',
      amount: parseInt(match[1], 10),
      parameters: {}
    })
  }
];
```

### Example 2: Complex Effect with Conditions

```typescript
// Card text: "If you have 5 or more cards in hand, draw 2 cards"
EFFECT_PATTERNS.conditionalDraw = [
  {
    pattern: /if you have (\d+) or more cards in hand,?\s*(.+)/i,
    type: 'conditionalDraw',
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: 'conditionalDraw',
      parameters: {
        condition: {
          type: 'hand_size',
          operator: 'gte',
          value: parseInt(match[1], 10)
        },
        consequent: match[2].trim()
      }
    })
  }
];
```

### Example 3: Multi-Target Effect

```typescript
// Card text: "Deal 1 damage to each opponent"
EFFECT_PATTERNS.damageAll = [
  {
    pattern: /deal (\d+) damage to each (.+)/i,
    type: 'damage',
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: 'damage',
      amount: parseInt(match[1], 10),
      parameters: {
        targetText: `each ${match[2].trim()}`,
        isMultiTarget: true
      }
    })
  }
];
```

### Example 4: Duration-Based Effect

```typescript
// Card text: "Chosen character gets +3 {S} until end of turn"
EFFECT_PATTERNS.temporaryBuff = [
  {
    pattern: /(.+?) gets ([+-]\d+) \{([SLW])\} until end of turn/i,
    type: 'attribute',
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: 'attribute',
      amount: parseInt(match[2], 10),
      duration: 'turn',
      parameters: {
        targetText: match[1].trim(),
        attribute: match[3].toLowerCase() === 's' ? 'strength' : 
                  match[3].toLowerCase() === 'l' ? 'lore' : 'willpower'
      }
    })
  }
];
```

### Example 5: Modal Effect Pattern

```typescript
// Card text: "Choose one: Draw a card, or deal 2 damage to chosen character"
EFFECT_PATTERNS.modal = [
  {
    pattern: /choose one:\s*(.+?),\s*or\s*(.+)/i,
    type: 'modal',
    extractor: (match: RegExpMatchArray): ParsedEffect => ({
      type: 'modal',
      parameters: {
        modalType: 'choose_one',
        options: [
          match[1].trim(),
          match[2].trim()
        ]
      }
    })
  }
];
```

## Maintenance Workflow

### Adding a New Pattern

1. **Identify the need** - Find card text that isn't being parsed correctly
2. **Analyze the text** - Break down the components and structure
3. **Create the pattern** - Write regex and extractor function
4. **Add to database** - Insert into appropriate section of `EFFECT_PATTERNS`
5. **Write tests** - Create unit and integration tests
6. **Test with real cards** - Verify with actual card text
7. **Update documentation** - Add examples to this guide
8. **Performance test** - Ensure no performance regression

### Updating Existing Patterns

1. **Identify the issue** - What text isn't matching correctly?
2. **Check pattern order** - Is a more general pattern matching first?
3. **Test changes** - Ensure existing functionality still works
4. **Update tests** - Modify tests to cover new cases
5. **Regression test** - Run full test suite to ensure no breakage

### Pattern Review Checklist

Before adding a new pattern, check:

- [ ] Pattern is as specific as possible
- [ ] Pattern handles common variations (plurals, case, etc.)
- [ ] Extractor function handles all captured groups correctly
- [ ] Pattern is placed in correct order (specific before general)
- [ ] Unit tests cover the pattern
- [ ] Integration tests verify full parsing
- [ ] Performance impact is acceptable
- [ ] Documentation is updated

This guide should help you successfully add and maintain patterns in the Action Text Parser. Remember to always test thoroughly and consider the impact on existing functionality.