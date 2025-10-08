# Spec Requirements Document

> Spec: Core Game Mechanics (Phase 2)
> Created: 2025-10-08

## Overview

Implement the fundamental Disney Lorcana game mechanics including complete turn structure, zone management, and all core player moves using the `@tcg/core` framework. This establishes a fully playable game engine that supports complete turn cycles from game start to finish, enabling players to draw cards, manage ink, play cards, quest for lore, challenge opponents, and progress through structured turn phases according to official Lorcana rules.

## User Stories

### Game Setup and Initialization

As a game developer, I want to initialize a Disney Lorcana game with two players, so that I can start a game with proper deck shuffling, hand drawing, mulligan system, and initial lore tracking.

**Workflow**: Developer creates a RuleEngine instance with lorcanaGame definition and player deck configurations. System deterministically shuffles each player's 60-card deck using provided seed, deals 7 cards to each player, allows each player (starting with starting player) to mulligan by placing any number of cards on bottom of deck and redrawing to 7, reshuffles if needed, initializes lore counters to 0, and transitions to first player's Beginning Phase.

**Problem Solved**: Without proper setup, games can't start in a valid state. This implements the complete starting procedure from Lorcana Comprehensive Rules section 3.1 including mulligan (alter hands), randomization, and turn order determination.

### Turn Structure and Phase Flow

As a game developer, I want players to progress through the three-phase turn structure (Beginning, Main, End of Turn), so that the game follows official Lorcana rules and maintains proper sequencing of game actions.

**Workflow**: Player's turn begins with Beginning Phase containing three steps: Ready step (ready all cards, apply start-of-turn effects), Set step (characters stop "drying" and can act, gain lore from locations, resolve start-of-turn triggers), and Draw step (draw 1 card, skipped on first turn). Turn progresses to Main Phase where player can take turn actions in any order (ink card once per turn, play cards, quest with characters, challenge with characters, move characters to locations, use activated abilities). When player declares end of turn with no pending abilities, End of Turn Phase occurs (resolve end-of-turn triggers, end "this turn" effects), then turn passes to next player.

**Problem Solved**: Lorcana has complex turn structure with specific timing for readying cards, gaining location lore, character "drying" mechanics, and triggered ability resolution. This implements the complete turn flow from Comprehensive Rules sections 4.1-4.4 with proper step sequencing and the "bag" system for triggered ability resolution.

### Core Move System

As a game developer, I want all five core player moves (Play Card, Quest, Challenge, Ink Card, Pass Turn) implemented with full validation and state updates, so that players can perform all fundamental game actions according to official rules.

**Workflow - Play Card**: Player selects card from hand during Main Phase. System validates player has sufficient ink (or alternate cost like Shift/Singer), calculates total cost including modifiers, exerts ink cards to pay cost, moves card to appropriate zone (Play for characters/items/locations, resolves and discards for actions), marks characters as "drying" if just played, triggers "when played" abilities into the bag, and updates game state immutably.

