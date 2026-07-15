---
name: parser-improvement
description: Incrementally improve the Lorcana card text parser through pattern discovery, implementation, and verification. Coordinates the virtuous loop of finding unimplemented cards, analyzing text patterns, creating new parser patterns, and regenerating card files.
---

# Parser Improvement Skills

## Overview

This skill set enables a virtuous loop for incrementally improving the card text parser in `packages/lorcana-cards/src/parser/` while also updating the type definitions in `packages/lorcana-types`. The workflow coordinates:

1. **Discovery** - Find unimplemented cards (prioritize latest sets)
2. **Pattern Development** - Analyze text, design patterns, implement, test (TDD)
3. **Verification** - Regenerate cards, compare abilities, validate changes

## Architecture

```
+---------------------------------------------------------------------+
|                    PARSER IMPROVEMENT LOOP                          |
+---------------------------------------------------------------------+
|  Phase 1: DISCOVERY                                                 |
|    parser-find-unimplemented -> parser-analyze-card                 |
|                                                                     |
|  Phase 2: PATTERN DEVELOPMENT                                       |
|    parser-pattern-analysis -> parser-pattern-create -> pattern-test |
|                                                                     |
|  Phase 3: VERIFICATION & UPDATE                                     |
|    parser-regenerate-card -> parser-compare-abilities -> verify     |
+---------------------------------------------------------------------+
```

## Key Paths

| Component | Path |
|-----------|------|
| V1 Parser | `packages/lorcana-cards/src/parser/` |
| V2 Parser | `packages/lorcana-cards/src/parser/v2/` |
| Patterns (split) | `packages/lorcana-cards/src/parser/patterns/*.ts` |
| V2 Effects | `packages/lorcana-cards/src/parser/v2/effects/atomic/*.ts` |
| Parser Tests | `packages/lorcana-cards/src/parser/__tests__/*.test.ts` |
| Cards | `packages/lorcana-cards/src/cards/{set}/{type}/*.ts` |

## Skills Index

### Phase 1: Discovery

| Skill | Purpose |
|-------|---------|
| [parser-find-unimplemented](parser-find-unimplemented.md) | Find cards with empty/placeholder abilities |
| [parser-analyze-card](parser-analyze-card.md) | Analyze card text for missing patterns |

### Phase 2: Pattern Development

| Skill | Purpose |
|-------|---------|
| [parser-pattern-analysis](parser-pattern-analysis.md) | Design regex patterns for text |
| [parser-pattern-create](parser-pattern-create.md) | Add patterns to split pattern files |
| [parser-pattern-test](parser-pattern-test.md) | Write and run pattern tests |

### Phase 3: Verification

| Skill | Purpose |
|-------|---------|
| [parser-regenerate-card](parser-regenerate-card.md) | Re-parse cards after updates |
| [parser-compare-abilities](parser-compare-abilities.md) | Compare before/after abilities |
| [parser-verify](parser-verify.md) | Final validation |

## Related Agents

| Agent | Purpose |
|-------|---------|
| `parser-orchestrator` | Coordinates workflow, delegates to sub-agents |
| `parser-improver-v2` | Pattern analysis, design, implementation (TDD) |
| `card-regenerator` | Re-runs parsing, updates card files |

## Related Commands

| Command | Entry Point |
|---------|-------------|
| `/improve-parser [set\|card-id]` | Main workflow entry |
| `/regenerate-cards [set]` | Batch card regeneration |

## V1 vs V2 Parser Selection

**V1 Parser** (Simple):
- Regex-based pattern matching
- Quick additions for common patterns
- Files: `packages/lorcana-cards/src/parser/patterns/*.ts`

**V2 Parser** (Complex):
- Grammar-based parsing
- Atomic effect composition
- Complex multi-clause abilities
- Files: `packages/lorcana-cards/src/parser/v2/effects/atomic/*.ts`

**Selection Criteria:**
- Single effect, standard wording -> V1
- Multi-effect, complex conditions -> V2
- Nested clauses, modal effects -> V2

## Quick Start

```bash
# Find unimplemented cards in a set
grep -r "abilities: \[\]" packages/lorcana-cards/src/cards/010/

# Run parser tests
cd packages/lorcana-cards && bun test parser

# Type check parser
cd packages/lorcana-cards && bun run check-types

# Full CI check
bun run ci-check
```

## Example Workflow

```
User: /improve-parser 010

1. Finding unimplemented cards in Set 010...
   Found 5 cards needing parser support

2. Analyzing: 010-043 Iago - Stompin' Mad
   Text: "When you play this character..."
   Missing pattern: play-self-trigger with opponent choice

3. Creating pattern in patterns/triggers.ts...
   - Pattern added
   - Tests written and passing

4. Re-parsing card...
   Generated abilities match expected structure
   Card file updated

5. Creating PR...
   Branch: parser-improvements-010
   Files: patterns/triggers.ts, __tests__/trigger-patterns.test.ts, cards/010/...
```

## Keywords

parser, patterns, regex, lorcana, cards, text-parsing, abilities, tdd, test-driven-development
