---
name: parser-verify
description: Final validation of parser improvements. Runs type checks, tests, and verifies generated abilities match card text semantics.
---

# Parser Verify Skill

## Purpose

Perform comprehensive verification after parser improvements to ensure:
1. Type safety is maintained
2. All tests pass
3. Generated abilities correctly represent card text
4. No regressions introduced

## Verification Checklist

### 1. Type Check

```bash
# Check parser package
cd packages/lorcana-cards && bun run check-types

# Check dependent packages
cd packages/lorcana-engine && bun run check-types

# Check all packages
bun run check-types
```

### 2. Parser Tests

```bash
# Run all parser tests
cd packages/lorcana-cards && bun test parser

# Run specific pattern tests
cd packages/lorcana-cards && bun test patterns

# Run V2 parser tests
cd packages/lorcana-cards && bun test v2
```

### 3. Card Tests

```bash
# Run tests for affected cards
cd packages/lorcana-cards && bun test "Card Name"

# Run tests for entire set
cd packages/lorcana-cards && bun test cards/010
```

### 4. Integration Tests

```bash
# Run parser integration tests
cd packages/lorcana-cards && bun test parser-integration

# Run full test suite
bun test
```

### 5. CI Check

```bash
# Full CI pipeline
bun run ci-check
```

## Semantic Verification

### Ability Text Matching

Verify generated abilities correctly represent card text:

```typescript
interface SemanticCheck {
  cardText: string;
  generatedAbility: Ability;
  checks: {
    triggerMatches: boolean;
    effectMatches: boolean;
    conditionsMatch: boolean;
    targetsMatch: boolean;
    optionalityMatches: boolean;
  };
}

function verifySemantics(text: string, ability: Ability): SemanticCheck {
  return {
    cardText: text,
    generatedAbility: ability,
    checks: {
      triggerMatches: verifyTrigger(text, ability),
      effectMatches: verifyEffect(text, ability),
      conditionsMatch: verifyConditions(text, ability),
      targetsMatch: verifyTargets(text, ability),
      optionalityMatches: verifyOptionality(text, ability)
    }
  };
}
```

### Trigger Verification

```typescript
// NOTE: Trigger shape in this codebase is an object: { type: string, ... }
// e.g., trigger: { type: "play-this-character" }
// NOT a string like trigger: "play-this-character"
// See packages/lorcana-types/src/abilities/trigger-types.ts for schema

function verifyTrigger(text: string, ability: Ability): boolean {
  const triggerKeywords: Record<string, RegExp> = {
    "play-this-character": /when(?:ever)? you play this (?:character|card)/i,
    "this-quests": /when(?:ever)? this (?:character )?quests/i,
    "start-of-turn": /at the (?:start|beginning) of (?:your|each) turn/i,
    "banished": /when(?:ever)? (?:this )?(?:character )?is banished/i
  };

  if (!ability.trigger) {
    // Check text doesn't have trigger keywords
    return !Object.values(triggerKeywords).some(p => p.test(text));
  }

  // Access trigger.type since trigger is an object, not a string
  const triggerType = typeof ability.trigger === "object" ? ability.trigger.type : ability.trigger;
  const expectedPattern = triggerKeywords[triggerType];
  return expectedPattern?.test(text) ?? false;
}
```

### Effect Verification

```typescript
function verifyEffect(text: string, ability: Ability): boolean {
  const effectKeywords = {
    "draw": /draw (?:\d+|a) cards?/i,
    "damage": /deal \d+ damage/i,
    "banish": /banish (?:chosen |target )?/i,
    "gain-lore": /gain \d+ lore/i,
    "discard": /discard/i
  };

  if (!ability.effects?.length) {
    return !Object.values(effectKeywords).some(p => p.test(text));
  }

  // Each effect should have corresponding text
  return ability.effects.every(effect => {
    const pattern = effectKeywords[effect.type];
    return pattern?.test(text) ?? true;
  });
}
```

### Optionality Verification

