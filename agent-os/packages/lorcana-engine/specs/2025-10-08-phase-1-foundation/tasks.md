# Spec Tasks

## Tasks

- [ ] 1. Fix Build Infrastructure and Import/Export Issues
  - [ ] 1.1 Write tests to verify all keyword ability exports resolve correctly
  - [ ] 1.2 Fix `challengerAbility` and other keyword ability export/import issues
  - [ ] 1.3 Audit and fix all circular dependency issues
  - [ ] 1.4 Verify all tests pass for lorcana-engine package specifically
  - [ ] 1.5 Verify linter rules pass for lorcana-engine package
  - [ ] 1.6 Verify type safety - run typecheck and iterate until it passes
  - [ ] 1.7 Use the code-reviewer subagent to review the fixes

- [ ] 2. Establish Test Pattern Documentation and Examples
  - [ ] 2.1 Write tests for test factory patterns (createTestGame, createTestCard, simulateTurn)
  - [ ] 2.2 Implement test factory utilities following CLAUDE.md patterns
  - [ ] 2.3 Create example test for quest move demonstrating behavior-driven testing
  - [ ] 2.4 Create example test for challenge move demonstrating behavior-driven testing
  - [ ] 2.5 Create example test for play card move demonstrating behavior-driven testing
  - [ ] 2.6 Document test patterns in testing-guide.md
  - [ ] 2.7 Verify all tests pass for lorcana-engine package
  - [ ] 2.8 Use the code-reviewer subagent to review the test patterns

- [ ] 3. Create Working Game Scenario Examples
  - [ ] 3.1 Write test for complete quest scenario (setup → quest → lore gain → validation)
  - [ ] 3.2 Implement quest scenario with proper game state management
  - [ ] 3.3 Write test for complete challenge scenario (setup → challenge → damage → banish → validation)
  - [ ] 3.4 Implement challenge scenario with proper damage resolution and game state check
  - [ ] 3.5 Write test for complete game from start to victory (full game flow reaching 20 lore)
  - [ ] 3.6 Implement complete game scenario demonstrating entire turn structure
  - [ ] 3.7 Verify all scenario tests pass for lorcana-engine package
  - [ ] 3.8 Use the code-reviewer subagent to review the scenario implementations

- [ ] 4. Audit Current Implementation Against Comprehensive Rules
  - [ ] 4.1 Create implementation-status.md template with rule sections 1-10
  - [ ] 4.2 Audit sections 1-2 (Concepts, Before the Game) - map to code and identify gaps
  - [ ] 4.3 Audit section 3 (Gameplay) - map to code and identify gaps
  - [ ] 4.4 Audit section 4 (Turn Structure) - map to code and identify gaps
  - [ ] 4.5 Audit sections 5-6 (Cards, Card Types) - map to code and identify gaps
  - [ ] 4.6 Audit section 7 (Abilities) - map to code and identify gaps
  - [ ] 4.7 Audit sections 8-10 (Zones, Damage, Keywords) - map to code and identify gaps
  - [ ] 4.8 Compile comprehensive gap analysis with priorities for future phases

- [ ] 5. Document Core Engine Integration and Patterns
  - [ ] 5.1 Document move implementation pattern with examples
  - [ ] 5.2 Document ability registration pattern with examples
  - [ ] 5.3 Document card definition pattern with examples
  - [ ] 5.4 Document game state extension pattern with examples
  - [ ] 5.5 Document segment and phase flow pattern with examples
  - [ ] 5.6 Identify and document framework gaps (effect resolution, timing, validation)
  - [ ] 5.7 Create framework-integration.md with current usage and identified gaps
  - [ ] 5.8 Use the code-reviewer subagent to review the documentation
