---
name: parser-compare-abilities
description: Compare abilities before and after parser updates. Identifies added, removed, modified, and unchanged abilities to verify regeneration correctness.
---

# Parser Compare Abilities Skill

## Purpose

Compare card abilities before and after parser regeneration to verify changes are correct and identify any regressions. Suggesting improvements to the parser or the type definitions if needed.

## Comparison Structure

### Diff Result

```typescript
interface AbilityDiff {
  cardId: string;
  before: Ability[];
  after: Ability[];
  changes: {
    added: Ability[];
    removed: Ability[];
    modified: { before: Ability; after: Ability }[];
    unchanged: Ability[];
  };
  summary: {
    totalBefore: number;
    totalAfter: number;
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    unchangedCount: number;
  };
}
```

## Comparison Algorithm

### Step 1: Extract Abilities

```typescript
import * as ts from "typescript";

// NOTE: JSON.parse won't work on TypeScript object literals (unquoted keys,
// trailing commas, comments). Use TypeScript compiler API for reliable parsing.
function extractAbilities(cardContent: string): Ability[] {
  // Create a source file from the card content
  const sourceFile = ts.createSourceFile(
    "card.ts",
    cardContent,
    ts.ScriptTarget.Latest,
    true
  );

  // Traverse AST to find abilities property
  let abilities: Ability[] = [];

  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node) &&
        node.name.getText() === "abilities" &&
        ts.isArrayLiteralExpression(node.initializer)) {
      // Parse ability objects from AST
      abilities = parseAbilitiesFromASTNode(node.initializer);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return abilities;
}

// Helper to parse ability objects from AST (implementation depends on needs)
function parseAbilitiesFromASTNode(node: ts.ArrayLiteralExpression): Ability[] {
  // Convert AST nodes to Ability objects
  // This is a simplified placeholder - real implementation needs full AST traversal
  return [];
}
```

### Step 2: Compare by Identity

```typescript
function compareAbilities(before: Ability[], after: Ability[]): AbilityDiff["changes"] {
  const changes = {
    added: [] as Ability[],
    removed: [] as Ability[],
    modified: [] as { before: Ability; after: Ability }[],
    unchanged: [] as Ability[]
  };

  // Create maps for efficient lookup
  const beforeMap = new Map(before.map(a => [getAbilityKey(a), a]));
  const afterMap = new Map(after.map(a => [getAbilityKey(a), a]));

  // Find added abilities
  for (const [key, ability] of afterMap) {
    if (!beforeMap.has(key)) {
      changes.added.push(ability);
    }
  }

  // Find removed abilities
  for (const [key, ability] of beforeMap) {
    if (!afterMap.has(key)) {
      changes.removed.push(ability);
    }
  }

  // Find modified and unchanged
  for (const [key, beforeAbility] of beforeMap) {
    const afterAbility = afterMap.get(key);
    if (afterAbility) {
      if (deepEqual(beforeAbility, afterAbility)) {
        changes.unchanged.push(beforeAbility);
      } else {
        changes.modified.push({ before: beforeAbility, after: afterAbility });
      }
    }
  }

  return changes;
}

function getAbilityKey(ability: Ability): string {
  // Use name or text as identifier
  return ability.name || ability.text || ability.id;
}
```

### Step 3: Deep Comparison for Modified

```typescript
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function findDifferences(before: Ability, after: Ability): string[] {
  const differences: string[] = [];

  // Compare each field
  if (before.type !== after.type) {
    differences.push(`type: ${before.type} -> ${after.type}`);
  }

  if (before.text !== after.text) {
    differences.push(`text: "${before.text}" -> "${after.text}"`);
  }

  if (!deepEqual(before.trigger, after.trigger)) {
    differences.push(`trigger: changed`);
  }

  if (!deepEqual(before.effects, after.effects)) {
    differences.push(`effects: changed`);
  }

  if (!deepEqual(before.conditions, after.conditions)) {
    differences.push(`conditions: changed`);
  }

  return differences;
}
```

## Comparison Modes

### Quick Comparison

Check if abilities changed at all:

```typescript
function hasChanges(before: Ability[], after: Ability[]): boolean {
  return JSON.stringify(before) !== JSON.stringify(after);
}
```

### Detailed Comparison

Full diff with categorized changes:

```typescript
const diff = compareAbilities(before, after);
console.log(`Added: ${diff.added.length}`);
console.log(`Removed: ${diff.removed.length}`);
console.log(`Modified: ${diff.modified.length}`);
console.log(`Unchanged: ${diff.unchanged.length}`);
```

### Structural Comparison

Compare ability structure without exact values:

