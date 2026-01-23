# Lorcana Sets 2-3 Implementation Plan (Detailed)

> This plan provides a comprehensive, step-by-step guide for implementing all 407 Lorcana cards from Sets 2-3 while iteratively improving parser v2 through learning-driven development.

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Cards to Implement** | 407 |
| **Set 2 (Rise of the Floodborn)** | 204 cards |
| **Set 3 (Into the Inklands)** | 203 cards |
| **Timeline** | ~14 weeks |
| **Target Parser Coverage** | 80% |
| **Approach** | Type-group order, TDD, learning-driven |

---

## Documents Overview

This plan is organized into multiple documents:

| Document | Purpose | Location |
|----------|---------|----------|
| **Plan (this file)** | High-level overview and detailed phases | `.ai_memory/lorcana-implementation-plan-detailed.md` |
| **TODO List** | Card-by-card checklist (407 cards) | `.ai_memory/lorcana-sets-2-3-todo.md` |
| **Strategy** | Vision, objectives, strategic pillars | `.ai_memory/lorcana-implementation-strategy.md` |
| **Tactics** | Daily workflow, commands, best practices | `.ai_memory/lorcana-implementation-tactics.md` |
| **Implementation Log** | Day-by-day progress tracking | `.ai_memory/lorcana-set-002-003-implementation.md` |

---

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Set 1 (TFC) | ✅ COMPLETE | 204 cards implemented |
| Set 2 (RotF) | ❌ NOT STARTED | 204 cards to implement |
| Set 3 (ItI) | ❌ NOT STARTED | 203 cards to implement |
| Parser v2 | ✅ EXISTS | ~20% coverage, 143 manual overrides |
| Subagents | ✅ READY | 4 new agents created |
| Test Infrastructure | ✅ EXISTS | TestEngine working |
| Type System | ✅ EXISTS | @tcg/lorcana-types complete |

---

## Implementation Approach

### Type-Group Order (Cross-Set)

```
Phase 1: ALL Actions (Sets 2-3)    51 cards
Phase 2: ALL Items (Sets 2-3)      36 cards
Phase 3: ALL Locations (Set 3)     18 cards
Phase 4: ALL Characters (Sets 2-3) 302 cards
```

**Rationale**: Build pattern libraries efficiently across sets rather than completing one set before moving to the next. This allows:
- Faster pattern recognition
- More efficient batch processing
- Better parser learning feedback
- Reduced context switching between card types

### Per-Card Workflow (5 minutes)

```
1. FIND REFERENCE (30s)     → pattern-matcher finds similar cards from Set 1
2. WRITE TEST (1 min)       → lorcana-test-writer generates TDD tests
3. IMPLEMENT (2 min)        → lorcana-card-migrator uses parser v2
4. VERIFY (30s)             → Tests, type-check, format, lint
5. CAPTURE LEARNING (1 min) → Document parser result, patterns found
```

**Total**: ~5 minutes per card (vs. ~15 minutes without similarity matching)

---

## Phase-by-Phase Breakdown

### Phase 1: Actions (Weeks 1-2)

**Target**: 51 action cards across Sets 2-3

| Set | Actions | Duration |
|-----|---------|----------|
| Set 2 | 27 cards | Week 1 |
| Set 3 | 24 cards | Week 2 |

**Why Actions First?**
- Simplest card structure (no durables, no keywords)
- Teach trigger/effect patterns
- High repetition of common patterns
- Build confidence and parser library

**Success Criteria**:
- ✅ All 51 actions implemented
- ✅ All tests passing
- ✅ Parser coverage ≥ 40%

**Sample Cards**:
- Set 2: "Hold Still", "Last Stand", "Zero to Hero", "Let the Storm Rage On"
- Set 3: "99 Puppies", "Boss's Orders", "Friend Like Me", "Rise of the Titans"

### Phase 2: Items (Week 3)

**Target**: 36 item cards across Sets 2-3

| Set | Items | Duration |
|-----|-------|----------|
| Set 2 | 18 cards | Week 3 (first half) |
| Set 3 | 18 cards | Week 3 (second half) |

**Why Items Second?**
- Moderate complexity (introduce durables)
- Teach static/activated ability patterns
- Build on action patterns learned
- Prepare for character complexity

**Success Criteria**:
- ✅ All 36 items implemented
- ✅ All tests passing
- ✅ Parser coverage ≥ 55%

**Sample Cards**:
- Set 2: "Dragon Gem", "Binding Contract", "The Sorcerer's Spellbook"
- Set 3: "Heart of Atlantis", "The Lamp", "Gizmosuit"

### Phase 3: Locations (Week 4)

**Target**: 18 location cards (Set 3 only - NEW CARD TYPE)

| Set | Locations | Duration |
|-----|-----------|----------|
| Set 3 | 18 cards | Week 4 |

**Why Locations Third?**
- NEW card type introduced in Set 3
- Simpler than characters (no keywords)
- Teach location-specific mechanics
- Isolate new type for focused learning

**Success Criteria**:
- ✅ All 18 locations implemented
- ✅ All tests passing
- ✅ Location mechanics validated
- ✅ Parser coverage ≥ 60%

