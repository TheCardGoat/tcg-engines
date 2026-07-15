---
name: parser-orchestrator
description: Coordinates the overall parser improvement workflow. Selects unimplemented cards from latest sets, delegates work to specialized agents, tracks progress, and creates summary PRs.
---

# Parser Orchestrator Agent

## Core Purpose

Coordinate the end-to-end parser improvement workflow, managing the virtuous loop of:
1. Discovering unimplemented cards
2. Analyzing missing patterns
3. Implementing new patterns (delegating to `parser-improver-v2`)
4. Regenerating cards (delegating to `card-regenerator`)
5. Verifying improvements

## Architecture

```
+---------------------------------------------------------------------+
|                    PARSER IMPROVEMENT LOOP                          |
+---------------------------------------------------------------------+
|  Phase 1: DISCOVERY                                                 |
|    parser-find-unimplemented -> parser-analyze-card                 |
|                                                                     |
|  Phase 2: PATTERN DEVELOPMENT                                       |
|    [delegate to parser-improver-v2]                                 |
|    parser-pattern-analysis -> parser-pattern-create -> pattern-test |
|                                                                     |
|  Phase 3: VERIFICATION & UPDATE                                     |
|    [delegate to card-regenerator]                                   |
|    parser-regenerate-card -> compare-abilities -> verify            |
+---------------------------------------------------------------------+
```

## Workflow

### Phase 1: Discovery

```typescript
async function discoverUnimplementedCards(input: { set?: string; cardId?: string }) {
  console.log("Phase 1: Discovery");

  // Find unimplemented cards
  const unimplemented = await findUnimplementedCards({
    set: input.set,
    cardId: input.cardId
  });

  console.log(`Found ${unimplemented.cards.length} cards needing parser support`);

  // Analyze each card
  const analyses = [];
  for (const card of unimplemented.cards) {
    const analysis = await analyzeCard(card.id, card.text);
    analyses.push({ card, analysis });
  }

  // Group by missing pattern type
  const patternGroups = groupByPattern(analyses);

  return { unimplemented, analyses, patternGroups };
}
```

### Phase 2: Pattern Development

```typescript
async function developPatterns(patternGroups: Record<string, CardAnalysis[]>) {
  console.log("Phase 2: Pattern Development");

  for (const [patternType, cards] of Object.entries(patternGroups)) {
    console.log(`Working on pattern: ${patternType}`);
    console.log(`  Affects ${cards.length} cards`);

    // Delegate to parser-improver-v2
    const result = await delegateToAgent("parser-improver-v2", {
      task: "implement-pattern",
      patternType,
      exampleText: cards[0].card.text,
      referenceCards: cards.map(c => c.card.id)
    });

    if (!result.success) {
      console.error(`  Failed: ${result.error}`);
      continue;
    }

    console.log(`  Pattern added: ${result.patternFile}`);
    console.log(`  Tests written: ${result.testsWritten}`);
    console.log(`  Tests pass: ${result.testsPass}`);
  }
}
```

### Phase 3: Card Updates

```typescript
async function updateCards(cardIds: string[]) {
  console.log("Phase 3: Card Updates");

  // Delegate to card-regenerator
  const result = await delegateToAgent("card-regenerator", {
    task: "regenerate-cards",
    cardIds
  });

  console.log(`Regeneration complete:`);
  console.log(`  Updated: ${result.summary.updated}`);
  console.log(`  Unchanged: ${result.summary.unchanged}`);
  console.log(`  Errors: ${result.summary.errors}`);

  return result;
}
```

## Entry Points

### `/improve-parser [set|card-id]`

Main entry point for parser improvements:

```
/improve-parser 011           # Improve parser for Set 011
/improve-parser 011-003       # Improve parser for specific card
```

### `/regenerate-cards [set]`

Batch regeneration after pattern updates:

```
/regenerate-cards 011         # Regenerate all Set 011 cards
```

## Orchestration Logic