```typescript
function getStructure(ability: Ability): string {
  return JSON.stringify({
    type: ability.type,
    hasTrigger: !!ability.trigger,
    hasEffects: !!ability.effects,
    hasConditions: !!ability.conditions,
    effectTypes: ability.effects?.map(e => e.type) || []
  });
}
```

## Output Formats

### Console Report

```
=== Ability Comparison: 010-043 (Iago - Stompin' Mad) ===

BEFORE: 0 abilities
AFTER:  1 abilities

ADDED (1):
  + [triggered] "When you play this character..."
    - trigger: play-this-character
    - effects: [opponent-choice-discard]
    - optional: true

REMOVED (0):
  (none)

MODIFIED (0):
  (none)

SUMMARY: +1 added, -0 removed, ~0 modified
```

### JSON Report

```json
{
  "cardId": "010-043",
  "cardName": "Iago - Stompin' Mad",
  "comparison": {
    "before": { "count": 0, "abilities": [] },
    "after": {
      "count": 1,
      "abilities": [
        {
          "type": "triggered",
          "trigger": "play-this-character",
          "effects": [{ "type": "opponent-choice-discard" }],
          "optional": true
        }
      ]
    },
    "changes": {
      "added": 1,
      "removed": 0,
      "modified": 0,
      "unchanged": 0
    }
  },
  "status": "improved"
}
```

### Diff Format

```diff
--- before/010-043-iago-stompin-mad.ts
+++ after/010-043-iago-stompin-mad.ts
@@ abilities @@
- abilities: [],
+ abilities: [
+   {
+     type: "triggered",
+     trigger: { type: "play-this-character" },
+     effects: [{ type: "opponent-choice-discard" }],
+     optional: true
+   }
+ ],
```

## Validation Rules

### Expected Improvements

```typescript
function validateChanges(diff: AbilityDiff): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Regression: abilities removed without additions
  if (diff.changes.removed.length > 0 && diff.changes.added.length === 0) {
    issues.push("Regression: abilities removed without replacement");
  }

  // Warning: abilities modified significantly
  for (const mod of diff.changes.modified) {
    if (mod.before.type !== mod.after.type) {
      warnings.push(`Type changed: ${mod.before.type} -> ${mod.after.type}`);
    }
  }

  // Good: empty abilities now populated
  if (diff.summary.totalBefore === 0 && diff.summary.totalAfter > 0) {
    // This is the expected improvement
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
}
```

### Regression Detection

```typescript
function detectRegressions(before: Ability[], after: Ability[]): Regression[] {
  const regressions: Regression[] = [];

  // Check for lost trigger types
  const beforeTriggers = new Set(before.map(a => a.trigger?.type).filter(Boolean));
  const afterTriggers = new Set(after.map(a => a.trigger?.type).filter(Boolean));

  for (const trigger of beforeTriggers) {
    if (!afterTriggers.has(trigger)) {
      regressions.push({
        type: "lost-trigger",
        detail: `Trigger type '${trigger}' no longer present`
      });
    }
  }

  // Check for lost effect types
  const beforeEffects = new Set(before.flatMap(a => a.effects?.map(e => e.type) || []));
  const afterEffects = new Set(after.flatMap(a => a.effects?.map(e => e.type) || []));

  for (const effect of beforeEffects) {
    if (!afterEffects.has(effect)) {
      regressions.push({
        type: "lost-effect",
        detail: `Effect type '${effect}' no longer present`
      });
    }
  }

  return regressions;
}
```

## Integration

### With parser-regenerate-card

```typescript
// Before regeneration
const beforeAbilities = extractAbilities(cardContent);

// Regenerate
const afterAbilities = parseCardText(cardText);

// Compare
const diff = compareAbilities(beforeAbilities, afterAbilities);

// Validate
const validation = validateChanges(diff);
if (!validation.valid) {
  console.error("Regeneration would cause regression:", validation.issues);
  return { status: "aborted", reason: "regression-detected" };
}
```

### With parser-verify

```typescript
// Pass comparison results to verification
return {
  phase: "comparison",
  cardId,
  diff,
  validation,
  nextStep: validation.valid ? "verify" : "review"
};
```

## Quick Reference

### Comparison Commands

```bash
# Compare card before/after (manual process)
# 1. Save current abilities
# 2. Regenerate
# 3. Compare with saved version

# Using git diff
git diff packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts
```

### Status Categories

| Status | Meaning |
|--------|---------|
| `improved` | Empty -> Populated abilities |
| `updated` | Abilities modified |
| `unchanged` | No changes |
| `regression` | Lost abilities |
| `error` | Comparison failed |

## Keywords

comparison, diff, abilities, validation, regression, lorcana, parser