**Workflow - Quest**: Player selects ready, dry character without Reckless during Main Phase. System validates character can quest (not exerted, not drying, doesn't have Reckless), exerts character, adds character's Lore value to player's lore total, triggers "whenever quests" abilities into the bag, and checks for 20 lore win condition.

**Workflow - Challenge**: Player selects ready, dry character and exerted opposing character (or location) during Main Phase. System validates challenge is legal (challenger is dry, target is exerted or is location, no Bodyguard restrictions, no Evasive restrictions), exerts challenger, resolves "while challenging" effects, deals simultaneous damage equal to each character's Strength (challenger gets Challenger +N bonus), applies Resist reductions, places damage counters, checks for banishment (damage >= Willpower), triggers challenge-related abilities, and ends challenge effects.

**Workflow - Ink Card**: Player selects card from hand with inkwell symbol once per turn during Main Phase. System validates card has inkwell symbol and player hasn't inked this turn, reveals card to verify symbol, places card facedown and ready in inkwell, marks ink action as used for turn, and triggers any "when put into inkwell" abilities.

**Workflow - Pass Turn**: Player declares end of turn during Main Phase with no pending abilities. System validates no abilities waiting to resolve and all Reckless characters have challenged if able, enters End of Turn Phase, resolves end-of-turn triggers, ends "this turn" effects, and transitions to next player's Beginning Phase.

**Problem Solved**: Each move has specific rules, timing restrictions, cost calculations, and state transformations. This implements all five core moves from Comprehensive Rules sections 4.3.3 (Inkwell), 4.3.4 (Play Card), 4.3.5 (Quest), 4.3.6 (Challenge), and 4.4 (End Turn) with proper validation, immutable state updates, and triggered ability management through the "bag" system.

## Spec Scope

1. **Game State Definition** - Complete LorcanaState type extending @tcg/core GameState with lore tracking, inkwell management, challenge state, turn metadata, and all Lorcana-specific data structures

2. **Zone System** - Five zone configurations (Deck, Hand, Play, Discard, Inkwell) with proper visibility (private/public), card ordering rules, and zone transition logic matching Comprehensive Rules section 8

3. **Turn Structure Flow** - Three-phase turn system (Beginning/Main/End of Turn) with three Beginning Phase steps (Ready/Set/Draw), Main Phase turn actions, proper phase transitions, and "drying" character mechanics from Rules 4.1-4.4

4. **Core Move Handlers** - Complete implementation of all five essential moves (Play Card, Quest, Challenge, Ink Card, Pass Turn) with validation, cost calculation, state transformation, and triggered ability management

5. **Setup System** - Game initialization including deck shuffling with seeded RNG, starting hand dealing (7 cards), mulligan system (alter hands), starting player determination, and initial state creation per Rules 3.1

6. **Triggered Ability System ("The Bag")** - Priority-based triggered ability queue where active player resolves their triggers first, opponent resolves next, abilities can add new triggers, and game state checks occur after each resolution per Rules 1.7 and 8.7

7. **Game State Checks** - Automated checking for win conditions (20 lore), loss conditions (empty deck draw), and required actions (banishment when damage >= Willpower) after every step, action, and ability resolution per Rules 1.9

## Out of Scope

- Keyword abilities implementation (Bodyguard, Challenger, Evasive, Reckless, Resist, Rush, Shift, Singer, Support, Ward, Vanish) - deferred to Phase 4
- Complex triggered and activated abilities - deferred to Phase 4
- Location-specific mechanics (move cost, location abilities, characters at locations) - deferred to Phase 6
- Complete card definitions for all sets - deferred to Phase 5
- Ability cost modifiers and alternate costs beyond basic structure - deferred to Phase 4
- UI/visualization components - not part of engine
- Network synchronization (handled by @tcg/core framework)
- AI move enumeration and evaluation - deferred to Phase 7

## Expected Deliverable

1. **Complete Turn Cycle** - A game can be initialized with two players, progress through all three turn phases (Beginning/Main/End), execute all steps correctly (Ready/Set/Draw in Beginning Phase), and transition turns between players following official Lorcana turn structure

2. **All Core Moves Functional** - Players can play cards from hand (paying ink cost), quest with ready characters (gaining lore), challenge opposing characters (dealing damage), put cards into inkwell (generating ink), and end their turn, all with proper validation against game rules

3. **Deterministic State Management** - Game state changes are immutable through Immer, same seed produces identical games, all moves generate delta patches for synchronization, and state is queryable through framework's query system

4. **Win/Loss Conditions Work** - Game correctly detects and handles player reaching 20 lore (win), player attempting to draw from empty deck (loss), and characters/locations being banished when damage equals or exceeds Willpower

5. **Integration Tests Pass** - Test suite demonstrates complete game scenarios from start to finish including: full turn cycle, questing to 20 lore victory, challenge with character banishment, deck-out loss condition, and proper triggered ability resolution order

6. **Type-Safe Throughout** - All game state, moves, and operations are fully typed with TypeScript strict mode, no `any` types used, and move parameters validated through type system

