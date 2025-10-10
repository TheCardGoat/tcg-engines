# Spec Requirements Document

> Spec: End-to-End Test Coverage for Lorcana Engine
> Created: 2025-10-09

## Overview

Establish comprehensive end-to-end test coverage for the Lorcana engine to ensure all game rules and card abilities are thoroughly tested through full game state simulations. This initiative will create a systematic testing framework that validates game mechanics by instantiating board states, executing player actions, and asserting expected outcomes, ensuring the engine correctly implements all Lorcana rules and card behaviors.

## User Stories

### Complete Rule Coverage Testing

As a developer, I want every Lorcana game rule to have corresponding end-to-end tests, so that I can be confident the engine correctly implements the official game rules and catches regressions when making changes.

The testing approach will focus on behavior validation through the public API by setting up game states, executing moves through the TestEngine, and verifying outcomes. Tests will cover core mechanics like turn structure (Beginning/Main/End phases), quest mechanics, challenge mechanics, damage resolution, lore tracking, and win conditions. Each rule from the LLM-RULES.md will have at least one test demonstrating correct implementation.

### Comprehensive Card Ability Testing

As a developer, I want all card abilities tested end-to-end across all card sets, so that each card's unique mechanics are verified to work correctly in actual gameplay scenarios.

Tests will validate card-specific behaviors including triggered abilities (When/Whenever/At the start/end), activated abilities, static abilities, keywords (Bodyguard, Challenger, Evasive, Reckless, Resist, Rush, Shift, Singer, Support, Vanish, Ward), and special mechanics like Sing Together and cost reductions. Each card definition will have tests covering all its abilities in realistic game contexts.

### Game Flow and Phase Transition Testing

As a developer, I want comprehensive tests for game initialization, turn progression, and phase transitions, so that the game flow mechanics work correctly from game start to finish.

Tests will verify proper game setup (deck shuffling, initial draws, mulligan), turn structure (Ready/Set/Draw steps), phase progression (Beginning → Main → End), priority system, and game-ending conditions (20 lore win, empty deck loss). These tests ensure the fundamental game loop operates correctly.

## Spec Scope

1. **Core Game Rules Testing** - End-to-end tests for all rules in LLM-RULES.md including turn structure, action resolution, game state checks, and win/loss conditions.

2. **Card Ability Testing Framework** - Systematic testing of all card abilities (triggered, activated, static) across all card sets with focus on set 009 as the template.

3. **Keyword Mechanics Testing** - Comprehensive tests for all Lorcana keywords (Bodyguard, Challenger, Evasive, Reckless, Resist, Rush, Shift, Singer, Sing Together, Support, Vanish, Ward) with multiple card combinations.

4. **Game Flow Testing** - Tests for game initialization, mulligan, turn progression, phase transitions, priority system, and game-ending scenarios.

5. **Complex Interaction Testing** - Tests for multi-card interactions, ability stacking, replacement effects, and edge cases like simultaneous triggers and damage resolution.

## Out of Scope

- Performance testing and benchmarking (separate initiative)
- UI/UX testing for visual components
- Network/multiplayer synchronization testing
- Card database management and versioning
- Localization and internationalization testing
- Migration of existing unit tests (will be addressed separately)

## Expected Deliverable

1. **All core game rules have passing end-to-end tests** - Every rule section from LLM-RULES.md (Concepts, Turn Structure, Card Types, Abilities, Zones, Damage, Keywords) has corresponding test coverage.

2. **All card abilities from set 009 have passing tests** - Every card in set 009 has tests validating its abilities through game state setup, action execution, and outcome assertions, serving as a template for other sets.

3. **Test coverage metrics show >90% coverage for game logic** - Core engine operations, rule implementations, and card ability handlers achieve high test coverage through behavior-focused tests.

4. **Documentation for writing e2e tests** - Clear guidelines and examples for writing new card and rule tests using the TestEngine framework, including patterns for common scenarios.
