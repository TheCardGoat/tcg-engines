---
name: improve-parser
description: Main entry point for the parser improvement workflow. Discovers unimplemented cards, analyzes missing patterns, implements patterns, and regenerates cards.
user_invokable: true
---

# Improve Parser Command

## Usage

```
/improve-parser [set|card-id]
```

## Arguments

| Argument | Description | Examples |
|----------|-------------|----------|
| `set` | Three-digit set number | `010`, `011` |
| `card-id` | Full card identifier | `010-043`, `011-003-pudge` |

## Examples

```bash
# Improve parser for entire set
/improve-parser 010

# Improve parser for specific card
/improve-parser 010-043

# Improve parser for latest set
/improve-parser 011
```

## Workflow

When invoked, this command triggers the parser orchestrator to:

### 1. Discovery Phase

```
Finding unimplemented cards...
- Scanning: packages/lorcana-cards/src/cards/{set}/
- Looking for: empty abilities, manual overrides, parse failures
```

Output:
```
Found 5 cards needing parser support:
  1. 010-043 Iago - Stompin' Mad
  2. 010-088 Mulan - Imperial Soldier
  3. 010-112 Belle - Diplomatic
  4. 010-145 Stitch - Carefree Surfer
  5. 010-167 Elsa - Snow Queen
```

### 2. Analysis Phase

```
Analyzing card text for missing patterns...
```

Output:
```
Pattern analysis complete:

Missing Patterns:
  1. opponent-choice-discard (affects 2 cards)
  2. conditional-play-free (affects 1 card)
  3. choose-one-modal (affects 2 cards)
```

### 3. Pattern Development Phase

```
Implementing patterns...
```

For each pattern:
1. Design regex pattern
2. Add to appropriate pattern file
3. Write tests
4. Verify tests pass

Output:
```
Pattern: opponent-choice-discard
  File: packages/lorcana-cards/src/parser/patterns/effects.ts
  Tests: 4 written, 4 passing
  Status: SUCCESS

Pattern: conditional-play-free
  File: packages/lorcana-cards/src/parser/patterns/conditions.ts
  Tests: 3 written, 3 passing
  Status: SUCCESS
```

### 4. Regeneration Phase

```
Regenerating card files...
```

Output:
```
Regeneration complete:
  Updated: 4 cards
  Unchanged: 1 card
  Errors: 0

Updated cards:
  - 010-043 Iago - Stompin' Mad
  - 010-088 Mulan - Imperial Soldier
  - 010-145 Stitch - Carefree Surfer
  - 010-167 Elsa - Snow Queen
```

### 5. Verification Phase

```
Running verification...
```

Output:
```
Verification:
  Type check: PASS
  Parser tests: 145/145 passing
  Card tests: 423/423 passing

Ready for review.
```

## Output

### Success

```
=== Parser Improvement Complete ===

Set: 010
Cards processed: 5
Patterns added: 3
Cards updated: 4

Files modified:
  - packages/lorcana-cards/src/parser/patterns/effects.ts
  - packages/lorcana-cards/src/parser/patterns/conditions.ts
  - packages/lorcana-cards/src/parser/__tests__/opponent-choice.test.ts
  - packages/lorcana-cards/src/parser/__tests__/conditional-play-free.test.ts
  - packages/lorcana-cards/src/cards/010/characters/043-iago-stompin-mad.ts
  - packages/lorcana-cards/src/cards/010/characters/088-mulan-imperial-soldier.ts
  - packages/lorcana-cards/src/cards/010/characters/145-stitch-carefree-surfer.ts
  - packages/lorcana-cards/src/cards/010/characters/167-elsa-snow-queen.ts

Next steps:
  1. Review changes: git diff
  2. Run full test suite: bun test
  3. Create PR when ready
```

### Partial Success

```
=== Parser Improvement Complete (with issues) ===

Set: 010
Cards processed: 5
Patterns added: 2
Cards updated: 3

Issues:
  - Card 010-112: Complex modal text requires V2 parser update
  - Pattern 'choose-one-modal': Implementation pending

Files modified: [...]

Recommended actions:
  1. Review complex cards manually
  2. Consider V2 parser enhancements
```

### No Work Needed

```
=== Parser Improvement Complete ===

Set: 010
Status: All cards already have parsed abilities

No changes needed.
```

## Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview changes without writing |
| `--verbose` | Show detailed output |
| `--skip-tests` | Skip test writing (not recommended) |

## Related Commands

- `/regenerate-cards [set]` - Batch regeneration only (no pattern development)

## Related Agents

- `parser-orchestrator` - Coordinates the workflow
- `parser-improver-v2` - Implements patterns
- `card-regenerator` - Updates card files

## Related Skills

- `parser-find-unimplemented` - Discovery
- `parser-analyze-card` - Analysis
- `parser-pattern-analysis` - Pattern design
- `parser-pattern-create` - Implementation
- `parser-pattern-test` - Testing
- `parser-regenerate-card` - Card updates
- `parser-verify` - Verification

## Troubleshooting

### No Cards Found

```
Found 0 cards needing parser support
```

Check:
- Correct set number
- Cards exist in `packages/lorcana-cards/src/cards/{set}/`
- Cards have `text` field but empty `abilities`

### Pattern Already Exists

```
Pattern 'draw-cards' already exists
```

Check:
- Pattern may be named differently
- Pattern may need refinement, not addition

### Test Failures

```
Tests: 3 written, 2 passing, 1 failing
```

Check:
- Pattern regex specificity
- Capture group correctness
- Pattern ordering

### Type Check Failures

```
Type check: FAIL
```

Check:
- New type exports in `lorcana-types`
- Correct imports in pattern files
- Type union updates
