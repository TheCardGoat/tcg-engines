# Spec Tasks

## Tasks

- [ ] 1. Setup Test Infrastructure and Helper Utilities
  - [ ] 1.1 Write tests for test helper utilities (assertion helpers, scenario builders)
  - [ ] 1.2 Create test helper utilities in `__tests__/helpers/` directory
  - [ ] 1.3 Create test data index cataloging all real cards by characteristics (HP ranges, keywords, costs, etc.)
  - [ ] 1.4 Verify all tests for gundam-engine pass: `bun test packages/engines/core-engine/src/game-engine/engines/gundam`
  - [ ] 1.5 Verify linter rules pass for gundam-engine: `bunx @biomejs/biome check --fix packages/engines/core-engine/src/game-engine/engines/gundam`
  - [ ] 1.6 Verify type safety, run typecheck: `bun run check-types --filter=@tcg/core-engine`
  - [ ] 1.7 Use the code-reviewer subagent to review the helper utilities code
  - [ ] 1.8 Update tasks.md and mark task 1 as complete

- [ ] 2. Implement Game Overview Rules Tests (LLM-RULES Section 1)
  - [ ] 2.1 Write tests for Section 1 rules: win conditions, defeat conditions, card effects override rules
  - [ ] 2.2 Implement tests in `__tests__/rules/01-game-overview.test.ts` using real cards from card catalog
  - [ ] 2.3 Verify all tests for gundam-engine pass
  - [ ] 2.4 Verify linter rules pass for gundam-engine
  - [ ] 2.5 Verify type safety passes
  - [ ] 2.6 Use the code-reviewer subagent to review the test code
  - [ ] 2.7 Update tasks.md and mark task 2 as complete

- [ ] 3. Implement Card Information Rules Tests (LLM-RULES Section 2)
  - [ ] 3.1 Write tests for Section 2 rules: card types (Unit, Pilot, Command, Base, Resource), colors, and basic card properties
  - [ ] 3.2 Implement tests in `__tests__/rules/02-card-information.test.ts` using diverse real cards
  - [ ] 3.3 Verify all tests for gundam-engine pass
  - [ ] 3.4 Verify linter rules pass for gundam-engine
  - [ ] 3.5 Verify type safety passes
  - [ ] 3.6 Use the code-reviewer subagent to review the test code
  - [ ] 3.7 Update tasks.md and mark task 3 as complete

- [ ] 4. Implement Game Locations Rules Tests (LLM-RULES Section 3)
  - [ ] 4.1 Write tests for Section 3 rules: zone visibility, zone limits (15 resources, 5 EX resources, 6 units, 10 hand), card movement between zones
  - [ ] 4.2 Implement tests in `__tests__/rules/03-game-locations.test.ts` using real cards
  - [ ] 4.3 Verify all tests for gundam-engine pass
  - [ ] 4.4 Verify linter rules pass for gundam-engine
  - [ ] 4.5 Verify type safety passes
  - [ ] 4.6 Use the code-reviewer subagent to review the test code
  - [ ] 4.7 Update tasks.md and mark task 4 as complete

- [ ] 5. Implement Essential Terminology Rules Tests (LLM-RULES Section 4)
  - [ ] 5.1 Write tests for Section 4 rules: Active/Standby player, Active/Rested state, damage types, HP recovery, Play/Deploy/Pair, Destroy/Discard/Remove, tokens, counters
  - [ ] 5.2 Implement tests in `__tests__/rules/04-terminology.test.ts` using real cards
  - [ ] 5.3 Verify all tests for gundam-engine pass
  - [ ] 5.4 Verify linter rules pass for gundam-engine
  - [ ] 5.5 Verify type safety passes
  - [ ] 5.6 Use the code-reviewer subagent to review the test code
  - [ ] 5.7 Update tasks.md and mark task 5 as complete

- [ ] 6. Implement Preparing to Play Rules Tests (LLM-RULES Section 5)
  - [ ] 6.1 Write tests for Section 5 rules: deck construction (50 cards, 1-2 colors, max 4 copies), resource deck (10 cards), starting setup (5 card hand, redraw, 6 shields, EX Base, Player Two EX Resource)
  - [ ] 6.2 Implement tests in `__tests__/rules/05-preparing-to-play.test.ts` using real cards for deck construction
  - [ ] 6.3 Verify all tests for gundam-engine pass
  - [ ] 6.4 Verify linter rules pass for gundam-engine
  - [ ] 6.5 Verify type safety passes
  - [ ] 6.6 Use the code-reviewer subagent to review the test code
  - [ ] 6.7 Update tasks.md and mark task 6 as complete

