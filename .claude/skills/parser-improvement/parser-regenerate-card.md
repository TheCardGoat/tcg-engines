---
name: parser-regenerate-card
description: Re-parse card text after parser updates and update card files with newly generated abilities. Handles single card and batch regeneration.
---

# Parser Regenerate Card Skill

## Purpose

Re-run the parser on card text after pattern updates to regenerate abilities. Updates card files with the newly parsed abilities.

## Workflow

### Step 1: Load Card File

```typescript
// Card file path pattern
const cardPath = `packages/lorcana-cards/src/cards/${set}/${type}/${number}-${cardId}.ts`;

// Example: packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts
```

```bash
# Read card file
cat packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts
```

### Step 2: Extract Current State

```typescript
interface CardState {
  id: string;
  path: string;
  text: string;
  currentAbilities: Ability[];
  hasManualOverride: boolean;
}

// Extract text from card file
// NOTE: Real implementation should use TypeScript AST parsing
const textMatch = cardContent.match(/text:\s*["'`]([\s\S]*?)["'`]\s*,/);
const cardText = textMatch?.[1];

// Extract current abilities
// NOTE: JSON.parse won't work on TS object literals (unquoted keys, trailing commas).
// Use TypeScript compiler API to properly parse the source file:
//   import * as ts from "typescript";
//   const sourceFile = ts.createSourceFile("card.ts", cardContent, ts.ScriptTarget.Latest);
//   // Then traverse AST to find abilities property
const abilitiesMatch = cardContent.match(/abilities:\s*(\[[\s\S]*?\])\s*,/);
const currentAbilities = parseAbilitiesFromAST(cardContent); // Use AST, not JSON.parse
```

### Step 3: Re-Parse Text

```typescript
import { parseCardText } from "../parser";

// Parse using updated parser
const newAbilities = parseCardText(cardText);

// Compare with current
const hasChanges = JSON.stringify(newAbilities) !== JSON.stringify(currentAbilities);
```

### Step 4: Update Card File

```typescript
// Only update if abilities changed and no manual override
if (hasChanges && !hasManualOverride) {
  const formattedAbilities = formatAbilities(newAbilities);

  // Replace abilities in file
  const newContent = cardContent.replace(
    /abilities:\s*\[[\s\S]*?\],/m,
    `abilities: ${formattedAbilities},`
  );

  await writeFile(cardPath, newContent);
}
```

## Regeneration Modes

### Single Card

```bash
# Regenerate specific card
# 1. Read card file
# 2. Parse text
# 3. Update abilities
# 4. Write file
```

### Batch (Set)

```bash
# Find all cards in set
find packages/lorcana-cards/src/cards/010 -name "*.ts" ! -name "*.test.ts" ! -name "index.ts"

# Regenerate each
for card in $(find ...); do
  regenerate_card "$card"
done
```

### Dry Run

```typescript
// Preview changes without writing
const preview = await regenerateCard("010-043", { dryRun: true });
console.log("Would change:", preview.diff);
```

## Ability Formatting

### Format Single Ability

```typescript
function formatAbility(ability: Ability): string {
  const lines = [
    `{`,
    `  id: "${ability.id}",`,
    `  type: "${ability.type}",`,
    `  text: "${escapeString(ability.text)}",`
  ];

  // Add optional fields
  if (ability.name) {
    lines.push(`  name: "${ability.name}",`);
  }

  if (ability.trigger) {
    lines.push(`  trigger: ${JSON.stringify(ability.trigger, null, 4)},`);
  }

  if (ability.effects) {
    lines.push(`  effects: ${JSON.stringify(ability.effects, null, 4)},`);
  }

  if (ability.conditions) {
    lines.push(`  conditions: ${JSON.stringify(ability.conditions, null, 4)},`);
  }

  if (ability.optional) {
    lines.push(`  optional: true,`);
  }

  lines.push(`}`);
  return lines.join("\n");
}

function formatAbilities(abilities: Ability[]): string {
  if (abilities.length === 0) return "[]";

  const formatted = abilities.map(formatAbility).join(",\n");
  return `[\n${formatted}\n]`;
}
```

### Escape Strings

```typescript
function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}
```

## Handling Manual Overrides

Some cards have complex abilities that require manual implementation:

```typescript
// Check for manual override flag
const hasManualOverride = /manualOverride:\s*true/.test(cardContent);

if (hasManualOverride) {
  console.log(`Skipping ${cardId}: has manual override`);
  return { status: "skipped", reason: "manual-override" };
}
```

### Preserving Manual Abilities

```typescript
// If card has both parsed and manual abilities
const parsedAbilities = parseCardText(text);
const manualAbilities = currentAbilities.filter(a => a.isManual);

const finalAbilities = [
  ...parsedAbilities,
  ...manualAbilities
];
```

## Verification Steps

### Step 1: Validate Parse Result

```typescript
// Ensure abilities are valid
for (const ability of newAbilities) {
  if (!ability.type || !ability.text) {
    throw new Error(`Invalid ability: ${JSON.stringify(ability)}`);
  }
}
```

### Step 2: Type Check

```bash
cd packages/lorcana-cards && bun run check-types
```

### Step 3: Run Card Tests

```bash
cd packages/lorcana-cards && bun test "Card Name"
```

## Commands

### Regenerate Single Card

```bash
# 1. Identify card path
CARD_PATH="packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts"

# 2. Read current state
cat "$CARD_PATH"

# 3. Parse and update (manual process with editor)

# 4. Verify
cd packages/lorcana-cards && bun run check-types
cd packages/lorcana-cards && bun test "Iago"
```

### Regenerate All in Set

```bash
# Find cards with empty abilities
grep -l "abilities: \[\]" packages/lorcana-cards/src/cards/010/**/*.ts

# Process each (manual or scripted)
```

## Output Protocol

### Success

```typescript
{
  success: true,
  cardId: "010-043",
  path: "packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts",
  status: "updated",
  changes: {
    before: { abilities: [] },
    after: {
      abilities: [
        {
          type: "triggered",
          trigger: "play-this-character",
          effects: [{ type: "opponent-choice-discard" }]
        }
      ]
    }
  }
}
```

### Skipped

```typescript
{
  success: true,
  cardId: "010-043",
  status: "skipped",
  reason: "manual-override"
}
```

### Error

```typescript
{
  success: false,
  cardId: "010-043",
  status: "error",
  error: "Parse failed: unknown pattern 'choose one -'"
}
```

## Batch Results

```typescript
interface BatchResult {
  set: string;
  processed: number;
  results: {
    updated: string[];
    unchanged: string[];
    skipped: string[];
    errors: { cardId: string; error: string }[];
  };
}
```

## Quick Reference

### Card File Structure

```typescript
export const iagoStompinMad: CharacterCard = {
  id: "010-043",
  cardType: "character",
  name: "Iago",
  version: "Stompin' Mad",
  // ... other properties
  text: "When you play this character, you may have each opponent choose and discard a card.",
  abilities: [
    // ← This is what we regenerate
  ],
};
```

### Common Paths

```
packages/lorcana-cards/src/cards/{SET}/{TYPE}/{NUMBER}-{card-id}.ts
packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts
packages/lorcana-cards/src/cards/010/actions/001-action-name.ts
packages/lorcana-cards/src/cards/010/items/001-item-name.ts
```

## Keywords

regenerate, cards, abilities, parsing, update, lorcana
