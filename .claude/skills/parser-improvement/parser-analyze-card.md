---
name: parser-analyze-card
description: Analyze card text to identify missing parser patterns. Breaks down text into triggers, effects, conditions, targets, and keywords to determine what patterns need to be added.
---

# Parser Analyze Card Skill

## Purpose

Analyze card ability text to identify which parser patterns are missing or need improvement. Provides detailed breakdown of text components and suggests which pattern files need updates.

## Text Analysis Process

### Step 1: Tokenize Card Text

Break card text into logical components:

```typescript
interface TextAnalysis {
  originalText: string;
  sentences: string[];
  components: {
    triggers: string[];
    effects: string[];
    conditions: string[];
    targets: string[];
    keywords: string[];
    costs: string[];
  };
  missingPatterns: MissingPattern[];
}
```

### Step 2: Identify Component Types

**Trigger Indicators:**
- "When you play this character..."
- "Whenever this character quests..."
- "At the start of your turn..."
- "When this character is banished..."

**Effect Indicators:**
- "draw a card" / "draw X cards"
- "deal X damage"
- "gain X lore"
- "banish chosen..."
- "return to hand"

**Condition Indicators:**
- "If you have..."
- "While you have..."
- "You may..."
- "Choose one -"

**Target Indicators:**
- "chosen character"
- "opposing character"
- "character of yours"
- "all characters"
- "this character"

**Keyword Indicators:**
- "Evasive", "Rush", "Challenger", "Ward", etc.
- "Support", "Bodyguard", "Reckless"

### Step 3: Cross-Reference with Existing Patterns

Check each component against existing patterns:

```typescript
// V1 Pattern files
const patternFiles = {
  triggers: "packages/lorcana-cards/src/parser/patterns/triggers.ts",
  effects: "packages/lorcana-cards/src/parser/patterns/effects.ts",
  conditions: "packages/lorcana-cards/src/parser/patterns/conditions.ts",
  keywords: "packages/lorcana-cards/src/parser/patterns/keywords.ts",
  targets: "packages/lorcana-cards/src/parser/patterns/targets.ts",
  costs: "packages/lorcana-cards/src/parser/patterns/costs.ts",
};

// V2 Atomic effects
const atomicEffects = "packages/lorcana-cards/src/parser/v2/effects/atomic/";
```

## Analysis Commands

### Test Parser Against Text

```bash
# Run parser on specific text (requires test helper)
cd packages/lorcana-cards && bun test -t "parse specific text"

# Or use REPL
cd packages/lorcana-cards && bun repl
# Then: import { parseCardText } from './src/parser'
```

### Check Existing Patterns

```bash
# Search for trigger pattern
grep -n "when you play" packages/lorcana-cards/src/parser/patterns/triggers.ts

# Search for effect pattern
grep -n "draw.*card" packages/lorcana-cards/src/parser/patterns/effects.ts
```

## Example Analysis

### Input Card

```typescript
{
  id: "010-043",
  name: "Iago",
  title: "Stompin' Mad",
  text: "When you play this character, you may have each opponent choose and discard a card."
}
```

### Analysis Output

```typescript
const analysis: TextAnalysis = {
  originalText: "When you play this character, you may have each opponent choose and discard a card.",
  sentences: [
    "When you play this character, you may have each opponent choose and discard a card."
  ],
  components: {
    triggers: ["When you play this character"],
    effects: ["have each opponent choose and discard a card"],
    conditions: ["you may"],
    targets: ["each opponent"],
    keywords: [],
    costs: []
  },
  missingPatterns: [
    {
      type: "effect",
      text: "have each opponent choose and discard",
      suggestion: "opponent-choice-discard",
      patternFile: "packages/lorcana-cards/src/parser/patterns/effects.ts",
      reason: "No pattern handles opponent-choice effects"
    }
  ]
};
```

## Pattern Matching Strategy

### Step 1: Exact Match

```typescript
// Check if exact text matches existing pattern
const exactMatch = existingPatterns.find(p => p.pattern.test(text));
```

### Step 2: Partial Match

```typescript
// Check if components match
const triggerMatch = TRIGGER_PATTERNS.find(p => p.pattern.test(text));
const effectMatch = EFFECT_PATTERNS.find(p => p.pattern.test(text));
```

### Step 3: Identify Gaps

```typescript
// What's not matching?
if (!effectMatch) {
  missingPatterns.push({
    type: "effect",
    text: extractEffectText(text),
    suggestion: generatePatternName(text),
    patternFile: "patterns/effects.ts"
  });
}
```

## Common Missing Patterns

### Opponent Choice Effects

```typescript
// Text: "have each opponent choose and discard"
// Missing: opponent-triggered-discard pattern
```

### Conditional Play Effects

```typescript
// Text: "If you have a character named X, play this for free"
// Missing: character-named-condition with free-play
```

### Multi-Target Effects

```typescript
// Text: "Deal 2 damage to each opposing character"
// Missing: deal-damage-each-opposing
```

### Modal/Choice Effects

```typescript
// Text: "Choose one - Draw 2 cards or Deal 2 damage"
// Missing: choice-effect pattern
```

## Output Protocol

### Report to Orchestrator

```typescript
interface AnalysisReport {
  cardId: string;
  success: boolean;
  analysis: TextAnalysis;
  recommendations: Recommendation[];
}

interface Recommendation {
  priority: "high" | "medium" | "low";
  type: "new-pattern" | "extend-pattern" | "v2-atomic";
  patternFile: string;
  description: string;
  suggestedPattern?: string;
}
```

### Example Report

```json
{
  "cardId": "010-043",
  "success": true,
  "analysis": {
    "originalText": "When you play this character, you may have each opponent choose and discard a card.",
    "missingPatterns": [
      {
        "type": "effect",
        "text": "have each opponent choose and discard",
        "suggestion": "opponent-choice-discard"
      }
    ]
  },
  "recommendations": [
    {
      "priority": "high",
      "type": "new-pattern",
      "patternFile": "packages/lorcana-cards/src/parser/patterns/effects.ts",
      "description": "Add pattern for opponent-choice-discard effects",
      "suggestedPattern": "/(?:have )?(?:each )?opponent(?:s)? choose (?:and )?discard/i"
    }
  ]
}
```

## Integration with Parser Improver

After analysis, pass results to pattern development:

```typescript
// Analysis complete
const analysis = await analyzeCard("010-043");

// If missing patterns found, delegate to parser-improver
if (analysis.missingPatterns.length > 0) {
  for (const missing of analysis.missingPatterns) {
    await delegateToAgent("parser-improver", {
      task: "implement-pattern",
      patternType: missing.type,
      exampleText: missing.text,
      suggestedPattern: missing.suggestion,
      targetFile: missing.patternFile
    });
  }
}
```

## Quick Reference

### Analyze Single Card

```typescript
// 1. Read card text
const card = await readCardFile("010-043");

// 2. Run parser
const parseResult = parseCardText(card.text);

// 3. Check what's missing
if (parseResult.abilities.length === 0) {
  const analysis = analyzeText(card.text);
  console.log("Missing patterns:", analysis.missingPatterns);
}
```

### Common Text Patterns

| Text Pattern | Component Type | Pattern File |
|--------------|----------------|--------------|
| "When you play this..." | trigger | triggers.ts |
| "draw X cards" | effect | effects.ts |
| "you may" | condition | conditions.ts |
| "chosen character" | target | targets.ts |
| "Evasive" | keyword | keywords.ts |
| "Exert -" | cost | costs.ts |

## Keywords

analysis, parsing, patterns, text, lorcana, cards, triggers, effects, conditions
