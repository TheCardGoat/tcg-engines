# Alpha Clash Mock Implementation Summary

## Overview

This document describes the low-fidelity Alpha Clash implementation created to validate the core TCG framework. The implementation follows the same patterns established by the Gundam and Lorcana mock games.

## Purpose

The goal is to validate that the core engine framework can handle different trading card games with distinct rule systems. This is a **low-fidelity implementation** - it doesn't need to be feature-complete, just comprehensive enough to test the framework's flexibility and design.

## Files Created

### 1. `createMockAlphaClashGame.ts`

Mock game definition file containing:

#### Game State
- **Phase tracking**: setup, startOfTurn, expansion, primary, clash, endOfTurn, gameOver
- **Setup steps**: initializing, placeContender, shuffleDeck, drawInitialHand, mulligan, complete
- **Turn management**: turn number, current player, first player selection
- **Player resources**: Contender health, resources available, resource play tracking
- **Mulligan tracking**: which players have been offered/completed mulligan
- **Clash state**: whether a clash is in progress

#### Zones (10 total)
Based on Alpha Clash rules section 4:
- **deck** (private, ordered, 50 cards max)
- **hand** (private, unordered, no limit)
- **contender** (public, 1 card max) - Unique to Alpha Clash
- **clash** (public) - For Clash cards in play
- **clashground** (public, 1 card max) - Only one active at a time
- **accessory** (secret, face-down) - For Traps and Weapons
- **resource** (public) - Cards providing resources
- **discard** (public) - Discard pile
- **oblivion** (public) - Removed from game zone
- **standby** (public, ordered) - Temporary zone for resolving effects

#### Moves
Setup moves:
- `placeContender` - Move Contender from deck to Contender Zone
- `drawInitialHand` - Draw 8 cards (Alpha Clash standard)
- `decideMulligan` - Keep hand or shuffle back and redraw
- `chooseFirstPlayer` - Randomly determine starting player
- `transitionToPlay` - Complete setup and begin game

Regular game moves (stubs for validation):
- `drawCard`, `playResource`, `playClashCard`, `playAction`
- `setTrap`, `initiateClash`, `declareObstructors`, `playClashBuff`
- `pass`, `concede`

#### Flow Definition
Turn structure per Alpha Clash rules section 5:
- **Start of Turn** (order: 0)
- **Expansion Phase** (order: 1)
  - Ready Step: Ready all engaged cards
  - Draw Step: Draw 1 card (skip on first turn for first player per rule 103.7a)
  - Resource Step: Optionally play 1 resource
- **Primary Phase** (order: 2)
  - Play cards, initiate clashes
- **End of Turn** (order: 3)
  - Trigger end effects, remove "until end of turn" effects

### 2. `alpha-clash-engine-definition.test.ts`

Comprehensive test suite with 16 tests across 2 describe blocks:

#### Test Suite 1: Beginning of Game Procedure
Tests game initialization and configuration:
1. Initial setup phase state
2. Zone configuration validation
3. Move definitions validation
4. Phase flow structure validation
5. Game start sequence handling
6. Deterministic gameplay with seeds

#### Test Suite 2: Setup Moves
Tests the complete setup sequence:
1. Place Contender in Contender Zone
2. Draw 8 cards to initial hand
3. Mulligan decision - keep hand
4. Mulligan decision - shuffle and redraw
5. Choose first player
6. Transition from setup to play phase
7. Full setup sequence for both players
8. Deterministic setup with same seed
9. Alpha Clash-specific rules validation
10. Turn structure validation

## Key Features Demonstrated

### 1. Game-Specific Rules
Alpha Clash has unique mechanics that differ from Gundam and Lorcana:
- **50-card deck** with exactly 1 Contender (vs Gundam's dual deck system)
- **8-card starting hand** (vs Lorcana's 7 or Gundam's 5)
- **One-time mulligan** where players can shuffle back any number of cards
- **Unique zones**: Contender Zone, Clashground Zone, Oblivion, Standby
- **Four-phase turn** structure with distinct Expansion sub-phases

### 2. Framework Validation
The implementation validates that the core engine can handle:
- Different zone counts and configurations
- Various visibility settings (private, secret, public)
- Ordered vs unordered zones
- Different setup procedures
- Complex turn structures with nested segments
- Game-specific state tracking

### 3. Beginning of Game Procedure
Per Alpha Clash rules section 103:
1. Reveal Contenders
2. Randomly determine first player
3. Place Contenders in Contender Zone (face-up)
4. Shuffle decks (49 remaining cards)
5. Draw 8 cards (starting hand size)
6. Mulligan option (one-time, shuffle back any number and redraw same amount)
7. First player takes their turn (skips Ready and Draw steps on first turn)

## Alpha Clash-Specific Rules Implemented

Based on the official rules and LLM-RULES.md:

### Rule 100.2
- 50-card deck with maximum 4 copies of any card
- Exactly 1 Contender card

### Rule 103
Complete beginning of game procedure:
- 103.1: Random first player determination
- 103.2b: Contender placement in Contender Zone
- 103.3: Deck shuffling
- 103.4: Contender starting health
- 103.5: Draw 8 cards with one-time mulligan option
- 103.7a: First player skips Ready and Draw steps

### Rule 302.2
- Only one Clashground in play at any time

### Rule 304.1
- Traps are set face-down (secret visibility)

### Rule 500-505
Turn structure:
- Four phases: Start of Turn, Expansion, Primary, End of Turn
- Expansion Phase: Ready → Draw → Resource steps

## Test Results

All 16 tests pass successfully:
```
✓ Alpha Clash Game - Beginning of Game Procedure (6 tests)
✓ Alpha Clash Game - Setup Moves (10 tests)
```

## Integration with Core Framework

This implementation demonstrates:

1. **Type Safety**: All moves are properly typed with specific parameter types
2. **Zone Operations**: Uses the framework's zone management system
3. **State Immutability**: All state changes use Immer's draft pattern
4. **Determinism**: RNG seed support for reproducible games
5. **Move Context**: Proper use of playerId and params in move execution
6. **Flow Management**: Complex turn/phase/segment structure

## Next Steps

This low-fidelity implementation can now be used to:

1. **Validate framework design** with a third distinct game system
2. **Identify missing framework features** needed for full Alpha Clash implementation
3. **Test scalability** of the zone and move systems
4. **Train AI models** on proper game implementation patterns
5. **Create documentation** showing how to implement new games

## Comparison with Other Games

| Feature | Alpha Clash | Gundam | Lorcana |
|---------|-------------|--------|---------|
| Deck Size | 50 cards | 50 main + 10 resource | 60 cards |
| Starting Hand | 8 cards | 5 cards | 7 cards |
| Mulligan | One-time, any number | One-time, redraw 5 | One-time, redraw 7 |
| Unique Zones | Contender, Clashground, Oblivion, Standby | Dual decks, Shields, Tokens | Inkwell, Locations |
| Turn Phases | 4 phases | 5 phases | 3 phases |
| Special Mechanics | Clash system, Traps | Resource system, EX tokens | Lore, Ink, Questing |

## Conclusion

The Alpha Clash mock implementation successfully validates the core TCG framework's ability to handle diverse game systems. It demonstrates proper use of zones, moves, flow control, and state management while adhering to Alpha Clash's unique ruleset.

The implementation follows the established patterns from Gundam and Lorcana while introducing new concepts like the Contender Zone, Clashground, and the Clash Phase system, proving the framework's flexibility and extensibility.