- [ ] 7. Implement Game Progression Rules Tests (LLM-RULES Section 6)
  - [ ] 7.1 Write tests for Section 6 rules: Start phase (Active step, Start step), Draw phase, Resource phase, Main phase, End phase (Action step, End step, Hand step, Cleanup step)
  - [ ] 7.2 Implement tests in `__tests__/rules/06-game-progression.test.ts` using real cards
  - [ ] 7.3 Verify all tests for gundam-engine pass
  - [ ] 7.4 Verify linter rules pass for gundam-engine
  - [ ] 7.5 Verify type safety passes
  - [ ] 7.6 Use the code-reviewer subagent to review the test code
  - [ ] 7.7 Update tasks.md and mark task 7 as complete

- [ ] 8. Implement Combat Rules Tests (LLM-RULES Section 7)
  - [ ] 8.1 Write tests for Section 7 rules: Attack step (declare target), Block step (<Blocker>), Action step, Damage step (player vs rested unit), Battle end step
  - [ ] 8.2 Implement tests in `__tests__/rules/07-combat.test.ts` using real units with various keywords
  - [ ] 8.3 Verify all tests for gundam-engine pass
  - [ ] 8.4 Verify linter rules pass for gundam-engine
  - [ ] 8.5 Verify type safety passes
  - [ ] 8.6 Use the code-reviewer subagent to review the test code
  - [ ] 8.7 Update tasks.md and mark task 8 as complete

- [ ] 9. Implement Action Steps Rules Tests (LLM-RULES Section 8)
  - [ ] 9.1 Write tests for Section 8 rules: taking turns (standby player first), activating Action cards/effects, passing priority, consecutive passes ending action step
  - [ ] 9.2 Implement tests in `__tests__/rules/08-action-steps.test.ts` using real Action cards
  - [ ] 9.3 Verify all tests for gundam-engine pass
  - [ ] 9.4 Verify linter rules pass for gundam-engine
  - [ ] 9.5 Verify type safety passes
  - [ ] 9.6 Use the code-reviewer subagent to review the test code
  - [ ] 9.7 Update tasks.md and mark task 9 as complete

- [ ] 10. Implement Effect System Rules Tests (LLM-RULES Section 9)
  - [ ] 10.1 Write tests for Section 9 rules: effect types (Constant, Triggered, Activated, Command, Substitution), priority order, target selection requirements
  - [ ] 10.2 Implement tests in `__tests__/rules/09-effects.test.ts` using real cards with diverse effect types
  - [ ] 10.3 Verify all tests for gundam-engine pass
  - [ ] 10.4 Verify linter rules pass for gundam-engine
  - [ ] 10.5 Verify type safety passes
  - [ ] 10.6 Use the code-reviewer subagent to review the test code
  - [ ] 10.7 Update tasks.md and mark task 10 as complete

- [ ] 11. Implement Rules Management Tests (LLM-RULES Section 10)
  - [ ] 11.1 Write tests for Section 10 rules: automatic processes, defeat conditions, destruction management (0 HP), battle area excess (6 max), shield base excess (1 max)
  - [ ] 11.2 Implement tests in `__tests__/rules/10-rules-management.test.ts` using real cards
  - [ ] 11.3 Verify all tests for gundam-engine pass
  - [ ] 11.4 Verify linter rules pass for gundam-engine
  - [ ] 11.5 Verify type safety passes
  - [ ] 11.6 Use the code-reviewer subagent to review the test code
  - [ ] 11.7 Update tasks.md and mark task 11 as complete

