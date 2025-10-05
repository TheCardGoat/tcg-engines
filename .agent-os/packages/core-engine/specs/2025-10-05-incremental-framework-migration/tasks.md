# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-05-incremental-framework-migration/spec.md

> Created: 2025-10-05
> Status: Ready for Implementation

## Tasks

### Phase 1: Preparation and Setup

- [ ] Review all 27 action card test files to understand scope
- [ ] Verify what cards are being importedd and not present in the new project, copy the entire card definition from the old project to the new project.
- [ ] Document current framework capabilities baseline
- [ ] Create tracking sheet for card migration progress

### Phase 2: Migration Execution (Per Card - 27 iterations)

For each of the 27 action cards, complete:

- [ ] Select next action card test file
- [ ] Analyze test imports for character/item dependencies
- [ ] Check if required card stubs exist in new project
- [ ] Add stubs to appropriate set files (002, 008, etc.)
- [ ] Run test to identify framework gaps
- [ ] Implement framework features test-first (Red-Green-Refactor)
- [ ] Verify test passes with all assertions satisfied
- [ ] Confirm card stubs are minimal (no complex abilities)
- [ ] Document any new patterns or framework features
- [ ] Request human confirmation before next card

### Phase 3: Framework Features (Test-Driven)

Implement framework features as required by tests:

- [ ] Identify missing game mechanics from test failures
- [ ] Implement game state management features (if needed)
- [ ] Add card effect system capabilities (if needed)
- [ ] Implement turn/phase mechanics (if needed)
- [ ] Add player action handling (if needed)
- [ ] Implement zone management improvements (if needed)
- [ ] Add combat/challenge mechanics (if needed)
- [ ] Implement ability triggering system (if needed)

**Note:** Do not implement framework features speculatively. Only add what tests require.

### Phase 4: Validation and Documentation

- [ ] Verify all 27 action card tests pass
- [ ] Review all created card stubs for consistency
- [ ] Audit framework features to ensure all are test-driven
- [ ] Remove any unused or speculative code
- [ ] Document migration patterns for future use
- [ ] Create guide for applying pattern to remaining sets
- [ ] Prepare summary of framework features added

### Phase 5: Handoff and Next Steps

- [ ] Create migration pattern documentation
- [ ] Identify remaining sets to migrate
- [ ] Estimate effort for remaining migrations
- [ ] Document lessons learned
- [ ] Prepare recommendations for future migrations