```typescript
function verifyOptionality(text: string, ability: Ability): boolean {
  const hasOptionalText = /you may/i.test(text);
  const abilityIsOptional = ability.optional === true;

  return hasOptionalText === abilityIsOptional;
}
```

## Report Generation

### Summary Report

```markdown
# Parser Improvement Verification Report

**Date:** 2024-01-15
**Scope:** Set 010 parser improvements

## Verification Results

### Type Check
- [x] packages/lorcana-cards: PASS
- [x] packages/lorcana-engine: PASS
- [x] packages/lorcana-types: PASS

### Tests
- [x] Parser tests: 145/145 passing
- [x] Pattern tests: 89/89 passing
- [x] Card tests: 423/423 passing
- [x] Integration: 56/56 passing

### Semantic Checks
- [x] Trigger matching: 100%
- [x] Effect matching: 98% (2 warnings)
- [x] Condition matching: 100%
- [x] Optionality: 100%

## Warnings

1. Card 010-088: Effect text variation
   - Text: "deals damage equal to"
   - Generated: damage with variable amount
   - Status: Acceptable variation

## Conclusion

All verifications passed. Ready for merge.
```

### JSON Report

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "scope": {
    "set": "010",
    "cardsChecked": 15,
    "patternsAdded": 3
  },
  "results": {
    "typeCheck": {
      "passed": true,
      "packages": ["lorcana-cards", "lorcana-engine", "lorcana-types"]
    },
    "tests": {
      "parser": { "total": 145, "passed": 145, "failed": 0 },
      "patterns": { "total": 89, "passed": 89, "failed": 0 },
      "cards": { "total": 423, "passed": 423, "failed": 0 },
      "integration": { "total": 56, "passed": 56, "failed": 0 }
    },
    "semantics": {
      "triggersValid": 15,
      "effectsValid": 14,
      "warnings": 1
    }
  },
  "verdict": "PASS",
  "readyForMerge": true
}
```

## Error Handling

### Type Errors

```bash
# If type check fails
cd packages/lorcana-cards && bun run check-types

# Common issues:
# 1. Missing type exports
# 2. Incompatible ability types
# 3. Missing imports

# Fix and re-run
```

### Test Failures

```bash
# If tests fail
cd packages/lorcana-cards && bun test --verbose parser

# Debug specific test
cd packages/lorcana-cards && bun test -t "test name"

# Check for:
# 1. Pattern order issues
# 2. Capture group mismatches
# 3. Regression in existing patterns
```

### Semantic Mismatches

```typescript
// If semantic verification fails
const check = verifySemantics(cardText, ability);

if (!check.checks.triggerMatches) {
  console.error("Trigger mismatch");
  console.log("Text:", cardText);
  console.log("Generated trigger:", ability.trigger);
}

// Review and adjust pattern or mark for manual implementation
```

## Pre-Merge Checklist

```markdown
- [ ] `bun run check-types` passes
- [ ] `bun test` passes (all packages)
- [ ] `bun run lint` passes
- [ ] `bun run format` applied
- [ ] Semantic checks pass
- [ ] No regressions detected
- [ ] PR description complete
- [ ] Changes documented
```

## Integration with Orchestrator

```typescript
// Report verification results to orchestrator
return {
  phase: "verification",
  success: true,
  results: {
    typeCheck: "pass",
    tests: { total: 145, passed: 145, failed: 0 },
    semantics: { valid: 15, warnings: 1 }
  },
  nextStep: "create-pr"
};
```

## Quick Reference

### Verification Commands

```bash
# Quick verification
bun run check-types && bun test parser

# Full verification
bun run ci-check

# Specific package
cd packages/lorcana-cards && bun run check-types && bun test
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Type error | Missing type export | Add to type union |
| Test fails | Pattern order | Reorder patterns |
| Semantic mismatch | Wrong capture | Adjust regex |
| Regression | Overlapping pattern | Add specificity |

## Keywords

verification, testing, validation, type-check, ci, lorcana, parser
