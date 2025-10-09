# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/packages/lorcana-engine/specs/2025-10-09-e2e-test-coverage/spec.md

> Created: 2025-10-09
> Status: Ready for Implementation

## Tasks

### Task 1: Core Game Flow and Turn Structure Tests

Implement comprehensive tests for game initialization, turn phases, and fundamental game mechanics that form the foundation for all other tests.

- [ ] 1.1 Write tests for game initialization (deck setup, starting hand, inkwell initialization, player order)
- [ ] 1.2 Write tests for turn structure (ready phase, set phase, main phase, end phase transitions)
- [ ] 1.3 Write tests for draw mechanics (turn draw, empty deck handling, deck-out loss condition)
- [ ] 1.4 Write tests for ink mechanics (adding cards to inkwell, ink availability, exerted/ready ink states)
- [ ] 1.5 Write tests for basic card playing (paying costs, card entering play, illegal play prevention)
- [ ] 1.6 Implement all game flow tests, removing any .skip() placeholders
- [ ] 1.7 Verify all tests pass for the lorcana-engine package (`bun test packages/lorcana-engine`)
- [ ] 1.8 Verify linter rules pass for the package (`bun run lint packages/lorcana-engine`)
- [ ] 1.9 Verify type safety with typecheck (`bun run typecheck`)
- [ ] 1.10 Use code-reviewer subagent to review the code
- [ ] 1.11 Update tasks.md to mark task as complete

### Task 2: Keyword Mechanics Testing

Complete tests for all 12 keyword abilities in Lorcana, ensuring each keyword's rules are correctly implemented as building blocks for card abilities.

- [ ] 2.1 Write tests for Bodyguard keyword (forced challenging, interaction with other mechanics)
- [ ] 2.2 Write tests for Challenger keyword (challenge bonus damage calculations)
- [ ] 2.3 Write tests for Evasive keyword (cannot be challenged by non-evasive characters)
- [ ] 2.4 Write tests for Reckless keyword (can challenge on turn played, cannot quest until next turn)
- [ ] 2.5 Write tests for Rush keyword (can quest on turn played)
- [ ] 2.6 Write tests for Support keyword (stat modifications, duration, stacking)
- [ ] 2.7 Write tests for Resist keyword (damage reduction calculations)
- [ ] 2.8 Write tests for Shift keyword (cost reduction, maintaining exerted state, ability inheritance)
- [ ] 2.9 Write tests for Ward keyword (cannot be chosen by opposing abilities)
- [ ] 2.10 Write tests for Singer keyword (can pay song costs with willpower)
- [ ] 2.11 Write tests for Exert keyword abilities (exerting to activate, timing restrictions)
- [ ] 2.12 Write tests for conditional keywords and keyword combinations
- [ ] 2.13 Implement all keyword tests in relevant test files, removing .skip() placeholders
- [ ] 2.14 Verify all tests pass for the lorcana-engine package
- [ ] 2.15 Verify linter rules pass for the package
- [ ] 2.16 Verify type safety with typecheck
- [ ] 2.17 Use code-reviewer subagent to review the code
- [ ] 2.18 Update tasks.md to mark task as complete

### Task 3: Action Card Testing - Set 009

Implement all skipped action card tests for set 009, covering Songs and standard Actions across all six colors.