- [ ] 12. Implement Keyword Effects Tests (LLM-RULES Section 11)
  - [ ] 12.1 Write tests for all keyword effects: <Repair>, <Breach>, <Support>, <Blocker>, <First Strike>, <High-Maneuver>
  - [ ] 12.2 Write tests for all keywords: 【Activate･Main】, 【Activate･Action】, 【Main】, 【Action】, 【Burst】, 【Deploy】, 【Attack】, 【Destroyed】, 【When Paired】, 【During Pair】, 【Pilot】, 【Once per Turn】
  - [ ] 12.3 Implement tests in `__tests__/rules/11-keywords.test.ts` using real cards with these keywords
  - [ ] 12.4 Verify all tests for gundam-engine pass
  - [ ] 12.5 Verify linter rules pass for gundam-engine
  - [ ] 12.6 Verify type safety passes
  - [ ] 12.7 Use the code-reviewer subagent to review the test code
  - [ ] 12.8 Update tasks.md and mark task 12 as complete

- [ ] 13. Implement ST01 Card Tests - Units
  - [ ] 13.1 Write tests for all ST01 unit cards (001-Gundam, 002-Gundam MA Form, 003-Guncannon, 004-Guntank, 005-GM, 006-Aerial Permet Score 6, 007-Aerial Bit On Form, 008-Demi Trainer, 009-Zowort)
  - [ ] 13.2 Implement tests co-located with card definitions in `cards/definitions/ST01/units/*.test.ts`
  - [ ] 13.3 Test each unit's unique abilities, keywords, and interactions
  - [ ] 13.4 Verify all tests for gundam-engine pass
  - [ ] 13.5 Verify linter rules pass for gundam-engine
  - [ ] 13.6 Verify type safety passes
  - [ ] 13.7 Use the code-reviewer subagent to review the test code
  - [ ] 13.8 Update tasks.md and mark task 13 as complete

