---
name: parser-find-unimplemented
description: Find Lorcana cards with empty or placeholder abilities that need parser support. Prioritizes latest sets and groups cards by missing pattern type.
---

# Parser Find Unimplemented Skill

## Purpose

Scan card files to find cards with empty or placeholder abilities, indicating they need parser support. Prioritizes latest sets (011 > 010 > 009) for relevance.

## Detection Methods

### 1. Empty Abilities Array

```typescript
// Cards with no parsed abilities
abilities: [],
```

```bash
# Find cards with empty abilities
grep -r "abilities: \[\]" packages/lorcana-cards/src/cards/010/
```

### 2. Placeholder Abilities

```typescript
// Cards with placeholder/stub abilities
abilities: [
  {
    type: "placeholder",
    text: "...",
  }
],
```

### 3. Manual Override Flag

```typescript
// Cards marked as needing manual implementation
manualOverride: true,
// OR
notImplemented: true,
```

### 4. Cards with Text but No Abilities

```typescript
// Has ability text but no abilities array
text: "When you play this character, draw a card.",
abilities: [], // Should have been parsed
```

## Workflow

### Step 1: Scan Target Set

```bash
# Scan specific set
TARGET_SET="010"
find packages/lorcana-cards/src/cards/${TARGET_SET} -name "*.ts" ! -name "*.test.ts" ! -name "index.ts"
```

### Step 2: Check Each Card File

For each card file, check:

```typescript
// Read card file
const cardContent = await readFile(cardPath);

// Check for empty abilities
const hasEmptyAbilities = /abilities:\s*\[\s*\]/.test(cardContent);

// Check for card text
const textMatch = cardContent.match(/text:\s*["'`]([^"'`]+)["'`]/);
const hasText = textMatch && textMatch[1].trim().length > 0;

// Card needs implementation if:
// - Has text but empty abilities
// - Has placeholder abilities
// - Has manual override flag
```

### Step 3: Categorize Results

Group cards by detection type:

```typescript
interface UnimplementedCard {
  id: string;
  path: string;
  text: string;
  reason: "empty-abilities" | "placeholder" | "manual-override" | "parse-failed";
  set: string;
  cardNumber: number;
}

interface ScanResult {
  set: string;
  totalCards: number;
  unimplemented: UnimplementedCard[];
  byReason: Record<string, UnimplementedCard[]>;
}
```

## Commands

### Find All Unimplemented in Set

```bash
# Find cards with empty abilities in Set 010
grep -rn "abilities: \[\]" packages/lorcana-cards/src/cards/010/ --include="*.ts" \
  | grep -v ".test.ts" | grep -v "index.ts"

# Count unimplemented cards
grep -r "abilities: \[\]" packages/lorcana-cards/src/cards/010/ --include="*.ts" \
  | grep -v ".test.ts" | wc -l
```

### Find Cards with Text but No Abilities

```bash
# Find cards that have text field
grep -rn "text:" packages/lorcana-cards/src/cards/010/ --include="*.ts" \
  | grep -v ".test.ts" | grep -v "index.ts"

# Cross-reference with empty abilities
# (requires manual review)
```

### Find Manual Overrides

```bash
# Find cards flagged for manual implementation
grep -rn "manualOverride\|notImplemented" packages/lorcana-cards/src/cards/ \
  --include="*.ts" | grep -v ".test.ts"
```

## Prioritization

### By Set (Latest First)

```typescript
const SET_PRIORITY = ["011", "010", "009", "008", "007", "006", "005", "004", "003", "002", "001"];

function sortBySet(cards: UnimplementedCard[]): UnimplementedCard[] {
  return cards.sort((a, b) => {
    const aIndex = SET_PRIORITY.indexOf(a.set);
    const bIndex = SET_PRIORITY.indexOf(b.set);
    return aIndex - bIndex;
  });
}
```

### By Card Type

```typescript
// Character abilities often more complex
const TYPE_PRIORITY = ["character", "action", "item", "location"];
```

## Output Format

### Summary Report

```markdown
# Unimplemented Cards Report

**Set:** 010
**Scanned:** 200 cards
**Unimplemented:** 15 cards (7.5%)

## By Reason
- Empty abilities: 10
- Manual override: 3
- Parse failed: 2

## Cards Needing Implementation

| Card ID | Name | Text | Reason |
|---------|------|------|--------|
| 010-043 | Iago | When you play this character... | empty-abilities |
| 010-088 | Mulan | Choose one - ... | parse-failed |
```

### JSON Output

```json
{
  "set": "010",
  "timestamp": "2024-01-15T10:00:00Z",
  "summary": {
    "totalCards": 200,
    "unimplemented": 15,
    "percentage": 7.5
  },
  "cards": [
    {
      "id": "010-043",
      "path": "packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts",
      "text": "When you play this character, you may have each opponent choose and discard a card.",
      "reason": "empty-abilities"
    }
  ]
}
```

## Integration

### With parser-analyze-card

After finding unimplemented cards, pass each to `parser-analyze-card`:

```typescript
const unimplemented = await findUnimplementedCards("010");

for (const card of unimplemented.cards) {
  const analysis = await analyzeCard(card.id, card.text);
  // Returns missing patterns, suggested parser updates
}
```

### With parser-orchestrator

Report results to orchestrator for workflow coordination:

```typescript
return {
  phase: "discovery",
  result: {
    set: "010",
    cardsFound: unimplemented.cards.length,
    cards: unimplemented.cards,
    nextStep: "analyze-cards"
  }
};
```

## Quick Reference

```bash
# Quick scan for a set
grep -c "abilities: \[\]" packages/lorcana-cards/src/cards/010/**/*.ts 2>/dev/null | grep -v ":0$"

# Full report
grep -rn "abilities: \[\]" packages/lorcana-cards/src/cards/ --include="*.ts" \
  | grep -v ".test.ts" | grep -v "index.ts" \
  | sort -t'/' -k6,6 -k7,7
```

## Keywords

discovery, unimplemented, parser, cards, scan, empty-abilities, lorcana