- [ ] 3.1 Write tests for Amber action cards (001-021 range: Songs and Actions)
- [ ] 3.2 Write tests for Amethyst action cards (022-048 range: Songs and Actions)
- [ ] 3.3 Write tests for Emerald action cards (049-075 range: Songs and Actions)
- [ ] 3.4 Write tests for Ruby action cards (076-102 range: Songs and Actions)
- [ ] 3.5 Write tests for Sapphire action cards (103-133 range: Songs and Actions)
- [ ] 3.6 Write tests for Steel action cards (134-164 range: Songs and Actions)
- [ ] 3.7 Review all action test files in @packages/lorcana-engine/src/cards/definitions/009/actions/, remove .skip(), implement test logic
- [ ] 3.8 Test Song-specific mechanics (Singer keyword interactions, alternative play costs)
- [ ] 3.9 Test action resolution (effect resolution, targeting, card movement to discard)
- [ ] 3.10 Verify all tests pass for the lorcana-engine package
- [ ] 3.11 Verify linter rules pass for the package
- [ ] 3.12 Verify type safety with typecheck
- [ ] 3.13 Use code-reviewer subagent to review the code
- [ ] 3.14 Update tasks.md to mark task as complete

### Task 4: Character Card Testing - Phase 1 (Amber & Amethyst)

Implement character card tests for Amber and Amethyst colors, covering triggered abilities, static abilities, and character-specific mechanics.

- [ ] 4.1 Write tests for Amber character cards (001-021 range)
- [ ] 4.2 Test Amber character abilities (quest triggers, support effects, stat modifications)
- [ ] 4.3 Test Amber character interactions (bodyguard, healing, lore generation)
- [ ] 4.4 Write tests for Amethyst character cards (022-048 range)
- [ ] 4.5 Test Amethyst character abilities (card draw, banish effects, hand manipulation)
- [ ] 4.6 Test Amethyst character interactions (evasive, control effects, ability triggers)
- [ ] 4.7 Review all character test files in @packages/lorcana-engine/src/cards/definitions/009/characters/amber/ and amethyst/, remove .skip(), implement test logic
- [ ] 4.8 Test character combat mechanics (challenging, damage dealing, KO conditions)
- [ ] 4.9 Test character questing mechanics (exerting to quest, lore generation, quest restrictions)
- [ ] 4.10 Verify all tests pass for the lorcana-engine package
- [ ] 4.11 Verify linter rules pass for the package
- [ ] 4.12 Verify type safety with typecheck
- [ ] 4.13 Use code-reviewer subagent to review the code
- [ ] 4.14 Update tasks.md to mark task as complete

### Task 5: Character Card Testing - Phase 2 (Emerald & Ruby)

Implement character card tests for Emerald and Ruby colors, focusing on aggressive mechanics and damage-dealing abilities.

- [ ] 5.1 Write tests for Emerald character cards (049-075 range)
- [ ] 5.2 Test Emerald character abilities (reckless, challenge bonuses, aggressive stats)
- [ ] 5.3 Test Emerald character interactions (challenger keyword, damage triggers, exert abilities)
- [ ] 5.4 Write tests for Ruby character cards (076-102 range)
- [ ] 5.5 Test Ruby character abilities (direct damage, challenge manipulation, stat reduction)
- [ ] 5.6 Test Ruby character interactions (damage dealing, banish effects, challenge triggers)
- [ ] 5.7 Review all character test files in @packages/lorcana-engine/src/cards/definitions/009/characters/emerald/ and ruby/, remove .skip(), implement test logic
- [ ] 5.8 Test damage calculation edge cases (lethal damage, overkill, damage prevention)
- [ ] 5.9 Test challenge mechanics (initiating challenges, damage resolution, simultaneous KO)
- [ ] 5.10 Verify all tests pass for the lorcana-engine package
- [ ] 5.11 Verify linter rules pass for the package
- [ ] 5.12 Verify type safety with typecheck
- [ ] 5.13 Use code-reviewer subagent to review the code
- [ ] 5.14 Update tasks.md to mark task as complete

### Task 6: Character Card Testing - Phase 3 (Sapphire & Steel)

Implement character card tests for Sapphire and Steel colors, covering control mechanics and defensive abilities.