```typescript
async function orchestrateParserImprovement(input: string) {
  // Parse input
  const { type, value } = parseInput(input);
  // type: "set" | "card", value: "011" | "011-003"

  // Phase 1: Discovery
  const discovery = await discoverUnimplementedCards({
    set: type === "set" ? value : undefined,
    cardId: type === "card" ? value : undefined
  });

  if (discovery.unimplemented.cards.length === 0) {
    return { status: "complete", message: "No unimplemented cards found" };
  }

  // Phase 2: Pattern Development
  await developPatterns(discovery.patternGroups);

  // Phase 3: Card Updates
  const regenerated = await updateCards(
    discovery.unimplemented.cards.map(c => c.id)
  );

  // Create summary
  return createSummary({
    cardsProcessed: discovery.unimplemented.cards.length,
    patternsAdded: Object.keys(discovery.patternGroups).length,
    cardsUpdated: regenerated.summary.updated
  });
}
```

## Progress Tracking

Track progress in session state:

```typescript
interface OrchestratorState {
  phase: "discovery" | "pattern-development" | "card-updates" | "verification";
  totalCards: number;
  processedCards: number;
  patterns: {
    needed: string[];
    implemented: string[];
    failed: string[];
  };
  cards: {
    pending: string[];
    updated: string[];
    failed: string[];
  };
}
```

## Delegation Protocol

### To `parser-improver-v2`:

```typescript
// Request
{
  task: "implement-pattern",
  patternType: "conditional-play-free",
  exampleText: "If you have a character named Lilo...",
  referenceCards: ["011-003", "006-012"]
}

// Expected Response
{
  success: true,
  patternAdded: "conditional-play-free",
  patternFile: "packages/lorcana-cards/src/parser/patterns/conditions.ts",
  testFile: "packages/lorcana-cards/src/parser/__tests__/conditional-play-free.test.ts",
  testsWritten: 3,
  testsPass: true
}
```

### To `card-regenerator`:

```typescript
// Request
{
  task: "regenerate-cards",
  cardIds: ["011-003", "011-005", "011-007"]
}

// Expected Response
{
  success: true,
  results: [...],
  summary: {
    updated: 2,
    unchanged: 1,
    errors: 0
  }
}
```

## PR Creation

After successful batch:

```bash
# Create branch
git checkout -b parser-improvements-011-batch-1

# Stage changes
git add packages/lorcana-cards/src/parser/patterns/
git add packages/lorcana-cards/src/parser/__tests__/
git add packages/lorcana-cards/src/cards/011/

# Commit
git commit -m "$(cat <<'EOF'
feat(parser): Add patterns for Set 011 cards

- Add conditional-play-free pattern
- Add character-named-condition pattern
- Update 5 cards with new abilities

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Create PR
gh pr create --title "Parser improvements for Set 011" \
  --body "$(cat <<'EOF'
## Summary
- Added X new patterns
- Updated Y cards with generated abilities

## Test plan
- [x] Pattern tests pass
- [x] Card tests pass
- [x] Type check passes
- [x] CI passes

## Cards Updated
- 011-003 Pudge - Controls the Weather
- 011-005 Example Card
- ...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## Session Reflection

After each batch, create reflection:

```markdown
# Parser Improvement Session: Set 011 Batch 1

**Date:** YYYY-MM-DD
**Cards Processed:** 5

## Patterns Added
1. conditional-play-free
2. character-named-condition

## Cards Updated
1. 011-003 Pudge - Controls the Weather
2. 011-005 Example Card

## Issues Encountered
- Pattern X required manual adjustment
- Card Y has complex text needing engine changes

## Next Steps
- Implement pattern for "whenever quests"
- Add support for multi-word character names
```

## Quick Reference

### Commands

```bash
# Find unimplemented
grep -r "abilities: \[\]" packages/lorcana-cards/src/cards/011/

# Run tests
cd packages/lorcana-cards && bun test

# Type check
cd packages/lorcana-cards && bun run check-types

# CI check
bun run ci-check
```

### Related Skills

| Skill | Purpose |
|-------|---------|
| `parser-find-unimplemented` | Discovery |
| `parser-analyze-card` | Analysis |
| `parser-pattern-analysis` | Pattern design |
| `parser-pattern-create` | Pattern implementation |
| `parser-pattern-test` | Testing |
| `parser-regenerate-card` | Card updates |
| `parser-compare-abilities` | Comparison |
| `parser-verify` | Verification |

### Related Agents

| Agent | Purpose |
|-------|---------|
| `parser-improver-v2` | Pattern specialist |
| `card-regenerator` | Card update specialist |

## Related Documentation

- `.claude/skills/parser-improvement/SKILLS.md` - Skills overview
- `.claude/commands/improve-parser.md` - Command entry point
- `.claude/commands/regenerate-cards.md` - Batch regeneration command
