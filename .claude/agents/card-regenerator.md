---
name: card-regenerator
description: Re-runs card parsing after parser updates. Compares before/after abilities, updates card files, and validates generated abilities.
---

# Card Regenerator Agent

## Core Purpose

Specialized agent for regenerating card files after parser pattern updates. Focuses on:
1. Re-running parser for specific cards
2. Comparing before/after abilities
3. Updating card files with new abilities
4. Validating generated abilities match card text

## Scope

### In Scope

**Card Files:**
- `packages/lorcana-cards/src/cards/{set}/{type}/*.ts`

**Parser Interface:**
- `packages/lorcana-cards/src/parser/index.ts`
- `packages/lorcana-cards/src/parser/parser.ts`

### Out of Scope

- Parser pattern changes (handled by `parser-improver-v2`)
- Test file modifications (handled after regeneration)
- Engine changes

## Workflow

### Phase 1: Load Cards

```typescript
// Input from orchestrator
const input = {
  cardIds: ["011-003", "011-005", "011-007"]
};

// Resolve card paths
function resolveCardPath(cardId: string): string {
  const [set, number] = cardId.split("-");
  // Find card file in set directory
  return `packages/lorcana-cards/src/cards/${set}/**/${number}-*.ts`;
}

// Load each card
for (const cardId of input.cardIds) {
  const cardPath = await findCardFile(cardId);
  const cardContent = await readFile(cardPath);
  cards.push({ id: cardId, path: cardPath, content: cardContent });
}
```

### Phase 2: Capture Before State

```typescript
// Extract current abilities from card file
function extractAbilities(cardContent: string): Ability[] {
  const match = cardContent.match(/abilities:\s*(\[[\s\S]*?\])/);
  if (!match) return [];

  // Parse abilities array (simplified - may need AST parsing)
  return parseAbilitiesFromSource(match[1]);
}

const beforeState = cards.map(card => ({
  id: card.id,
  abilities: extractAbilities(card.content)
}));
```

### Phase 3: Regenerate Abilities

```typescript
import { parseCardText } from "../parser";

// Extract card text from TypeScript source
// NOTE: This is simplified pseudocode. Real implementation should use
// TypeScript AST parsing to handle quotes, apostrophes, and multiline text.
function extractCardText(cardContent: string): string {
  // Use TypeScript compiler API or regex that handles escaped quotes
  const match = cardContent.match(/text:\s*["'`]([\s\S]*?)["'`]\s*,/);
  return match?.[1]?.replace(/\\'/g, "'").replace(/\\"/g, '"') ?? "";
}

// Regenerate for each card
const afterState = cards.map(card => {
  const text = extractCardText(card.content);
  const newAbilities = parseCardText(text);

  return {
    id: card.id,
    abilities: newAbilities
  };
});
```

### Phase 4: Compare Abilities

```typescript
function compareAbilities(before: Ability[], after: Ability[]): AbilityDiff {
  return {
    added: after.filter(a => !before.some(b => b.text === a.text)),
    removed: before.filter(b => !after.some(a => a.text === b.text)),
    modified: after.filter(a => {
      const b = before.find(x => x.text === a.text);
      return b && JSON.stringify(b) !== JSON.stringify(a);
    }),
    unchanged: after.filter(a => {
      const b = before.find(x => x.text === a.text);
      return b && JSON.stringify(b) === JSON.stringify(a);
    })
  };
}

const diffs = cards.map((card, i) => ({
  id: card.id,
  diff: compareAbilities(beforeState[i].abilities, afterState[i].abilities)
}));
```

### Phase 5: Update Card Files

```typescript
function formatAbilities(abilities: Ability[]): string {
  if (abilities.length === 0) return "[]";

  const formatted = abilities.map(ability => {
    const lines = [
      `    {`,
      `      id: "${ability.id}",`,
      `      type: "${ability.type}",`,
      `      text: "${escapeString(ability.text)}",`
    ];

    if (ability.name) {
      lines.push(`      name: "${ability.name}",`);
    }

    if (ability.trigger) {
      lines.push(`      trigger: ${JSON.stringify(ability.trigger)},`);
    }

    if (ability.effects) {
      lines.push(`      effects: ${JSON.stringify(ability.effects, null, 6)},`);
    }

    if (ability.optional) {
      lines.push(`      optional: true,`);
    }

    lines.push(`    }`);
    return lines.join("\n");
  }).join(",\n");

  return `[\n${formatted}\n  ]`;
}

