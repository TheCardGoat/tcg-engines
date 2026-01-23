# Lorcana Card Implementation Strategy

## Vision

Create a self-improving card implementation system where each card teaches us how to make the next implementation faster and more accurate, ultimately achieving 80%+ automatic parser coverage across all Lorcana sets.

## Mission Statement

Build production-quality Lorcana card implementations through:
- **Test-Driven Development**: Every card has comprehensive behavioral tests
- **Iterative Learning**: Each implementation improves the parser for future cards
- **Automation at Scale**: Subagents handle repetitive tasks, humans handle complexity
- **Quality First**: Gauntlet review ensures code meets project standards

## Strategic Objectives

### Primary Objective
Implement **423 Lorcana cards** (Sets 1-3+) with **95%+ test coverage** and **80%+ parser accuracy**.

### Secondary Objectives

| Objective | Baseline | Target | Metric |
|-----------|----------|--------|--------|
| Parser Coverage | 19.8% | 80% | % cards auto-parsed |
| Implementation Velocity | ~5 min/card | ~1 min/card | Avg time per card |
| Manual Overrides | 143 | <220 | Total manual entries |
| CI Pass Rate | N/A | 99% | % of commits passing |
| Test Coverage | 100% | 100% | % cards with tests |

## Strategic Pillars

### Pillar 1: Test-Driven Development (TDD)

**Principle**: Write tests before implementation.

**Workflow**:
```
RED → Write failing test for ability behavior
GREEN → Implement minimum code to pass test
REFACTOR → Clean up while tests remain green
```

**Rationale**: Ensures correctness, prevents regressions, documents expected behavior.

**Source**: Proven pattern from Lorcanito repo.

### Pillar 2: Iterative Parser Enhancement

**Principle**: Every parsing failure is a learning opportunity.

**Workflow**:
1. Parse card ability text with parser v2
2. If successful → validate and commit
3. If failed → document pattern, add to improvement backlog
4. Weekly → analyze failures, improve parser
5. Validate → re-parse previously failed cards

**Rationale**: Parser should improve over time, not remain static.

**Target**: Reduce manual intervention from 80% to 20%.

### Pillar 3: Type-Group Implementation Order

**Principle**: Implement by card type group to build pattern libraries efficiently.

**Order**:
1. **Actions** (simplest structure, high pattern repetition)
2. **Items** (moderate complexity, static/activated abilities)
3. **Characters** (most complex, keywords + all ability types)

**Rationale**:
- Actions teach trigger/effect patterns
- Items teach durability/static effects
- Characters apply all patterns + keywords

**Cross-Set Approach**: Complete ALL Actions across Sets 1-3, then ALL Items, then ALL Characters.

### Pillar 4: Learning Capture & Feedback

**Principle**: Document everything. Feed learnings back into the system.

**Learning Cycle**:
```
Implement Card → Document Learning → Aggregate Learnings → Improve Parser → Next Card (Faster)
```

**Capture Points**:
- Per-card: Parser result, manual interventions, patterns found
- Per-batch: Success rate, common failures, time metrics
- Per-week: Trend analysis, improvement priorities

**Rationale**: Without capture, we can't measure improvement or identify patterns.

### Pillar 5: Subagent Automation

**Principle**: Humans design, subagents execute.

**Human Responsibilities**:
- Design subagents
- Handle ambiguous/complex cases
- Review and approve batch results
- Improve parser based on aggregated learnings

**Subagent Responsibilities**:
- Process similar cards in batch
- Find similar implemented cards for reference
- Generate test files
- Aggregate and report learnings

**Rationale**: Scale requires automation. Humans are too expensive for repetitive tasks.

## Current State Analysis

### What's Complete

| Component | Status | Notes |
|-----------|--------|-------|
| Set 1 (The First Chapter) | ✅ COMPLETE | 204 cards implemented |
| Parser v2 | ✅ EXISTS | Hybrid approach with 4-stage fallback |
| Existing Agents | ✅ EXISTS | lorcana-card-migration, lorcana-test-generation |
| Test Infrastructure | ✅ EXISTS | TestEngine for card testing |
| Type System | ✅ EXISTS | @tcg/lorcana-types with branded types |

### What's Missing