- [ ] 14. Implement ST01 Card Tests - Pilots and Commands
  - [ ] 14.1 Write tests for all ST01 pilot cards (010-Amuro Ray, 011-Suletta Mercury) testing pairing mechanics
  - [ ] 14.2 Write tests for all ST01 command cards (012-Thoroughly Damaged, 013-Kai's Resolve, 014-Unforeseen Incident, 100-A Show of Resolve)
  - [ ] 14.3 Implement tests co-located with card definitions
  - [ ] 14.4 Verify all tests for gundam-engine pass
  - [ ] 14.5 Verify linter rules pass for gundam-engine
  - [ ] 14.6 Verify type safety passes
  - [ ] 14.7 Use the code-reviewer subagent to review the test code
  - [ ] 14.8 Update tasks.md and mark task 14 as complete

- [ ] 15. Implement ST01 Card Tests - Bases and Complete Set
  - [ ] 15.1 Write tests for all ST01 base cards (015-White Base, 016-Asticassia School of Technology)
  - [ ] 15.2 Verify complete ST01 set coverage (all cards tested)
  - [ ] 15.3 Verify all tests for gundam-engine pass
  - [ ] 15.4 Verify linter rules pass for gundam-engine
  - [ ] 15.5 Verify type safety passes
  - [ ] 15.6 Use the code-reviewer subagent to review the test code
  - [ ] 15.7 Update tasks.md and mark task 15 as complete

- [ ] 16. Implement ST02 Card Tests
  - [ ] 16.1 Write tests for all ST02 cards following same pattern as ST01
  - [ ] 16.2 Implement tests co-located with card definitions in `cards/definitions/ST02/`
  - [ ] 16.3 Test unique abilities and keyword interactions
  - [ ] 16.4 Verify all tests for gundam-engine pass
  - [ ] 16.5 Verify linter rules pass for gundam-engine
  - [ ] 16.6 Verify type safety passes
  - [ ] 16.7 Use the code-reviewer subagent to review the test code
  - [ ] 16.8 Update tasks.md and mark task 16 as complete

- [ ] 17. Implement ST03 Card Tests
  - [ ] 17.1 Write tests for all ST03 cards following same pattern
  - [ ] 17.2 Implement tests co-located with card definitions in `cards/definitions/ST03/`
  - [ ] 17.3 Test unique abilities and keyword interactions
  - [ ] 17.4 Verify all tests for gundam-engine pass
  - [ ] 17.5 Verify linter rules pass for gundam-engine
  - [ ] 17.6 Verify type safety passes
  - [ ] 17.7 Use the code-reviewer subagent to review the test code
  - [ ] 17.8 Update tasks.md and mark task 17 as complete

- [ ] 18. Implement ST04 Card Tests
  - [ ] 18.1 Write tests for all ST04 cards following same pattern
  - [ ] 18.2 Implement tests co-located with card definitions in `cards/definitions/ST04/`
  - [ ] 18.3 Test unique abilities and keyword interactions
  - [ ] 18.4 Verify all tests for gundam-engine pass
  - [ ] 18.5 Verify linter rules pass for gundam-engine
  - [ ] 18.6 Verify type safety passes
  - [ ] 18.7 Use the code-reviewer subagent to review the test code
  - [ ] 18.8 Update tasks.md and mark task 18 as complete

- [ ] 19. Implement GD01 Card Tests
  - [ ] 19.1 Write tests for all GD01 cards following same pattern
  - [ ] 19.2 Implement tests co-located with card definitions in `cards/definitions/GD01/`
  - [ ] 19.3 Test unique abilities and keyword interactions
  - [ ] 19.4 Verify all tests for gundam-engine pass
  - [ ] 19.5 Verify linter rules pass for gundam-engine
  - [ ] 19.6 Verify type safety passes
  - [ ] 19.7 Use the code-reviewer subagent to review the test code
  - [ ] 19.8 Update tasks.md and mark task 19 as complete

- [ ] 20. Implement Integration Tests - Complex Combat Scenarios
  - [ ] 20.1 Write tests for complex combat scenarios: multi-unit battles, blocker chains, first strike interactions, high-maneuver vs blocker
  - [ ] 20.2 Implement tests in `__tests__/integration/combat-scenarios.test.ts` using real cards with relevant keywords
  - [ ] 20.3 Verify all tests for gundam-engine pass
  - [ ] 20.4 Verify linter rules pass for gundam-engine
  - [ ] 20.5 Verify type safety passes
  - [ ] 20.6 Use the code-reviewer subagent to review the test code
  - [ ] 20.7 Update tasks.md and mark task 20 as complete

- [ ] 21. Implement Integration Tests - Complete Game Flows
  - [ ] 21.1 Write tests for complete game scenarios: beginner game start to finish, advanced card combos, tournament-level plays
  - [ ] 21.2 Implement tests in `__tests__/integration/complete-game.test.ts` and `__tests__/scenarios/` using real decks
  - [ ] 21.3 Verify all tests for gundam-engine pass
  - [ ] 21.4 Verify linter rules pass for gundam-engine
  - [ ] 21.5 Verify type safety passes
  - [ ] 21.6 Use the code-reviewer subagent to review the test code
  - [ ] 21.7 Update tasks.md and mark task 21 as complete

- [ ] 22. Implement Integration Tests - Edge Cases and Multi-Player Priority
  - [ ] 22.1 Write tests for edge cases: zone limits reached, multiple simultaneous effects, effect resolution order conflicts
  - [ ] 22.2 Write tests for priority handling: action step turns, multiple players passing, standby player priority
  - [ ] 22.3 Implement tests in `__tests__/integration/edge-cases.test.ts` and `__tests__/integration/multi-player.test.ts`
  - [ ] 22.4 Verify all tests for gundam-engine pass
  - [ ] 22.5 Verify linter rules pass for gundam-engine
  - [ ] 22.6 Verify type safety passes
  - [ ] 22.7 Use the code-reviewer subagent to review the test code
  - [ ] 22.8 Update tasks.md and mark task 22 as complete

- [ ] 23. Create Test Documentation and Final Verification
  - [ ] 23.1 Write README.md in `__tests__/` directory explaining test organization, patterns, and conventions
  - [ ] 23.2 Document test utilities and helper functions with JSDoc
  - [ ] 23.3 Create test coverage summary report mapping rules to test files
  - [ ] 23.4 Verify ALL tests for gundam-engine pass with full suite
  - [ ] 23.5 Verify linter rules pass for entire gundam-engine
  - [ ] 23.6 Verify type safety passes for entire gundam-engine
  - [ ] 23.7 Use the code-reviewer subagent to review documentation
  - [ ] 23.8 Update tasks.md and mark task 23 as complete

## Notes

- **Real Cards First**: Always prefer using real cards from the card catalog. Only create mock cards when no real card exists matching required characteristics.
- **Test Independence**: Each test must be independent and use its own GundamTestEngine instance.
- **No Skipped Tests**: Do not use `.skip()` on any tests in the main branch. All tests must pass.
- **Deterministic**: Use the same seed for RNG to ensure reproducible test results.
- **TDD Approach**: Write tests first for each task before implementing or verifying functionality.