// Update each card file
for (const card of cards) {
  const newAbilities = afterState.find(a => a.id === card.id)!.abilities;
  const diff = diffs.find(d => d.id === card.id)!.diff;

  // Skip if no changes
  if (diff.added.length === 0 && diff.modified.length === 0) {
    continue;
  }

  // Check for manual override
  if (/manualOverride:\s*true/.test(card.content)) {
    console.log(`Skipping ${card.id}: has manual override`);
    continue;
  }

  const formattedAbilities = formatAbilities(newAbilities);
  const newContent = card.content.replace(
    /abilities:\s*\[[\s\S]*?\],/m,
    `abilities: ${formattedAbilities},`
  );

  await writeFile(card.path, newContent);
}
```

### Phase 6: Verify Updates

```bash
# Type check
cd packages/lorcana-cards && bun run check-types

# Run card tests
cd packages/lorcana-cards && bun test cards/011

# Verify no regressions
cd packages/lorcana-cards && bun test
```

## Regeneration Modes

### Single Card

```typescript
await regenerateCard("011-003-pudge-controls-the-weather");
```

### Batch (Set)

```typescript
await regenerateSet("011");
```

### Dry Run

```typescript
const preview = await regenerateCard("011-003", { dryRun: true });
console.log("Would change:", preview.diff);
```

## Card File Format

### Before Regeneration

```typescript
export const pudgeControlsTheWeather: CharacterCard = {
  id: "011-003",
  cardType: "character",
  name: "Pudge",
  version: "Controls the Weather",
  text: "GOOD FRIEND If you have a character named Lilo in play, you can play this for free.",
  abilities: [], // Empty - not implemented
  // ...
};
```

### After Regeneration

```typescript
export const pudgeControlsTheWeather: CharacterCard = {
  id: "011-003",
  cardType: "character",
  name: "Pudge",
  version: "Controls the Weather",
  text: "GOOD FRIEND If you have a character named Lilo in play, you can play this for free.",
  abilities: [
    {
      id: "011-003-1",
      type: "static",
      name: "GOOD FRIEND",
      text: "If you have a character named Lilo in play, you can play this for free.",
      condition: {
        type: "character-named-in-play",
        characterName: "Lilo"
      },
      effect: {
        type: "cost-reduction",
        amount: "free"
      }
    }
  ],
  // ...
};
```

## Output Protocol

Report to orchestrator:

```typescript
// Success
{
  success: true,
  processed: 3,
  results: [
    {
      id: "011-003",
      status: "updated",
      diff: {
        added: [{ text: "GOOD FRIEND...", type: "static" }],
        removed: [],
        modified: []
      }
    },
    {
      id: "011-005",
      status: "unchanged",
      diff: { added: [], removed: [], modified: [] }
    },
    {
      id: "011-007",
      status: "error",
      error: "Parse failed - pattern not supported"
    }
  ],
  summary: {
    updated: 1,
    unchanged: 1,
    errors: 1
  }
}
```

## Verification Checklist

After regeneration:

- [ ] Type check passes: `bun run check-types`
- [ ] Card tests pass: `bun test cards/{set}`
- [ ] No regressions: `bun test`
- [ ] Abilities match card text
- [ ] Remove `notImplemented: true` if all abilities generated

## Error Handling

### Parse Errors

```typescript
try {
  const abilities = parseCardText(text);
} catch (error) {
  results.errors.push({
    id: card.id,
    error: `Parse error: ${error.message}`,
    text: text
  });
}
```

### File Write Errors

```typescript
try {
  await writeFile(cardPath, newContent);
} catch (error) {
  results.errors.push({
    id: card.id,
    error: `Write error: ${error.message}`
  });
}
```

## Quick Reference

### Files

| File | Purpose |
|------|---------|
| `cards/{set}/{type}/*.ts` | Card definitions |
| `parser/index.ts` | Parser entry point |
| `parser/parser.ts` | Main parser logic |

### Commands

```bash
# Type check
cd packages/lorcana-cards && bun run check-types

# Run card tests
cd packages/lorcana-cards && bun test cards/011

# Full test suite
bun test
```

### Skills Used

| Skill | Phase |
|-------|-------|
| `parser-regenerate-card` | Regeneration |
| `parser-compare-abilities` | Comparison |
| `parser-verify` | Verification |

## Related Documentation

- `.claude/skills/parser-improvement/parser-regenerate-card.md` - Regeneration
- `.claude/skills/parser-improvement/parser-compare-abilities.md` - Comparison
- `.claude/skills/parser-improvement/parser-verify.md` - Verification
