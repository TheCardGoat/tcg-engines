---
name: parser-pattern-analysis
description: Design regex patterns for Lorcana card text parsing. Analyzes text structure, designs optimal regex patterns, and defines capture groups for extracting effect parameters.
---

# Parser Pattern Analysis Skill

## Purpose

Design optimal regex patterns for parsing Lorcana card text. This skill covers pattern structure, capture group design, and pattern ordering strategies. Update the type definitions in `packages/lorcana-types` if needed.

## Pattern Design Workflow

### Step 1: Analyze Text Structure

Break down the target text into components:

```typescript
// Example text: "When you play this character, draw 2 cards."
const analysis = {
  text: "When you play this character, draw 2 cards.",
  components: {
    trigger: "When you play this character",
    separator: ",",
    effect: "draw 2 cards",
    punctuation: "."
  },
  variableElements: {
    number: "2",
    cardType: "cards" // vs "card"
  }
};
```

### Step 2: Design Regex Pattern

```typescript
// Start specific, make general
const patterns = {
  // Most specific
  specific: /when you play this character, draw (\d+) cards?/i,

  // With optional elements
  withOptions: /when you play this (?:character|card),?\s*draw (\d+) cards?/i,

  // Most general
  general: /when you play this (?:\w+),?\s*draw (\d+) cards?/i
};
```

### Step 3: Define Capture Groups

```typescript
interface PatternCapture {
  index: number;
  name: string;
  type: "number" | "string" | "boolean";
  description: string;
}

const captures: PatternCapture[] = [
  { index: 1, name: "amount", type: "number", description: "Number of cards to draw" }
];
```

## Regex Best Practices

### DO: Use Non-Greedy Quantifiers

```typescript
// Good: Non-greedy matching
/deal (\d+) damage to (.+?)\./i

// Bad: Greedy can over-match
/deal (\d+) damage to (.+)\./i
```

### DO: Use Non-Capturing Groups

```typescript
// Good: Non-capturing for optionals
/(?:you (?:can|may) )?draw/i

// Bad: Captures unnecessary groups
/(you) (can) (draw)/i
```

### DO: Handle Case Insensitivity

```typescript
// Always use /i flag for Lorcana text
/when you play/i
```

### DO: Handle Optional Punctuation

```typescript
// Handle comma presence/absence
/in play,?\s*/i

// Handle period at end
/draw a card\.?/i
```

### DO: Use Word Boundaries

```typescript
// Good: Word boundary prevents partial matches
/\b(one|two|three)\b/i

// Bad: Could match "someone"
/(one|two|three)/i
```

### DON'T: Over-Escape

```typescript
// Good: Only escape special chars
/draw \d+ cards/i

// Bad: Over-escaping
/draw\ \d\+\ cards/i
```

## Pattern Categories

### Trigger Patterns

```typescript
// Play triggers
/when(?:ever)? you play (?:this )?(?:character|card|item|action)/i

// Quest triggers
/when(?:ever)? (?:this )?(?:character )?quests/i

// Banish triggers
/when(?:ever)? (?:this )?(?:character )?is banished/i

// Turn triggers
/at the (?:start|beginning|end) of (?:your|each) turn/i
```

### Effect Patterns

```typescript
// Draw effects
/draw (\d+|a) cards?/i

// Damage effects
/deal (\d+) damage to (.+)/i

// Lore effects
/gain (\d+) lore/i

// Banish effects
/banish (?:chosen |a )?(.+)/i

// Return effects
/return (?:target |chosen )?(.+?) to (?:its owner's )?hand/i
```

### Condition Patterns

```typescript
// If conditions
/if you have (.+?) in play/i

// While conditions
/while (?:you have )?(.+)/i

// May conditions (optional)
/you may/i

// Choice conditions
/choose (?:one|up to \d+) ?[-–]/i
```

### Target Patterns

```typescript
// Chosen targets
/chosen (?:opposing )?(?:character|item|card)/i

// All targets
/(?:each|all) (?:opposing )?(?:characters?|items?)/i

// Self reference
/this (?:character|card)/i
```

## Number Extraction

