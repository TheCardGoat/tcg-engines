# Spec Requirements Document

> Spec: Core Game Mechanics
> Created: 2025-10-08

## Overview

Implement the fundamental Gundam Card Game mechanics using the `@tcg/core` framework to create a playable game engine that supports complete turn cycles, zone management, and core player moves. This establishes the foundation for a production-ready Gundam TCG engine while demonstrating `@tcg/core` framework best practices.

## User Stories

### Game Initialization and Setup

As a game developer, I want to initialize a Gundam Card Game with two players, so that I can start a complete game instance with proper setup procedures.

**Workflow:**
1. Create game instance with two players and their decks
2. System shuffles decks deterministically using provided seed
3. Each player draws 5 cards for starting hand
4. Players have option to mulligan (redraw) their starting hand
5. System places 6 shield cards face-down for each player
6. System places EX Base card in each player's base section
7. System places EX Resource in player two's resource area (first turn advantage compensation)
8. Game transitions to player one's first turn

### Turn Cycle Execution

As a game developer, I want players to progress through structured turn phases, so that the game follows official Gundam Card Game rules and maintains proper game flow.

**Workflow:**
1. Turn begins with Start Phase (untap cards, trigger start-of-turn abilities)
2. Draw Phase executes (draw 1 card, check deck-out loss condition)
3. Resource Phase allows playing 1 resource card per turn
4. Main Phase allows multiple actions (deploy units, pair pilots, attack)
5. End Phase provides final action opportunity and enforces hand size limit
6. Turn passes to opponent

### Resource and Card Play

As a game developer, I want players to manage resources and deploy cards, so that strategic gameplay mechanics function correctly.

**Workflow:**
1. Player places resource card from hand to resource area during Resource Phase
2. Player pays resource cost (tapping resources) to deploy unit from hand to battle area
3. System validates level requirements, cost requirements, and zone capacity
4. Unit enters battle area in tapped state (summoning sickness)
5. Player can pair pilot with unit if level and requirements match
6. Paired units receive stat bonuses and additional abilities

## Spec Scope

1. **Game State Management** - Complete game state structure extending `@tcg/core` GameState with Gundam-specific properties (shields, bases, battle positions, resources)

2. **Zone System** - Seven zone types (Deck, Hand, Battle Area, Shield Area, Resource Area, Trash, Removal) with proper visibility, capacity limits, and card transitions

3. **Turn and Phase Flow** - Five-phase turn structure (Start, Draw, Resource, Main, End) with automatic phase transitions, player priority, and phase-specific action permissions

4. **Core Move Handlers** - Five essential moves (Play Resource, Deploy Unit, Pair Pilot, Attack, End Turn) with complete validation, execution, and state transformation logic

5. **Game Initialization** - Complete setup procedure including deck shuffling, mulligan system, shield placement, EX Base deployment, and turn order determination

## Out of Scope

- Complex card abilities and triggered effects (deferred to Phase 4: Advanced Abilities)
- Complete card database for all sets (deferred to Phase 5: Complete Card Sets)
- Advanced combat mechanics like multiple attackers/blockers (deferred to Phase 6: Advanced Features)
- AI move enumeration and evaluation functions (deferred to Phase 7: Optimization)
- Card definition DSL or ability builder patterns (future enhancement)
- Performance profiling and optimization (deferred to Phase 7)

## Expected Deliverable

1. **Complete Turn Cycle** - A game can be initialized, players can progress through all five turn phases in correct order, and turns transition between players following official rules

2. **Core Move Validation** - All five core moves (Play Resource, Deploy Unit, Pair Pilot, Attack, End Turn) validate correctly based on game state, player resources, phase restrictions, and card requirements

3. **Deterministic State Management** - Game state changes are immutable, deterministic (same seed produces same game), and properly integrated with `@tcg/core` RuleEngine