| Component | Status | Target |
|-----------|--------|--------|
| Set 2 (Rise of the Floodborn) | ❌ MISSING | 204 cards |
| Set 3 (Into the Inklands) | ❌ MISSING | ~200 cards |
| Subagents | ❌ MISSING | 4 new agents needed |
| Learning System | ❌ MISSING | Capture + aggregation |
| Metrics Dashboard | ❌ MISSING | Coverage tracking |

### Key Insight

**Set 1 is already complete!** The project scope is implementing Sets 2-3, not re-implementing Set 1.

## Risk Management

### High-Risk Areas

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Parser coverage stalls at 50% | High | Medium | Accept 30% manual override rate |
| Complex targeting patterns break parser | High | High | Manual override + document as edge case |
| Breaking changes in lorcana-types | High | Low | Keep legacy format comments, easy rollback |
| Subagent quality issues | Medium | Medium | Test on known cards before new cards |
| Implementation burnout | Medium | Low | Batch processing reduces manual work |

### Contingency Plans

**If parser coverage stalls:**
- Accept higher manual override rate (up to 30%)
- Focus only on high-frequency patterns
- Document edge cases as "known limitations"

**If implementation falls behind:**
- Reduce daily target from 10 to 5 cards
- Focus on Sets 1-2 only, defer Set 3
- Increase batch size for efficiency

**If systemic issues found:**
- Pause implementation
- Fix root cause in parser/types
- Re-validate previous cards
- Resume with improved process

## Success Criteria

### Must Have (Blocking)
- ✅ All 423 cards implemented
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

## Timeline Overview

| Phase | Duration | Focus | Deliverable |
|-------|----------|-------|-------------|
| **Preparation** | 2 days | Setup, subagents | Ready to implement |
| **Set 2 Actions** | 2 weeks | ~60 action cards | Set 2 Actions complete |
| **Set 2 Items** | 1 week | ~30 item cards | Set 2 Items complete |
| **Set 2 Characters** | 3 weeks | ~114 character cards | Set 2 complete |
| **Set 3 Actions+Items** | 2 weeks | ~100 cards | Set 3 Actions+Items complete |
| **Set 3 Characters** | 2 weeks | ~100 character cards | Set 3 complete |
| **Finalization** | 2 weeks | Validation, review | Production ready |

**Total**: ~14 weeks (3.5 months)

## Dependencies

### External Dependencies
- Lorcanito repo patterns (reference implementation)
- Ravensburger API (card data source)
- Official card database (validation)

### Internal Dependencies
- @tcg/lorcana-types (must remain stable)
- TestEngine (must support new card types)
- Parser v2 (must be extensible)

## Communication Plan

### Daily Updates
- Cards implemented count
- Parser coverage % (if changed)
- Blockers or issues

### Weekly Reports
- Progress vs. plan
- Top parser failures
- Improvement priorities
- Metrics dashboard update

### Milestone Reviews
- End of each set (Set 2, Set 3)
- Gauntlet full review
- Retrospective and process improvement

## Resource Requirements

### Technical Resources
- Bun runtime (package manager)
- Claude Code (AI agent system)
- GitHub Actions (CI/CD)
- TypeScript 5.9+ (language)

### Human Resources
- Plan reviewer (approve implementation approach)
- Occasional complex case handler (ambiguous patterns)
- Gauntlet reviewer (quality assurance)

### Compute Resources
- CI runner (GitHub Actions free tier sufficient)
- Local development machine (standard laptop)

## Alignment with Project Goals

This strategy aligns with the TCG Engines project goals:

| Project Goal | Strategy Alignment |
|--------------|-------------------|
| **AI-First Contribution** | Subagents do most work, humans guide |
| **TDD** | Tests written before implementation |
| **95%+ Coverage** | Every card has tests |
| **No Code Without Logs** | Memory Bank required for each card |
| **Architecture > Code Gen** | Focus on parser improvement, not just generating cards |

## Conclusion

This strategy balances **speed** (automation, batching) with **quality** (TDD, Gauntlet review) and **learning** (iterative parser improvement). By implementing in type-group order across sets, we build pattern libraries efficiently and feed learnings back into the system continuously.

The key insight is that **Set 1 is already complete**, allowing us to focus on Sets 2-3 with a proven foundation and clear path forward.
