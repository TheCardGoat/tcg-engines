# Unified Validation Structure - Summary

## Overview

This document provides a high-level summary of the unified validation structure that combines:
1. **Local Plan** (tcg-engines) - Card implementation workflow
2. **External Plan** (lorcanito) - Type system validation

**Key Strategy**: For each card, implement the proposed card type and engine API, collect learnings, improve the plan, and move to the next card.

---

## Document Map

### Local Project (tcg-engines)
```
.ai_memory/
├── lorcana-implementation-plan.md              # High-level plan & TODO
├── lorcana-implementation-plan-detailed.md     # Detailed phases & workflow
├── lorcana-sets-2-3-todo.md                   # Card checklist (407 cards)
├── unified-validation-structure.md            # THIS: Full execution guide
├── validation-template.md                     # Per-card validation template
└── validations/                                # Per-card validation documents
    ├── TFC-21-stitch.md
    ├── TFC-25-be-our-guest.md
    └── ...
```

### External Project (lorcanito)
```
/Users/wazar/projects/lorcanito/packages/lorcana-engine-greenfield-rewrite-plan/
├── plan-a/
│   ├── plan-a.md                               # Type-safe API design
│   ├── validation-todo.md                      # Cards to validate
│   └── simulation-draft/
│       ├── patterns/                           # Per-pattern validation
│       └── cards/                              # Per-card validation
└── plan-b/
    └── plan-b.md                               # API redesign focus
```

---

## Quick Start Workflow

### Per-Card Execution

```bash
# 1. Select card
export CARD="TFC-21"
export NAME="stitch"

# 2. Create validation document
cp .ai_memory/validation-template.md .ai_memory/validations/${CARD}-${NAME}.md
vi .ai_memory/validations/${CARD}-${NAME}.md

# 3. Find similar cards (optional)
/skill pattern-matcher "When you play this character, draw cards"

# 4. Implement card
/skill lorcana-card-migration --card=${CARD}

# 5. Generate tests
/skill lorcana-test-generation --card=${CARD}

# 6. Run quality gates
bun run ci-check

# 7. Update memory bank
/skill memory-bank
```

### Batch Execution

```bash
# Process 10 similar cards
/skill batch-card-processor --set=002 --type=action --count=10

# Aggregate learnings
/skill learning-aggregator --period=batch

# Improve parser
/skill parser-improver --priority=high
```

---

## Execution Phases

### Phase Order (Cross-Set)
```
Phase 1: ALL Actions (Sets 2-3)    ~51 cards
Phase 2: ALL Items (Sets 2-3)      ~36 cards
Phase 3: ALL Locations (Set 3)     ~18 cards
Phase 4: ALL Characters (Sets 2-3) ~302 cards
```

### Per-Card Steps (5 minutes)
1. **Find Reference** (30s) - Use pattern-matcher
2. **Write Test** (1 min) - Use lorcana-test-writer
3. **Implement** (2 min) - Use lorcana-card-migrator
4. **Verify** (30s) - Run tests, type-check, format, lint
5. **Capture Learning** (1 min) - Document parser result, patterns, issues

---

## Status Tracking

### Card-Level Status

| Status | Meaning |
|--------|---------|
| `✓` | Complete (all steps done) |
| `⚠` | Partial (some steps with notes) |
| `✗` | Failed (blocked by issue) |
| `-` | Not started |

### Batch-Level Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Parser Coverage | 20% | 80% |
| Manual Overrides | 143 | <220 |
| Avg Time/Card | ~5 min | ~1 min |

---

## Quality Gates

### Per-Card Gates
- [ ] Validation document created and filled
- [ ] Card implemented in @tcg/lorcana-types format
- [ ] Tests pass (happy path)
- [ ] Type check passes
- [ ] Format check passes
- [ ] Lint passes
- [ ] Learnings captured

### Per-Batch Gates (10 cards)
- [ ] All cards implemented
- [ ] All tests pass
- [ ] CI checks pass
- [ ] Parser coverage updated
- [ ] Patterns aggregated
- [ ] Plans updated with learnings

---

## Learning Categories

### 1. Parser Learnings
What did the parser handle well/poorly?
- New grammar rules needed
- New regex patterns needed
- Manual override patterns

### 2. Type System Learnings
What types are missing or incomplete?
- New card subtypes
- New ability types
- New effect types
- New target patterns

### 3. Pattern Learnings
What new ability/effect combinations were found?
- Trigger + cost + effect patterns
- Conditional patterns
- Duration patterns

### 4. API Learnings
What engine operations were needed?
- New move types
- New query methods
- New state transitions

---

## Plan Update Cycle

### Weekly Cycle
```
Monday-Thursday: Implement cards (10/day)
Friday: Parser improvement + Plan updates
```

### Plan Updates
1. **Update Plan A** with new types/patterns discovered
2. **Update Plan B** with API gaps found
3. **Update parser v2** with new grammar/rules
4. **Update plan documents** with learnings

---

## References

### Key Documents
- **Full Execution Guide**: `.ai_memory/unified-validation-structure.md`
- **Validation Template**: `.ai_memory/validation-template.md`
- **Local Plan**: `.ai_memory/lorcana-implementation-plan.md`
- **External Plan A**: `/Users/wazar/projects/lorcanito/.../plan-a/plan-a.md`
- **External Plan B**: `/Users/wazar/projects/lorcanito/.../plan-b/plan-b.md`

### Key Commands
- `/skill pattern-matcher` - Find similar cards
- `/skill lorcana-card-migration` - Implement card
- `/skill lorcana-test-generation` - Write tests
- `/skill batch-card-processor` - Process batch
- `/skill parser-improver` - Improve parser
- `/skill learning-aggregator` - Aggregate learnings
- `/skill memory-bank` - Update progress log

---

## Quick Reference

### Get Started
```bash
# Read the full execution guide
cat .ai_memory/unified-validation-structure.md

# Create first validation document
cp .ai_memory/validation-template.md .ai_memory/validations/TFC-21-stitch.md

# Start implementing
/skill lorcana-card-migration --card=TFC-21
```

### Check Progress
```bash
# View all validations
ls -la .ai_memory/validations/

# Count completed cards
grep -r "^- \[x\]" .ai_memory/validations/ | wc -l

# View memory bank
cat .ai_memory/lorcana-validation-implementation.md
```
