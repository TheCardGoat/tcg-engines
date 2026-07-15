# Lorcana Sets 2-3 Implementation

> Implement all Lorcana cards from Sets 2-3 while iteratively improving parser v2 through learning-driven development.

## Context

| Field | Value |
|-------|-------|
| **Date Started** | 2026-01-22 |
| **Branch** | `feature/lorcana-sets-2-3-implementation` |
| **Related Plans** | `.ai_memory/lorcana-implementation-plan.md` |
| **Author** | Claude Code (AI Agent) |

## Problem Statement

### Current State
- **Set 1 (TFC)**: ✅ Complete (204 cards)
- **Set 2 (RotF)**: ❌ Missing (204 cards)
- **Set 3 (ItI)**: ❌ Missing (~200 cards)
- **Parser v2 Coverage**: ~20% on legacy cards
- **Subagents Needed**: 4 new agents for automation

### Expected Behavior
1. Implement all 423 cards from Sets 1-3 (Set 1 already complete)
2. Improve parser coverage from 20% to 80%
3. Create 4 new subagents for automation
4. Document learnings from each card to improve parser
5. Follow TDD workflow: RED → GREEN → REFACTOR

### Why This Matters
- Completes Lorcana card library for first 3 sets
- Validates parser v2 against diverse card patterns
- Establishes scalable pattern for future sets
- Builds reusable automation infrastructure

## Research & Analysis

### Key Findings

1. **Set 1 is Complete**
   - Location: `packages/lorcana-cards/src/cards/001/`
   - 204 cards implemented: actions, items, characters
   - All cards have tests
   - Reference implementation for Sets 2-3

2. **Parser v2 Architecture**
   - Location: `packages/lorcana-cards/src/parser/v2/`
   - Hybrid approach: manual overrides → keyword → grammar → regex
   - 143 existing manual overrides
   - 20 atomic effect parsers, 7 composite effect parsers

3. **Lorcanito Reference**
   - Location: `/Users/wazar/projects/lorcanito/`
   - Proven patterns for TDD, test generation, card implementation
   - AI skills system for automation
   - TestEngine for comprehensive testing

4. **Existing Agents**
   - `lorcana-card-migration`: Migrates legacy cards with parser v2
   - `lorcana-test-writer`: Generates tests for card abilities
   - `memory-bank-manager`: Manages development logs

### Key Files

| File | Relevance |
|------|-----------|
| `packages/lorcana-cards/src/parser/v2/index.ts` | Main parser - understand parsing flow |
| `packages/lorcana-cards/src/parser/v2/manual-overrides.ts` | 143 manual overrides - pattern reference |
| `packages/lorcana-cards/src/cards/001/` | Set 1 reference implementation |
| `.claude/agents/lorcana-card-migration.md` | Agent pattern reference |
| `/Users/wazar/projects/lorcanito/packages/lorcana-engine/src/` | External reference for patterns |

### Existing Patterns

**Card File Pattern**:
```typescript
// Location: packages/lorcana-cards/src/cards/002/actions/
export const cardName: CardType = {
  id: "abc123",
  cardType: "action" | "item" | "character",
  name: "Card Name",
  version: "Version",
  fullName: "Card Name - Version",
  inkType: ["amber" | "amethyst" | "ruby" | "sapphire" | "steel" | "emerald"],
  set: "002",
  text: "Ability text here",
  cost: 5,
  // Type-specific properties
  abilities: [ /* parsed abilities */ ],
  classifications: ["Dreamborn", "Hero"], // characters only
};
```

**Test Pattern**:
```typescript
describe("Card Name - Version", () => {
  it("ability description", async () => {
    const testEngine = new LorcanaTestEngine({
      inkwell: card.cost,
      hand: [card],
      // ... setup
    });

    await testEngine.playCard(card);
    // ... verify game state changes
  });
});
```

## Proposed Solution

### Approach

