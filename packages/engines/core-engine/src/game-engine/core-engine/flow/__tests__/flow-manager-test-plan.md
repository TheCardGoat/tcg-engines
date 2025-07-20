# Flow Manager Test Implementation Plan

## Overview

This document outlines the comprehensive testing strategy to ensure 100% coverage of the Flow Manager Specification. The plan is organized by implementation phases, with each phase building upon the previous one.

## Implementation Phases

### Phase 1: Foundation & Mocks (Priority: HIGH)
**Goal**: Create reusable test infrastructure

- [ ] `flow-manager-test-mocks.ts` - Comprehensive mock configurations
- [ ] Mock game states for different scenarios (2-player, 4-player, etc.)
- [ ] Mock core operations with spy capabilities
- [ ] Reusable game definitions for common patterns

**Dependencies**: None
**Estimated Effort**: 1-2 days

### Phase 2: Core Hierarchical Transitions (Priority: HIGH)
**Goal**: Test the fundamental hierarchy: Segment → Turn → Phase → Step

**Segment Transitions**:
- [ ] Segment endIf conditions triggering transitions
- [ ] Segment onBegin/onEnd hook execution
- [ ] Segment next as function (conditional)
- [ ] Player reset to first player on segment change

**Turn Management**:
- [ ] Turn player advancement on completion
- [ ] Turn count increment and cycling
- [ ] Turn vs priority player distinction
- [ ] Turn-based effects triggering correctly

**Dependencies**: Phase 1
**Estimated Effort**: 2-3 days

### Phase 3: Hook System & State Management (Priority: HIGH)
**Goal**: Validate hook execution order and state consistency

**Hook Execution**:
- [ ] onBegin → endIf → onEnd execution order
- [ ] onBegin called when entering states
- [ ] onBegin NOT called for same-state transitions
- [ ] Hook return values updating game state

**State Consistency**:
- [ ] Context updates across transitions
- [ ] fnContext._getUpdatedState behavior
- [ ] numMoves, currentTurn, currentPlayer tracking

**Dependencies**: Phase 2
**Estimated Effort**: 2 days

### Phase 4: Move System Integration (Priority: HIGH)
**Goal**: Test move availability and inheritance hierarchy

**Move Inheritance**:
- [ ] Global moves available everywhere
- [ ] Segment moves available in all child phases/steps
- [ ] Phase moves available in all child steps
- [ ] Step moves available only in specific step
- [ ] Move resolution hierarchy and conflicts

**Dependencies**: Phase 3
**Estimated Effort**: 1-2 days

### Phase 5: Advanced Features (Priority: MEDIUM)
**Goal**: Test conditional transitions and complex scenarios

**Conditional Transitions**:
- [ ] Phase next as function with complex conditions
- [ ] Step next as function with game state logic
- [ ] Dynamic flow control based on game state

**Priority Management**:
- [ ] canPlayerAct validation
- [ ] allowAnyPlayerToAct phase configuration
- [ ] Priority shifts without turn changes

**Dependencies**: Phase 4
**Estimated Effort**: 2-3 days

### Phase 6: Manual Navigation API (Priority: MEDIUM)
**Goal**: Test programmatic flow control

**Navigation Methods**:
- [ ] setSegment navigation
- [ ] setPhase navigation
- [ ] setStep navigation
- [ ] jumpTo with multiple parameters
- [ ] onBegin hooks during manual navigation

**Dependencies**: Phase 5
**Estimated Effort**: 1-2 days

### Phase 7: Real Game Scenarios (Priority: MEDIUM)
**Goal**: Test complex, realistic game flows

**Complex Scenarios**:
- [ ] Alpha Clash expansion phase with sequential steps
- [ ] Grand Archive multiplayer setup flow
- [ ] Combat phase with priority windows
- [ ] Tournament format variations

**Dependencies**: Phase 6
**Estimated Effort**: 2-3 days

### Phase 8: Edge Cases & Error Handling (Priority: LOW)
**Goal**: Test boundary conditions and error scenarios

**Edge Cases**:
- [ ] Missing segment configurations
- [ ] Invalid phase transitions
- [ ] Phase loops (next pointing to same phase)
- [ ] null/undefined next values
- [ ] Malformed game definitions

**Dependencies**: Phase 7
**Estimated Effort**: 1-2 days

