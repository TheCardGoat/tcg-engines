# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-loop/spec.md

> Created: 2025-10-08
> Status: Ready for Implementation

## Tasks

### Phase 1: Foundation - Zone Management System

- [ ] 1. Implement Zone Management System
  - [ ] 1.1 Write tests for zone initialization and state management
  - [ ] 1.2 Write tests for zone capacity rules (Mobile Suit Zone max 5, G Zone max 10)
  - [ ] 1.3 Implement ZoneType enum and Zone interface with all 9 zones
  - [ ] 1.4 Implement zone state containers (cards array, metadata)
  - [ ] 1.5 Implement zone validators (capacity checks, card type restrictions)
  - [ ] 1.6 Implement zone query functions (getCardsInZone, getZoneCount)
  - [ ] 1.7 Implement zone mutation functions (addToZone, removeFromZone, moveCard)
  - [ ] 1.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 1.9 Verify linter rules pass for gundam-engine
  - [ ] 1.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 1.11 Use code-reviewer subagent to review the code

- [ ] 2. Implement Card Position & Orientation System
  - [ ] 2.1 Write tests for card position changes (deployed/set/exhausted states)
  - [ ] 2.2 Write tests for position validation rules (can't attack when exhausted, etc.)
  - [ ] 2.3 Implement CardPosition enum (deployed, set, exhausted, ready)
  - [ ] 2.4 Implement position state tracking on card instances
  - [ ] 2.5 Implement position transition functions (exhaust, ready, flip)
  - [ ] 2.6 Implement position validators for game actions
  - [ ] 2.7 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 2.8 Verify linter rules pass for gundam-engine
  - [ ] 2.9 Verify type safety (run typecheck, iterate until passes)
  - [ ] 2.10 Use code-reviewer subagent to review the code

### Phase 2: Resource & Cost System

- [ ] 3. Implement Resource Management System
  - [ ] 3.1 Write tests for resource generation (roll dice, +1 per main/hangar card)
  - [ ] 3.2 Write tests for resource spending and validation
  - [ ] 3.3 Write tests for insufficient resource error handling
  - [ ] 3.4 Implement ResourcePool state container (available, spent, sources)
  - [ ] 3.5 Implement resource generation logic (dice roll + card bonuses)
  - [ ] 3.6 Implement resource spending functions (spendResources, validateCost)
  - [ ] 3.7 Implement resource reset for turn end
  - [ ] 3.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 3.9 Verify linter rules pass for gundam-engine
  - [ ] 3.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 3.11 Use code-reviewer subagent to review the code

- [ ] 4. Implement Cost System & Payment
  - [ ] 4.1 Write tests for cost calculation (deployment costs, ability costs)
  - [ ] 4.2 Write tests for G cost payment from G Zone
  - [ ] 4.3 Write tests for cost reduction effects
  - [ ] 4.4 Implement Cost type (resource amount, G requirements, additional costs)
  - [ ] 4.5 Implement cost calculation functions (calculateDeploymentCost, calculateAbilityCost)
  - [ ] 4.6 Implement payment validation (canPayCost)
  - [ ] 4.7 Implement payment execution (payCost with resource + G Zone discard)
  - [ ] 4.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 4.9 Verify linter rules pass for gundam-engine
  - [ ] 4.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 4.11 Use code-reviewer subagent to review the code

### Phase 3: Core Move Implementations

- [ ] 5. Implement Draw Move
  - [ ] 5.1 Write tests for draw move (normal draw, multi-draw, deck empty handling)
  - [ ] 5.2 Write tests for deck depletion win condition trigger
  - [ ] 5.3 Implement DrawMove type and parameters (count, optional source)
  - [ ] 5.4 Implement draw execution (move cards from deck to hand)
  - [ ] 5.5 Implement deck empty edge case (trigger loss condition)
  - [ ] 5.6 Implement draw validators (can't draw if deck empty and rule requires it)
  - [ ] 5.7 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 5.8 Verify linter rules pass for gundam-engine
  - [ ] 5.9 Verify type safety (run typecheck, iterate until passes)
  - [ ] 5.10 Use code-reviewer subagent to review the code

- [ ] 6. Implement Deploy Move
  - [ ] 6.1 Write tests for deploy move (pilot, mobile suit, to main/hangar)
  - [ ] 6.2 Write tests for deploy validators (cost, zone capacity, card type)
  - [ ] 6.3 Write tests for Set deployment (face-down, reveal on battle)
  - [ ] 6.4 Implement DeployMove type (card, targetZone, position, faceDown)
  - [ ] 6.5 Implement deploy validators (validateDeploymentTarget)
  - [ ] 6.6 Implement deploy execution (pay cost, move card, set position)
  - [ ] 6.7 Implement Set deployment logic (face-down state, reveal mechanism)
  - [ ] 6.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 6.9 Verify linter rules pass for gundam-engine
  - [ ] 6.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 6.11 Use code-reviewer subagent to review the code

- [ ] 7. Implement Attack Move
  - [ ] 7.1 Write tests for attack declaration (valid attackers, targets)
  - [ ] 7.2 Write tests for attack validators (exhausted units can't attack, etc.)
  - [ ] 7.3 Write tests for direct attack vs unit attack
  - [ ] 7.4 Implement AttackMove type (attacker, target, isDirectAttack)
  - [ ] 7.5 Implement attack validators (canAttack, validateTarget)
  - [ ] 7.6 Implement attack declaration (exhaust attacker, mark target)
  - [ ] 7.7 Implement attack state setup for battle resolution
  - [ ] 7.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 7.9 Verify linter rules pass for gundam-engine
  - [ ] 7.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 7.11 Use code-reviewer subagent to review the code

- [ ] 8. Implement Other Core Moves
  - [ ] 8.1 Write tests for DiscardMove (from hand, cost payment, effect discard)
  - [ ] 8.2 Write tests for ActivateAbilityMove (ability costs, timing restrictions)
  - [ ] 8.3 Write tests for PassMove (pass priority, phase transitions)
  - [ ] 8.4 Implement DiscardMove (card, source, reason)
  - [ ] 8.5 Implement ActivateAbilityMove (card, ability, targets, costs)
  - [ ] 8.6 Implement PassMove (simple state transition)
  - [ ] 8.7 Implement move validators for each move type
  - [ ] 8.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 8.9 Verify linter rules pass for gundam-engine
  - [ ] 8.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 8.11 Use code-reviewer subagent to review the code

### Phase 4: Turn Flow & Phase Management

- [ ] 9. Implement Phase System
  - [ ] 9.1 Write tests for phase definitions (all 6 phases with rules)
  - [ ] 9.2 Write tests for phase transitions (linear order, no skipping)
  - [ ] 9.3 Write tests for phase-specific validators (moves allowed per phase)
  - [ ] 9.4 Implement Phase enum (build, deploy, battle, main, end, opponent-turn)
  - [ ] 9.5 Implement phase state tracking (currentPhase, phaseHistory)
  - [ ] 9.6 Implement phase transition logic (advancePhase, validatePhaseTransition)
  - [ ] 9.7 Implement phase-specific move validators (canPerformMoveInPhase)
  - [ ] 9.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 9.9 Verify linter rules pass for gundam-engine
  - [ ] 9.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 9.11 Use code-reviewer subagent to review the code

- [ ] 10. Implement Turn Management System
  - [ ] 10.1 Write tests for turn initialization (ready all units, resource generation)
  - [ ] 10.2 Write tests for turn progression (phase sequence, player switching)
  - [ ] 10.3 Write tests for turn counters and history
  - [ ] 10.4 Implement TurnState type (turnNumber, activePlayer, phase)
  - [ ] 10.5 Implement turn initialization (readyAllUnits, generateResources, draw)
  - [ ] 10.6 Implement turn progression (advanceTurn, switchActivePlayer)
  - [ ] 10.7 Implement turn cleanup (discard excess hand cards, reset temporary effects)
  - [ ] 10.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 10.9 Verify linter rules pass for gundam-engine
  - [ ] 10.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 10.11 Use code-reviewer subagent to review the code

### Phase 5: Battle System

- [ ] 11. Implement Battle Step 1: Declare Attack
  - [ ] 11.1 Write tests for attack declaration validation
  - [ ] 11.2 Write tests for attacker exhaustion
  - [ ] 11.3 Write tests for direct attack vs unit attack targeting
  - [ ] 11.4 Implement BattleState type (attacker, defender, step, context)
  - [ ] 11.5 Implement attack declaration logic (validateAttack, initiateBattle)
  - [ ] 11.6 Implement attacker exhaustion
  - [ ] 11.7 Implement battle state initialization
  - [ ] 11.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 11.9 Verify linter rules pass for gundam-engine
  - [ ] 11.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 11.11 Use code-reviewer subagent to review the code

- [ ] 12. Implement Battle Step 2: Declare Block
  - [ ] 12.1 Write tests for block declaration (valid blockers, must be ready)
  - [ ] 12.2 Write tests for no-block scenarios (direct attack proceeds)
  - [ ] 12.3 Write tests for blocker exhaustion
  - [ ] 12.4 Implement block validation (canBlock, validateBlocker)
  - [ ] 12.5 Implement block declaration (declareBlock, assignBlocker)
  - [ ] 12.6 Implement blocker exhaustion
  - [ ] 12.7 Implement no-block path (direct attack to base)
  - [ ] 12.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 12.9 Verify linter rules pass for gundam-engine
  - [ ] 12.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 12.11 Use code-reviewer subagent to review the code

- [ ] 13. Implement Battle Step 3: G Assist
  - [ ] 13.1 Write tests for G assist declaration (cost, timing, buffs)
  - [ ] 13.2 Write tests for both attacker and defender G assist
  - [ ] 13.3 Write tests for power/critical modifications from G cards
  - [ ] 13.4 Implement G assist validation (canAssist, hasSufficientG)
  - [ ] 13.5 Implement G assist declaration window (both players)
  - [ ] 13.6 Implement G assist cost payment (discard from G Zone)
  - [ ] 13.7 Implement G assist stat modifications (power, critical, abilities)
  - [ ] 13.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 13.9 Verify linter rules pass for gundam-engine
  - [ ] 13.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 13.11 Use code-reviewer subagent to review the code

- [ ] 14. Implement Battle Step 4: Damage Calculation
  - [ ] 14.1 Write tests for power comparison (attacker vs defender)
  - [ ] 14.2 Write tests for destruction determination (loser destroyed)
  - [ ] 14.3 Write tests for critical damage calculation
  - [ ] 14.4 Write tests for base damage when attack is unblocked
  - [ ] 14.5 Implement power comparison logic (comparePower)
  - [ ] 14.6 Implement destruction determination (determineDestroyedUnits)
  - [ ] 14.7 Implement critical damage calculation (calculateCriticalDamage)
  - [ ] 14.8 Implement base damage for direct attacks
  - [ ] 14.9 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 14.10 Verify linter rules pass for gundam-engine
  - [ ] 14.11 Verify type safety (run typecheck, iterate until passes)
  - [ ] 14.12 Use code-reviewer subagent to review the code

- [ ] 15. Implement Battle Step 5: Damage Resolution
  - [ ] 15.1 Write tests for unit destruction (move to junk pile)
  - [ ] 15.2 Write tests for base damage application (deck milling to damage zone)
  - [ ] 15.3 Write tests for triggered abilities on destruction
  - [ ] 15.4 Write tests for battle state cleanup
  - [ ] 15.5 Implement unit destruction (moveToJunkPile)
  - [ ] 15.6 Implement base damage resolution (millCardsToDamageZone)
  - [ ] 15.7 Implement destruction trigger system (on-destroy abilities)
  - [ ] 15.8 Implement battle cleanup (clearBattleState)
  - [ ] 15.9 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 15.10 Verify linter rules pass for gundam-engine
  - [ ] 15.11 Verify type safety (run typecheck, iterate until passes)
  - [ ] 15.12 Use code-reviewer subagent to review the code

### Phase 6: Win/Loss Conditions & Rules Management

- [ ] 16. Implement Win/Loss Condition System
  - [ ] 16.1 Write tests for Base destruction win condition (7+ damage to damage zone)
  - [ ] 16.2 Write tests for Deck-out loss condition (can't draw when required)
  - [ ] 16.3 Write tests for game state when win/loss occurs
  - [ ] 16.4 Implement win condition checkers (checkBaseDestruction, checkDeckOut)
  - [ ] 16.5 Implement game end state (GameResult type, winner, reason)
  - [ ] 16.6 Implement win/loss evaluation on state changes
  - [ ] 16.7 Implement game termination logic (stopGame, recordResult)
  - [ ] 16.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 16.9 Verify linter rules pass for gundam-engine
  - [ ] 16.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 16.11 Use code-reviewer subagent to review the code

- [ ] 17. Implement Game Rules Manager
  - [ ] 17.1 Write tests for move validation orchestration
  - [ ] 17.2 Write tests for timing rules (priority, response windows)
  - [ ] 17.3 Write tests for rule violation errors and error handling
  - [ ] 17.4 Implement RulesEngine interface (validateMove, validateGameState)
  - [ ] 17.5 Implement move validation orchestration (combine all validators)
  - [ ] 17.6 Implement timing rules (priority system, response windows)
  - [ ] 17.7 Implement rule violation error types and messages
  - [ ] 17.8 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 17.9 Verify linter rules pass for gundam-engine
  - [ ] 17.10 Verify type safety (run typecheck, iterate until passes)
  - [ ] 17.11 Use code-reviewer subagent to review the code

### Phase 7: Integration & End-to-End Testing

- [ ] 18. Implement Complete Game Loop Integration
  - [ ] 18.1 Write integration tests for full turn cycle (all phases)
  - [ ] 18.2 Write integration tests for complete battle sequence (all 5 steps)
  - [ ] 18.3 Write integration tests for multi-turn game scenarios
  - [ ] 18.4 Write integration tests for win/loss condition triggering
  - [ ] 18.5 Integrate all systems (zones, moves, phases, battles, resources)
  - [ ] 18.6 Implement game loop orchestrator (processMove, advanceGameState)
  - [ ] 18.7 Implement state consistency validators (validateGameState)
  - [ ] 18.8 Implement game event logging for debugging
  - [ ] 18.9 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 18.10 Verify linter rules pass for gundam-engine
  - [ ] 18.11 Verify type safety (run typecheck, iterate until passes)
  - [ ] 18.12 Use code-reviewer subagent to review the code

- [ ] 19. Implement End-to-End Game Scenarios
  - [ ] 19.1 Write E2E test: Complete game from setup to base destruction win
  - [ ] 19.2 Write E2E test: Game ending in deck-out loss
  - [ ] 19.3 Write E2E test: Complex multi-battle turn with G assists
  - [ ] 19.4 Write E2E test: Resource management across multiple turns
  - [ ] 19.5 Write E2E test: Zone capacity management and full boards
  - [ ] 19.6 Implement test fixtures for common game scenarios
  - [ ] 19.7 Implement test helpers for game state validation
  - [ ] 19.8 Document E2E test patterns for future card implementations
  - [ ] 19.9 Verify all tests for gundam-engine pass (monorepo - don't run full suite)
  - [ ] 19.10 Verify linter rules pass for gundam-engine
  - [ ] 19.11 Verify type safety (run typecheck, iterate until passes)
  - [ ] 19.12 Use code-reviewer subagent to review the code

- [ ] 20. Final Documentation & Code Quality
  - [ ] 20.1 Review all inline code documentation (JSDoc/TSDoc)
  - [ ] 20.2 Create or update API documentation for core game loop
  - [ ] 20.3 Document architecture decisions and design patterns
  - [ ] 20.4 Create developer guide for extending the game loop
  - [ ] 20.5 Ensure all public APIs have proper type exports
  - [ ] 20.6 Run full test suite with coverage report
  - [ ] 20.7 Verify all linter rules pass for gundam-engine
  - [ ] 20.8 Verify type safety (run typecheck, iterate until passes)
  - [ ] 20.9 Use code-reviewer subagent for final review
  - [ ] 20.10 Update spec.md with implementation status and any spec changes

## Implementation Notes

### TDD Approach
- **Test First**: Every major task starts with writing comprehensive tests
- **Red-Green-Refactor**: Write failing tests, make them pass, then refactor
- **Verification Steps**: Each task ends with running tests, linter, typecheck, and code review

### Technical Dependencies
Tasks are ordered to respect dependencies:
1. **Foundation First**: Zones and card positioning must exist before anything else
2. **Resources Second**: Cost and resource systems needed before moves that spend resources
3. **Moves Third**: Core actions that manipulate game state
4. **Flow Fourth**: Turn and phase management orchestrate the moves
5. **Battle Fifth**: Complex multi-step sequence built on established foundation
6. **Rules Sixth**: Win conditions and rule validation layer on top
7. **Integration Last**: Full system integration and E2E scenarios

### Monorepo Test Execution
- Always run tests scoped to `gundam-engine` package only
- Use package-specific test commands to avoid running entire monorepo suite
- Example: `npm test -- packages/gundam-engine` or `pnpm test --filter @tcg/gundam-engine`

### Code Quality Gates
Each task must pass:
1. All package-specific tests (100% pass rate)
2. Linter rules (no warnings or errors)
3. TypeScript strict mode compilation (no type errors)
4. Code review by code-reviewer subagent (address all feedback)

### Iteration Process
- If any verification step fails, iterate on the implementation
- Don't proceed to next task until all verification steps pass
- Document any blockers or spec clarifications needed
