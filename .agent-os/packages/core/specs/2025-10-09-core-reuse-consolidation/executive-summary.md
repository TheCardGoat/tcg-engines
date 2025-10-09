# Executive Summary: Core Framework Reuse & Consolidation

## Problem Statement

The @tcg/core framework is not being fully leveraged by gundam-engine and lorcana-engine. Analysis reveals significant code duplication and missed reuse opportunities:

- **70% duplication** in zone operations between core and lorcana
- **~500 LOC** of card tooling infrastructure that lorcana would need to duplicate from gundam
- **~200 LOC** of test boilerplate per engine that could be eliminated
- **Two different API patterns** for the same functionality (zone management)

This creates:
- Higher maintenance burden (changes must be synchronized manually)
- Inconsistent patterns between games
- Longer development time for new games (1-2 days of infrastructure work)
- Risk of bugs from duplicated logic diverging

## Root Cause: The "Two Palettes" Problem

Analysis identified the two palettes mentioned:

### Palette 1: Core Framework (Infrastructure)
- Game engine orchestration
- Zone operations  
- Move system
- Delta synchronization
- Type system

### Palette 2: Game-Specific (Business Logic)
- Lorcana's lore/challenge mechanics
- Gundam's pilot pairing
- Card definitions
- Move implementations

**The Gap:** A missing "Infrastructure Utilities" layer that sits between core and games, providing:
- Testing utilities
- Card tooling infrastructure
- Common validators
- Shared patterns

Currently, games are forced to implement Palette 1 concerns (infrastructure) that should be provided by core.

## Proposed Solution

Consolidate reusable infrastructure into @tcg/core across 5 focus areas:

### 1. Zone Operations Unification
- Merge core and lorcana zone APIs
- Add missing operations: `isCardInZone`, `addCardToTop`, `clearZone`
- Support both Zone objects (sophisticated) and flat state (simple)
- **Impact:** Eliminate 300 LOC of duplication

### 2. Testing Utilities Package (`@tcg/core/testing`)
- Extract patterns from core integration tests
- Provide: `createTestEngine`, `expectMoveSuccess`, test factories
- Enable TDD with minimal boilerplate
- **Impact:** Reduce test boilerplate by 60%

### 3. Card Tooling Foundation (`@tcg/core/tooling`)
- Base classes: `CardParser`, `CardGenerator`, `FileWriter`
- Utilities: naming, formatting, file management
- Games extend with specific parsers
- **Impact:** Prevent 500 LOC duplication when lorcana adds tooling

### 4. Common Validators & Type Guards
- Type guard builder: `createTypeGuard(field, value)`
- Validator builder for runtime validation
- Consistent patterns across games
- **Impact:** Reduce 50 LOC boilerplate per engine

### 5. Comprehensive Documentation
- Guides for each utility area
- Migration guides for existing games
- Before/after examples
- **Impact:** Reduce onboarding time for new developers

## Business Impact

### Quantitative Benefits
- **1000+ LOC eliminated or prevented** from duplication
- **60% reduction in test boilerplate** (easier TDD)
- **1-2 days saved per new game** (infrastructure provided)
- **<5% performance impact** (acceptable for turn-based games)

### Qualitative Benefits
- **Consistency:** Single source of truth for common patterns
- **Maintainability:** Changes in one place benefit all games
- **Developer Experience:** Faster development, less boilerplate
- **Quality:** Well-tested core utilities reduce bugs
- **Scalability:** New games start from solid foundation

### Risk Mitigation
- **Backward compatibility** maintained during migration
- **Comprehensive testing** at every step (>95% coverage target)
- **Performance monitoring** throughout
- **Documentation-first** approach (guides written with code)
- **Incremental migration** (phase by phase)

## Implementation Plan

### 6-Week Timeline

**Phase 1 (Weeks 1-2): Core Enhancements**
- Extend zone operations
- Create testing utilities
- Build card tooling foundation
- Add validators

**Phase 2 (Week 3): Documentation**
- Write comprehensive guides
- Create examples
- Update README
- Migration guides

**Phase 3 (Week 4): Lorcana Migration**
- Migrate to core zones
- Adopt testing utilities
- Verify no regression

**Phase 4 (Week 5): Gundam Migration**
- Refactor card tools
- Adopt core utilities
- Verify correctness

**Phase 5 (Week 6): Validation & Polish**
- Static analysis (verify zero duplication)
- Performance benchmarking
- Integration testing
- Final review

### Success Criteria
✅ Zero zone operation duplication  
✅ >95% test coverage for new utilities  
✅ >60% test boilerplate reduction  
✅ <5% performance impact  
✅ 100% documentation coverage  
✅ Both games using core utilities  

## Architecture Decisions

### 1. Zone API: Objects + Flat State
Provide both patterns with adapters. Zone objects for sophisticated needs, flat state for simplicity.

### 2. Testing: Export Path (`@tcg/core/testing`)
Not separate package. Tree-shakeable, easier to maintain.

### 3. Card Tooling: Core Base Classes
Infrastructure in core, game-specific parsers extend base classes.

### 4. Validation: Hybrid (Runtime + Compile-time)
TypeScript types for development, Zod schemas for external data.

## Recommendations

### Immediate Actions
1. **Approve spec** and allocate 6-week timeline
2. **Assign engineer(s)** to Phase 1 implementation
3. **Schedule weekly reviews** to track progress

### Long-term Strategy
1. **Establish pattern:** New utilities added to core first
2. **Regular reviews:** Identify duplication quarterly
3. **Documentation culture:** Guides written with code
4. **Performance monitoring:** Benchmark all changes

### Future Considerations
- **Template engine** will benefit from these utilities immediately
- **New games** (e.g., Pokémon, Magic) will start with full infrastructure
- **UI libraries** could follow similar consolidation pattern
- **Network layer** could provide similar testing utilities

## Conclusion

This initiative addresses a critical gap in the core framework architecture. By consolidating reusable infrastructure, we:

1. **Reduce technical debt** (eliminate 1000+ LOC of duplication)
2. **Improve developer experience** (60% less boilerplate)
3. **Enable scalability** (new games start from solid foundation)
4. **Maintain quality** (single, well-tested implementations)

The "two palettes" problem is solved by clearly delineating:
- **Core Palette:** All reusable infrastructure (including new utilities)
- **Game Palette:** Only game-specific rules and mechanics

The 6-week investment will pay dividends immediately (lorcana and gundam benefit) and continuously (all future games benefit).

**Recommendation: Proceed with implementation.**

