# Spec Requirements Document

> Spec: Core Game Loop Implementation
> Created: 2025-10-08
> Status: Planning

## Overview

Implement the complete turn-based game loop for Gundam Card Game, focusing on basic playable functionality without complex card abilities/effects. This phase establishes the foundational gameplay mechanics and validates the @tcg/core framework's segment/phase/step architecture while identifying areas for framework improvement.

## User Stories

### Game Engine Developer

As a game engine developer, I want to implement the complete Gundam turn flow using @tcg/core, so that I can validate the framework's design for complex TCG mechanics and identify gaps that need addressing.

**Workflow**: Developer implements all 5 game phases (start, draw, resource, main, end) with proper state transitions, creates core moves (deploy, attack, pass), integrates zone management for all 9 game zones, implements the 5-step battle sequence, adds win/loss condition checking, and documents all framework limitations discovered during implementation.

**Problem Solved**: Without a complete game loop implementation, the framework remains untested for real-world TCG scenarios. This validates whether the segment/phase/step architecture can handle complex turn structures, multi-step sequences like battles, and automatic state management.

### Future TCG Implementer

As a developer building another TCG engine, I want clear examples of implementing turn flow and moves, so that I can understand the framework patterns and avoid common pitfalls.

**Workflow**: Developer examines Gundam's turn flow implementation to see how phases are structured, studies move implementations to understand validation and state mutation patterns, reviews battle sequence to learn multi-step action handling, and follows established conventions for zone management and rules enforcement.

**Problem Solved**: Without a reference implementation, each TCG would need to discover framework patterns independently, leading to inconsistent approaches and repeated mistakes.

### QA Tester

As a QA tester, I want to play a complete game from setup to victory, so that I can verify the core mechanics work correctly before card abilities are added.

**Workflow**: Tester sets up a game with 2 players and starter decks, plays through multiple turns deploying units and attacking, triggers win conditions (deck out, shield depletion), validates that all moves respect game rules (costs, levels, zone limits), and reports any state inconsistencies or rule violations.

**Problem Solved**: Without basic playable functionality, testing card abilities becomes impossible and bugs compound. A working core loop enables incremental testing as features are added.

## Spec Scope

1. **Complete Turn Flow** - Implement all 5 phases (start, draw, resource, main, end) with automatic phase transitions, turn counter management, and active/standby player switching.

2. **Zone Management System** - Full implementation of all 9 zones (deck, resource deck, resource area, battle area, shield base, shield section, removal area, hand, trash) with capacity limits, visibility rules, and card movement operations.

3. **Core Move Set** - Eight essential moves: deployUnit, deployBase, pairPilot, playCommand (basic), attackWithUnit, activateBlocker, passMainPhase, and concede.

4. **Battle System** - Complete 5-step attack sequence (attack step, block step, action step, damage step, battle end step) with damage calculation, HP tracking, and destruction handling.

5. **Resource & Cost System** - Cost payment via resting resources, level requirement validation, EX Resource token handling, and resource area limit enforcement (15 max, 5 EX max).

6. **Win/Loss Conditions** - Automatic defeat detection for: no shields + player damage, empty deck at draw, and manual concession.

7. **Rules Management** - Automatic processes: HP-based destruction, zone capacity management (6 units, 1 base, 10 hand limit), and state cleanup.

8. **Active/Rested State Management** - Card orientation tracking, automatic readying during start phase, resting for costs and attacks, and state-based action restrictions.

9. **Comprehensive Test Suite** - 50+ behavior tests covering all moves, phase transitions, battle sequences, win conditions, and edge cases.

## Out of Scope

- Keyword effects (<Repair>, <Breach>, <Support>, <Blocker>, <First Strike>, <High-Maneuver>)
- Triggered effects (【Deploy】, 【Attack】, 【Destroyed】, 【When Paired】)
- Activated effects (【Activate·Main】, 【Activate·Action】)
- Command effects (【Main】, 【Action】)
- Burst effects (【Burst】)
- Pilot linking and link unit special rules
- Action steps during battle and end phase
- Card ability text parsing and execution
- Complex targeting and effect resolution
- Shield section interactions beyond basic damage
- Card set definitions beyond test fixtures
- AI opponent logic
- Performance optimization
- Network/multiplayer infrastructure

## Expected Deliverable

1. **Complete playable game** - Can execute a full game from setup through multiple turns to victory/defeat without errors.

2. **All core moves functional** - Every move validates costs/levels, mutates state correctly, and triggers appropriate rules management.

3. **Battle system operational** - Attack sequence progresses through all 5 steps, damage is calculated and applied, destruction triggers properly.

4. **Win conditions verified** - Game correctly detects and handles all defeat scenarios (shield depletion, deck out, concession).

5. **Comprehensive test coverage** - All tests pass (`bun run check`), zero type errors, 100% coverage of implemented features through behavior tests.

6. **Framework documentation** - Limitations, gaps, and improvement recommendations documented for core engine team.

7. **Clean separation of concerns** - Game logic in moves, state queries isolated, immutable state patterns followed, no tight coupling to framework internals.

## Spec Documentation

- Tasks: @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-loop/tasks.md
- Technical Specification: @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-loop/sub-specs/technical-spec.md
- Database Schema: N/A (Not applicable for game engine)
- API Specification: @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-loop/sub-specs/api-spec.md
- Tests Specification: @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-loop/sub-specs/tests.md