**Phase 1: Setup (Day 1-2)**
1. Create Memory Bank log (this file)
2. Create 4 new subagents based on lorcanito patterns
3. Validate Set 1 implementation

**Phase 2: Subagent Creation (Day 2-3)**
1. `batch-card-processor`: Process 10+ similar cards in batch
2. `parser-improver`: Analyze failures, improve parser
3. `pattern-matcher`: Find similar implemented cards
4. `learning-aggregator`: Compile learnings into insights

**Phase 3: Implementation (Weeks 1-14)**
1. **Weeks 1-2**: Set 2 Actions (~60 cards)
2. **Week 3**: Set 2 Items (~30 cards)
3. **Weeks 4-6**: Set 2 Characters (~114 cards)
4. **Weeks 7-8**: Set 3 Actions + Items (~100 cards)
5. **Weeks 9-10**: Set 3 Characters (~100 cards)
6. **Weeks 11-12**: Finalization and validation

### Implementation Order

**By Card Type Group (Cross-Set)**:
```
Phase 1: ALL Actions (Sets 2-3)    ~160 cards
Phase 2: ALL Items (Sets 2-3)      ~80 cards
Phase 3: ALL Characters (Sets 2-3) ~280 cards
```

**Rationale**: Build pattern libraries efficiently. Actions teach trigger/effect patterns. Items teach durability/static effects. Characters apply all patterns.

### Files to Create

| File | Purpose |
|------|---------|
| `.claude/agents/batch-card-processor.md` | Batch processing agent |
| `.claude/agents/parser-improver.md` | Parser improvement agent |
| `.claude/agents/pattern-matcher.md` | Pattern matching agent |
| `.claude/agents/learning-aggregator.md` | Learning aggregation agent |
| `.ai_memory/learning/set-002-learning.json` | Autogenerated learnings |
| `.ai_memory/learning/set-003-learning.json` | Autogenerated learnings |

### Files to Modify

| File | Changes |
|------|---------|
| `packages/lorcana-cards/src/parser/v2/manual-overrides.ts` | Add new manual overrides |
| `packages/lorcana-cards/src/parser/v2/effects/atomic/index.ts` | Add new atomic parsers |
| `packages/lorcana-cards/src/parser/v2/effects/composite/index.ts` | Add new composite parsers |

### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Sequential by set (Set 2 → Set 3) | Clear set boundaries | Loses pattern building opportunities | Rejected - type group is better |
| By card type group (chosen) | Builds pattern libraries efficiently | Cross-set file organization | **Chosen** - optimizes learning |
| By complexity (simple → complex) | Gradual difficulty ramp | Doesn't match real card distribution | Rejected - not practical |

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Parser stalls at 50% coverage | Accept 30% manual override rate |
| Complex patterns break parser | Manual override + document as edge case |
| Implementation falls behind | Reduce daily target, focus on Sets 1-2 |
| Breaking changes in lorcana-types | Keep legacy format comments, easy rollback |
| Subagent quality issues | Test on known cards before new cards |

## Implementation Log

<!-- Add new date sections at the TOP (newest first) -->

### 2026-01-22 (Day 1)

- [x] Create Memory Bank log (lorcana-set-002-003-implementation.md)
- [x] Create Strategy document (.ai_memory/lorcana-implementation-strategy.md)
- [x] Create Tactics document (.ai_memory/lorcana-implementation-tactics.md)
- [x] Create Plan document (.claude/plans/prancy-cuddling-rain.md)
- [x] Create batch-card-processor subagent (.claude/agents/batch-card-processor.md)
- [x] Create parser-improver subagent (.claude/agents/parser-improver.md)
- [x] Create pattern-matcher subagent (.claude/agents/pattern-matcher.md)
- [x] Create learning-aggregator subagent (.claude/agents/learning-aggregator.md)
- [x] Validate Set 1 implementation (31 tests pass)
- [ ] Begin Set 2 action cards implementation