- [ ] 6.1 Write tests for Sapphire character cards (103-133 range)
- [ ] 6.2 Test Sapphire character abilities (card draw, bounce effects, deck manipulation)
- [ ] 6.3 Test Sapphire character interactions (return to hand effects, cost manipulation, ability countering)
- [ ] 6.4 Write tests for Steel character cards (134-164 range)
- [ ] 6.5 Test Steel character abilities (high defense, ward, resist mechanics)
- [ ] 6.6 Test Steel character interactions (damage prevention, protection effects, stat buffs)
- [ ] 6.7 Review all character test files in @packages/lorcana-engine/src/cards/definitions/009/characters/sapphire/ and steel/, remove .skip(), implement test logic
- [ ] 6.8 Test defensive mechanics (ward interactions, resist calculations, protection triggers)
- [ ] 6.9 Test control effects (bounce timing, permanent vs temporary effects, state restoration)
- [ ] 6.10 Verify all tests pass for the lorcana-engine package
- [ ] 6.11 Verify linter rules pass for the package
- [ ] 6.12 Verify type safety with typecheck
- [ ] 6.13 Use code-reviewer subagent to review the code
- [ ] 6.14 Update tasks.md to mark task as complete

### Task 7: Complex Interactions and Edge Cases

Implement tests for multi-card interactions, ability stacking, timing edge cases, and complex game states that require multiple mechanics working together.

- [ ] 7.1 Write tests for multi-card combos (2-3 card interactions, ability stacking)
- [ ] 7.2 Write tests for timing edge cases (simultaneous triggers, resolution order, priority)
- [ ] 7.3 Write tests for state-based actions (checking win conditions, continuous effects, layer system)
- [ ] 7.4 Write tests for replacement effects (damage prevention vs damage dealing, enters-play replacements)
- [ ] 7.5 Write tests for corner cases (empty zones, maximum hand size, maximum board state)
- [ ] 7.6 Write tests for shift interactions (shifting onto characters with damage, ability inheritance chains)
- [ ] 7.7 Write tests for keyword combinations (evasive + bodyguard, challenger + reckless, etc.)
- [ ] 7.8 Write tests for multiplayer scenarios if applicable (targeting restrictions, effect scope)
- [ ] 7.9 Review all integration test scenarios, ensure comprehensive coverage
- [ ] 7.10 Document any discovered ambiguities or rule clarifications needed
- [ ] 7.11 Verify all tests pass for the lorcana-engine package
- [ ] 7.12 Verify linter rules pass for the package
- [ ] 7.13 Verify type safety with typecheck
- [ ] 7.14 Use code-reviewer subagent to review the code
- [ ] 7.15 Generate test coverage report and verify >90% coverage
- [ ] 7.16 Update tasks.md to mark task as complete

## Notes

### Test Implementation Guidelines

- Use LorcanaTestEngine for all test setups (already implemented)
- Follow TDD: Write/uncomment tests first, then implement/fix functionality
- Test pattern: Setup game state → Execute actions → Assert outcomes
- Remove .skip() from existing test files and implement test logic
- Reference @packages/lorcana-engine/LLM-RULES.md for correct rule implementations
- Use descriptive test names that explain what behavior is being tested

### File Locations

- Test files: @packages/lorcana-engine/src/cards/definitions/009/[type]/[color]/[number]-[name].test.ts
- Rules reference: @packages/lorcana-engine/LLM-RULES.md
- Test engine: @packages/lorcana-engine/src/test/LorcanaTestEngine.ts
- Run tests: `bun test packages/lorcana-engine`

### Dependencies Between Tasks

- Task 1 must be completed first (foundational mechanics)
- Task 2 should be completed before Tasks 3-6 (keywords used by cards)
- Tasks 3-6 can be worked on in parallel after Tasks 1-2
- Task 7 should be completed last (requires all other functionality)

### Success Criteria

- All .skip() placeholders removed from test files
- All tests passing with green results
- Test coverage >90% for core engine code
- All 12 keywords fully tested and verified
- All set 009 cards have implemented tests
- Complex interactions documented and tested
- Linter and typecheck passing
- Code reviewed and approved