```typescript
// Numeric patterns
const NUMBER_WORDS: Record<string, number> = {
  "a": 1, "an": 1, "one": 1,
  "two": 2, "three": 3, "four": 4, "five": 5,
  "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10
};

function extractNumber(text: string): number {
  // Try numeric
  const numMatch = text.match(/(\d+)/);
  if (numMatch) return parseInt(numMatch[1], 10);

  // Try word
  for (const [word, value] of Object.entries(NUMBER_WORDS)) {
    if (text.toLowerCase().includes(word)) return value;
  }

  return 1; // Default
}
```

## Pattern Ordering Strategy

Patterns are matched in order, so ordering matters:

```typescript
// Order: Most specific -> Most general
const EFFECT_PATTERNS = [
  // 1. Very specific patterns first
  /deal (\d+) damage to each opposing character/i,

  // 2. Moderately specific
  /deal (\d+) damage to chosen opposing character/i,

  // 3. General pattern last
  /deal (\d+) damage to (.+)/i,
];
```

### Why Order Matters

```typescript
// Text: "deal 2 damage to each opposing character"

// If general pattern is first:
/deal (\d+) damage to (.+)/i
// Matches: captures "each opposing character" as target
// Not ideal: loses "each opposing" semantics

// If specific pattern is first:
/deal (\d+) damage to each opposing character/i
// Matches: correctly identified as area damage
```

## Pattern Testing

### Unit Test Structure

```typescript
describe("draw pattern", () => {
  const pattern = /draw (\d+|a) cards?/i;

  it("matches 'draw 2 cards'", () => {
    const match = "draw 2 cards".match(pattern);
    expect(match).not.toBeNull();
    expect(match![1]).toBe("2");
  });

  it("matches 'draw a card'", () => {
    const match = "draw a card".match(pattern);
    expect(match).not.toBeNull();
    expect(match![1]).toBe("a");
  });

  it("is case insensitive", () => {
    expect("DRAW 3 CARDS".match(pattern)).not.toBeNull();
  });
});
```

### Edge Cases to Test

```typescript
// Plural vs singular
"draw 1 card" vs "draw 2 cards"

// Word numbers vs digits
"draw two cards" vs "draw 2 cards"

// Optional elements
"you may draw a card" vs "draw a card"

// Case variations
"Draw a card" vs "draw a card"

// Punctuation
"draw a card." vs "draw a card"
```

## Output: Pattern Specification

```typescript
interface PatternSpec {
  name: string;
  category: "trigger" | "effect" | "condition" | "target" | "keyword" | "cost";
  pattern: RegExp;
  captures: PatternCapture[];
  priority: number; // Lower = matched earlier
  examples: string[];
  counterExamples: string[];
}

// Example
const drawPattern: PatternSpec = {
  name: "draw-cards",
  category: "effect",
  pattern: /draw (\d+|a) cards?/i,
  captures: [
    { index: 1, name: "amount", type: "number", description: "Number of cards" }
  ],
  priority: 10,
  examples: [
    "draw 2 cards",
    "draw a card",
    "Draw 3 cards."
  ],
  counterExamples: [
    "withdraw cards",
    "drawing cards"
  ]
};
```

## Integration with Pattern Create

After designing pattern, pass to `parser-pattern-create`:

```typescript
await delegateToSkill("parser-pattern-create", {
  patternSpec: drawPattern,
  targetFile: "packages/lorcana-cards/src/parser/patterns/effects.ts",
  position: "after:damage-patterns" // Ordering hint
});
```

## Quick Reference

### Pattern Template

```typescript
{
  name: "pattern-name",
  pattern: /regex here/i,
  type: "effect-type",
  extractor: (match) => ({
    type: "effect-type",
    parameters: {
      param1: match[1],
      param2: parseInt(match[2], 10)
    }
  })
}
```

### Common Regex Components

| Component | Pattern | Example |
|-----------|---------|---------|
| Number | `(\d+)` | "2" |
| Word number | `(one\|two\|three)` | "two" |
| Optional | `(?:text)?` | may or may not match |
| Alternatives | `(a\|b\|c)` | matches a, b, or c |
| Word boundary | `\b` | word start/end |
| Any word | `\w+` | "character" |
| Non-greedy | `.+?` | shortest match |

## Keywords

regex, patterns, design, analysis, text-parsing, lorcana, capture-groups