**Summary**: Phase 1 (Setup) complete. All 4 subagents created based on lorcanito patterns. Set 1 validated and working. Ready to begin card implementation.

## Progress Tracking

### Overall Status

| Metric | Baseline | Current | Target |
|--------|----------|---------|--------|
| Cards Implemented | 204 (Set 1) | 204 | 423 |
| Parser Coverage | 20% | 20% | 80% |
| Subagents Created | 2 | 6 | 6 |
| Subagents Ready | - | Yes | Yes |

### Per-Set Status

| Set | Cards | Status |
|-----|-------|--------|
| Set 1 (TFC) | 204 | ✅ Complete |
| Set 2 (RotF) | 204 | ❌ Not Started |
| Set 3 (ItI) | ~200 | ❌ Not Started |

### Per-Phase Status

| Phase | Cards | Status |
|-------|-------|--------|
| Phase 1: Actions | ~160 | ⏳ Pending |
| Phase 2: Items | ~80 | ⏳ Pending |
| Phase 3: Characters | ~280 | ⏳ Pending |

## Learning Log

### Parser Improvements

<!-- Document parser improvements made during implementation -->

| Date | Improvement | Impact | Cards Affected |
|------|-------------|--------|----------------|
| - | - | - | - |

### Common Patterns Discovered

<!-- Document common patterns found during implementation -->

| Pattern | Frequency | Implementation |
|---------|-----------|----------------|
| - | - | - |

### Edge Cases

<!-- Document edge cases and how they were handled -->

| Card | Issue | Resolution |
|------|-------|------------|
| - | - | - |

## Success Metrics

| Metric | Baseline | Week 2 | Week 4 | Week 8 | Week 14 | Target |
|--------|----------|--------|--------|--------|---------|--------|
| Cards Implemented | 204 | 260 | 320 | 380 | 423 | 423 |
| Parser Coverage | 20% | 35% | 55% | 70% | 80% | 80% |
| Manual Overrides | 143 | 160 | 180 | 200 | 220 | <220 |
| Test Coverage | 100% | 100% | 100% | 100% | 100% | 100% |
| Avg Time/Card | ~5 min | ~3 min | ~2 min | ~1.5 min | ~1 min | ~1 min |

## Review Checklist (The Gauntlet)

### Style (Linter Agent)

- [ ] Follows `.claude/rules/code-style.md`
- [ ] No TypeScript `any` types
- [ ] Proper import ordering
- [ ] Biome formatting applied (`bun run format`)
- [ ] No unused variables or imports

### Logic (Analyst Agent)

- [ ] Game rules correctly implemented per `.claude/rules/domain-concepts.md`
- [ ] Card abilities match official text
- [ ] Edge cases handled
- [ ] Tests cover happy path for each ability
- [ ] No property validation tests (effects tested separately)

### Architecture (Tech Lead Agent)

- [ ] No code duplication (DRY principle)
- [ ] Follows `agent-os/product/philosophy.md`
- [ ] Subagents follow existing patterns
- [ ] Parser improvements are reusable
- [ ] Memory Bank properly maintained

## Status

- [x] Memory Bank created
- [x] Plan approved by user
- [x] Subagents created (4/4) ✅
- [ ] Set 2 implementation started
- [ ] Set 3 implementation started
- [x] Tests passing (Set 1 validated: 31 tests)
- [ ] Type check passing
- [ ] Format check passing
- [ ] PR merged

## References

- **Plan**: `/Users/wazar/.claude/plans/prancy-cuddling-rain.md`
- **Strategy**: `.ai_memory/lorcana-implementation-strategy.md`
- **Tactics**: `.ai_memory/lorcana-implementation-tactics.md`
- **Lorcanito**: `/Users/wazar/projects/lorcanito/`
- **Parser v2**: `packages/lorcana-cards/src/parser/v2/`
- **Set 1 Reference**: `packages/lorcana-cards/src/cards/001/`