## Test File Organization

### Main Test Files
```
flow/__tests__/
├── flow-manager.test.ts                    # Existing basic tests
├── flow-manager-test-mocks.ts             # Shared mocks and utilities
├── flow-manager-segments.test.ts          # Segment-level tests
├── flow-manager-turns.test.ts             # Turn management tests
├── flow-manager-hooks.test.ts             # Hook system tests
├── flow-manager-moves.test.ts             # Move inheritance tests
├── flow-manager-navigation.test.ts        # Manual navigation tests
├── flow-manager-scenarios.test.ts         # Real game scenarios
└── flow-manager-edge-cases.test.ts        # Edge cases and errors
```

### Test Utilities Structure
```typescript
// flow-manager-test-mocks.ts
export const MockConfigurations = {
  // Basic configurations
  twoPlayerGame: { ... },
  fourPlayerGame: { ... },
  
  // Scenario-specific configurations
  alphaClashExpansion: { ... },
  grandArchiveSetup: { ... },
  combatPhaseFlow: { ... },
  
  // Edge case configurations
  infiniteLoop: { ... },
  missingConfigs: { ... }
};

export const MockGameStates = {
  initial: () => CoreEngineState<TestGameState>,
  midGame: () => CoreEngineState<TestGameState>,
  endGame: () => CoreEngineState<TestGameState>
};

export const MockHooks = {
  spyOnBegin: () => jest.Mock,
  spyOnEnd: () => jest.Mock,
  spyEndIf: (returnValue: boolean) => jest.Mock
};
```

## Success Criteria

### Coverage Metrics
- [ ] 100% coverage of Flow Manager public API
- [ ] All specification examples have corresponding tests
- [ ] All hook combinations tested
- [ ] All transition types validated

### Quality Gates
- [ ] All tests pass consistently
- [ ] No flaky tests (run 10x without failures)
- [ ] Test execution time < 5 seconds total
- [ ] Clear, descriptive test names
- [ ] Comprehensive error messages on failures

### Documentation
- [ ] Each test file has clear purpose documentation
- [ ] Complex test scenarios have explanatory comments
- [ ] Mock configurations are well-documented
- [ ] Test failure debugging guide

## Implementation Guidelines

### Test Structure
```typescript
describe('FlowManager - [Feature Area]', () => {
  let flowManager: FlowManager<TestGameState>;
  let mockHooks: MockHookSet;
  
  beforeEach(() => {
    // Setup with appropriate mock configuration
    mockHooks = createMockHooks();
    flowManager = new FlowManager(
      createGameDefinition(mockHooks),
      {}
    );
  });
  
  describe('[Specific Behavior]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange - Set up initial state
      // Act - Execute the behavior
      // Assert - Verify results and hook calls
    });
  });
});
```

### Naming Conventions
- Test files: `flow-manager-[area].test.ts`
- Test suites: `'FlowManager - [Feature Area]'`
- Test cases: `'should [behavior] when [condition]'`
- Mock objects: `Mock[Purpose]` (e.g., `MockAlphaClashGame`)

### Assertion Patterns
- Always verify both state changes AND hook calls
- Use specific matchers for better error messages
- Test negative cases (what should NOT happen)
- Verify transition order and timing

## Estimated Timeline

**Total Estimated Effort**: 12-16 days
- Phase 1: 1-2 days
- Phase 2: 2-3 days  
- Phase 3: 2 days
- Phase 4: 1-2 days
- Phase 5: 2-3 days
- Phase 6: 1-2 days
- Phase 7: 2-3 days
- Phase 8: 1-2 days

**Recommended Schedule**: 2-3 weeks with 1-2 phases per week

## Risk Mitigation

### Technical Risks
- **Mock complexity**: Start simple, add complexity incrementally
- **Test interdependence**: Keep tests isolated and independent
- **Performance**: Monitor test execution time, optimize if needed

### Process Risks
- **Scope creep**: Stick to specification requirements
- **Test quality**: Regular code reviews and pair programming
- **Maintenance**: Keep mocks DRY and well-organized

## Success Tracking

Track progress using the TODO list items:
- [ ] Mark items as "in_progress" when starting
- [ ] Mark items as "completed" when tests pass
- [ ] Add new items if gaps are discovered
- [ ] Regular progress reviews after each phase 