**Sample Cards**:
- "Never Land - Mermaid Lagoon", "Pride Lands - Pride Rock"
- "Maleficent's Castle", "The Sorcerer's Tower"
- "McDuck Manor", "The Bayou - Mysterious Swamp"

### Phase 4: Characters (Weeks 5-12)

**Target**: 302 character cards across Sets 2-3

| Set | Characters | Duration |
|-----|------------|----------|
| Set 2 | 159 cards | Weeks 5-8 |
| Set 3 | 143 cards | Weeks 9-12 |

**Why Characters Last?**
- Most complex card type
- Include all keywords (Evasive, Rush, Ward, etc.)
- Combine all patterns from actions, items, locations
- Allow maximum learning from previous phases

**Success Criteria**:
- ✅ All 302 characters implemented
- ✅ All tests passing
- ✅ Parser coverage ≥ 80%
- ✅ All keywords validated

**Sample Cards**:
- Set 2: "Mickey Mouse - Friendly Face", "Ursula - Deceiver of All"
- Set 3: "Baloo - von Bruinwald XIII", "Jafar - Mistress of All Evil"

---

## Weekly Cycle

### Monday-Thursday: Card Implementation

**Daily Target**: 10 cards/day (adjust based on complexity)

```bash
# Morning Setup (15 min)
cd /Users/wazar/projects/the-card-goat/tcg-engines
git pull
cat .ai_memory/learning/set-XXX-learning.json | jq '.[-10:]'

# Implementation Session (2-3 hours)
/lore:batch-card-processor --set=002 --type=action --count=10

# Evening Review (30 min)
bun test packages/lorcana-cards/src/cards/002
bun run ci-check
bun run scripts/capture-learning.ts --set=002
git add . && git commit -m "feat: implement Set 002 actions [28-37]"
```

### Friday: Parser Improvement

**Focus**: Analyze week's learnings, improve parser

```bash
# 1. Aggregate learnings
bun run scripts/learning-aggregator.ts --period=week

# 2. Generate improvement report
bun run scripts/learning-aggregator.ts --report

# 3. Implement improvements
/lore:parser-improver --priority=high

# 4. Validate improvements
bun run scripts/validate-parser-coverage.ts --set=002

# 5. Update documentation
bun run scripts/update-pattern-library.ts
```

**Output**: Weekly report showing:
- Cards processed
- Parser coverage % (vs. last week)
- Top failures
- Improvements made
- Next week's priorities

---

## Subagents Overview

### 1. batch-card-processor (HIGH PRIORITY)

**Purpose**: Process 10+ similar cards in batch

**When to Use**:
- Implementing 10+ cards with similar patterns
- Processing all actions of a set
- Processing all items with static effects

**Command**:
```bash
/lore:batch-card-processor
# Or:
/skill lorcana-batch-processor --set=002 --type=action --count=10
```

**Output**:
- Card files generated
- Test files generated
- Batch report (success rate, failures, time taken)

### 2. parser-improver (HIGH PRIORITY)

**Purpose**: Analyze parser failures and suggest improvements

**When to Use**:
- Weekly improvement cycle
- After processing 50+ cards
- When parser coverage plateaus

**Command**:
```bash
/lore:parser-improver
```

**Output**:
- New effect parsers
- Updated grammar rules
- Removed manual overrides
- Coverage report

### 3. pattern-matcher (MEDIUM PRIORITY)

**Purpose**: Find similar implemented cards for reference

**When to Use**:
- Implementing a unique/complex card
- Learning how to implement a pattern
- Troubleshooting parser failures

**Command**:
```bash
/lore:pattern-matcher "When you play this character, draw 2 cards"
```

**Output**:
- Top 3-5 similar cards with file paths
- Similarity scores
- Implementation examples

### 4. learning-aggregator (MEDIUM PRIORITY)

**Purpose**: Compile learnings into insights

**When to Use**:
- Weekly reporting
- Progress tracking
- Identifying improvement priorities

**Command**:
```bash
/lore:learning-aggregator
```

**Output**:
- Weekly report (markdown)
- Updated metrics dashboard
- Priority list for parser improvements

---

## Quality Gates

### Per-Card Gates

Every card MUST pass:

```bash
# 1. Test passes
bun test packages/lorcana-cards/src/cards/002/actions/028-*.test.ts

# 2. Type check passes
bun run check-types

# 3. Format check passes
bun run format --check

# 4. Linter passes
bun run lint

# 5. Learning captured
cat .ai_memory/learning/set-002-learning.json | jq '.[] | select(.cardNumber == 28)'
```

### Per-Batch Gates

After implementing a batch of cards:

```bash
# 1. All tests in batch pass
bun test packages/lorcana-cards/src/cards/002

# 2. Full CI checks pass
bun run ci-check

# 3. Sample Gauntlet review (10% of batch)
bun run gauntlet --sample --percent=10

# 4. Learnings aggregated
bun run scripts/capture-learning.ts --set=002
```

### Per-Week Gates

Every Friday:

```bash
# 1. Weekly tests pass
bun test packages/lorcana-cards

# 2. Parser validation
bun run scripts/validate-parser-coverage.ts --set=002

# 3. Gauntlet review (larger sample)
bun run gauntlet --sample --percent=20

# 4. Weekly report generated
bun run scripts/learning-aggregator.ts --report
```

---

## Progress Tracking

### Overall Metrics

| Metric | Baseline | Week 4 | Week 8 | Week 12 | Week 14 | Target |
|--------|----------|--------|--------|---------|---------|--------|
| Cards Implemented | 0 | 87 | 180 | 300 | 407 | 407 |
| Parser Coverage | 20% | 40% | 55% | 70% | 80% | 80% |
| Manual Overrides | 143 | 160 | 180 | 200 | 220 | <220 |
| Test Coverage | 100% | 100% | 100% | 100% | 100% | 100% |
| Avg Time/Card | ~5 min | ~4 min | ~3 min | ~2 min | ~1 min | ~1 min |

### Per-Phase Progress

| Phase | Cards | Duration | Start | End |
|-------|-------|----------|-------|-----|
| Phase 1: Actions | 51 | 2 weeks | Week 1 | Week 2 |
| Phase 2: Items | 36 | 1 week | Week 3 | Week 3 |
| Phase 3: Locations | 18 | 1 week | Week 4 | Week 4 |
| Phase 4: Characters | 302 | 8 weeks | Week 5 | Week 12 |
| Finalization | - | 2 weeks | Week 13 | Week 14 |

---

## Risk Mitigation

### Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Parser stalls at 50% | High | Medium | Accept 30% manual override rate |
| Complex targeting patterns | High | High | Manual override + document as edge case |
| Breaking changes in lorcana-types | High | Low | Keep legacy format comments |
| Subagent quality issues | Medium | Medium | Test on known cards before new cards |
| Implementation falls behind | Medium | Low | Reduce daily target, focus on Sets 2-3 |

### Contingency Plans

**If parser coverage stalls:**
- Accept higher manual override rate (up to 30%)
- Focus only on high-frequency patterns
- Document edge cases as "known limitations"

**If implementation falls behind:**
- Reduce daily target from 10 to 5 cards
- Focus on Sets 2 only, defer Set 3
- Increase batch size for efficiency

**If systemic issues found:**
- Pause implementation
- Fix root cause in parser/types
- Re-validate previous cards
- Resume with improved process

---

## Success Criteria

### Must Have (Blocking)

- ✅ All 407 cards implemented
- ✅ All cards have passing tests
- ✅ CI checks pass (format, lint, type-check)
- ✅ Gauntlet review passes on sample
- ✅ Parser coverage ≥ 60%

### Should Have (Important)

- ✅ Parser coverage ≥ 80%
- ✅ No manual overrides for common patterns
- ✅ Documentation for all edge cases
- ✅ Metrics dashboard showing trends

### Could Have (Nice to Have)

- ✅ Parser coverage ≥ 90%
- ✅ Automated pattern library generation
- ✅ Visual coverage reports
- ✅ Subagent self-improvement

---

## First Steps (Day 1-2)

### Day 1: Setup

```bash
# 1. Create Memory Bank log
cp .ai_memory/TEMPLATE.md .ai_memory/lorcana-set-002-003-implementation.md

# 2. Verify TODO list exists
cat .ai_memory/lorcana-sets-2-3-todo.md

# 3. Validate Set 1 implementation
bun test packages/lorcana-cards/src/cards/001

# 4. Run CI checks to ensure clean slate
bun run ci-check
```

### Day 2: First Cards

```bash
# 1. Implement first batch (10 action cards from Set 2)
/lore:batch-card-processor --set=002 --type=action --count=10

# 2. Run first parser improvement cycle
/lore:parser-improver

# 3. Document learnings
/lore:memory-bank
```

---

## References

- **TODO List**: `.ai_memory/lorcana-sets-2-3-todo.md`
- **Strategy**: `.ai_memory/lorcana-implementation-strategy.md`
- **Tactics**: `.ai_memory/lorcana-implementation-tactics.md`
- **Implementation Log**: `.ai_memory/lorcana-set-002-003-implementation.md`
- **Lorcanito Reference**: `/Users/wazar/projects/lorcanito/`
- **Parser v2**: `packages/lorcana-cards/src/parser/v2/`
- **Set 1 Reference**: `packages/lorcana-cards/src/cards/001/`
- **Existing Agents**: `.claude/agents/lorcana-card-migration.md`, `.claude/agents/lorcana-test-generation.md`

---

## Summary

This plan implements **407 Lorcana cards** through a **learning-driven** approach:

1. **Strategy**: Test-Driven Development, Iterative Parser Enhancement, Type-Group Order, Learning Capture, Subagent Automation
2. **Tactics**: Daily 5-minute workflow per card, Weekly parser improvement cycle, Quality gates at every level
3. **Execution**: 14-week timeline, starting with actions → items → locations → characters

**Key Success Factor**: Every card teaches us how to make the next one faster through documented learnings and parser improvements.
