# Lorcana Game Start Test - Implementation Summary

## Overview
This document describes the minimal Lorcana game start test implementation created to validate how the core engine handles the game beginning procedure across different TCGs.

## Purpose
The goal is to test the core engine's ability to handle game-specific initialization sequences using a real game's rules (Disney Lorcana), focusing on the 5-step beginning procedure:

1. **Randomly determine first player** - Select who goes first
2. **Shuffle decks** - Prepare player decks (implicit in setup)
3. **Start with 0 lore** - Initialize player scores
4. **Draw 7 cards** - Deal initial hands
5. **Players may mulligan once** - Allow hand redrawing

## Implementation Details

### Files Modified

#### `createMockLorcanaGame.ts`
- **Extended TestGameState**: Added minimal properties needed for game start:
  - `players`: Array with `id`, `lore`, and `zones` (hand/deck)
  - `activePlayerId`: Currently active player (string)
  - `turnNumber`: Current turn count
  - `gamePhase`: "setup" or "active"
  - `firstPlayerDetermined`: Boolean flag

- **Added Moves**:
  - `chooseWhoGoesFirstMove`: Sets first player and transitions to active phase
  - `drawCards`: Draws specified number of cards for a player
  - `alterHand`: Implements mulligan (returns hand to deck, shuffles, redraws)

- **Implemented Working Reducers**: All three moves now have functional reducers that modify the draft state using Immer

- **Updated Setup Function**: Now uses the `players` parameter passed by the engine to create player-specific decks with proper IDs

#### `lorcana-engine-definition.test.ts`
- **Added New Test**: `"should execute the complete game start sequence with moves"`
  - Creates engine with 2 players using `createTestEngine` and `createTestPlayers`
  - Executes moves through the engine to validate state transitions:
    1. Verify initial setup state
    2. Execute `chooseWhoGoesFirstMove` and verify first player is set
    3. Execute `drawCards` for both players and verify 7 cards drawn
    4. Execute `alterHand` for player 1 (mulligan) and verify hand refreshed
    5. Validate final ready-to-play state

- **Added Imports**: `createTestEngine`, `createTestPlayers`, `PlayerId` type

## Key Design Decisions

### Minimal State Structure
- Card type and metadata remain `unknown` for simplicity
- Only tracks essential zones: `hand` and `deck`
- No full Zone classes or complex zone management
- Focus on state transitions, not complete game rules

### Type Safety with Branded Types
- Engine uses `PlayerId` (branded string type)
- Test state uses plain strings for player IDs
- Used type casting (`as PlayerId` and `as unknown as string`) to bridge the gap
- This is acceptable for test code while maintaining type safety in production

### Shuffle Implementation
- Shuffle is simulated by array `.reverse()` for testing
- Real implementation would use seeded RNG for determinism

### No Engine Integration
- Keeps engine-agnostic (doesn't use RuleEngine internals)
- Uses public API: `executeMove`, `getState`
- Validates that moves can be executed and state updated correctly

## Test Results
All tests pass successfully:
- ✅ Complete game start sequence execution
- ✅ Beginning phase structure validation
- ✅ First turn skip draw rule
- ✅ Move type safety validation
- ✅ Mulligan handling

## Lessons for Core Engine

This test demonstrates:

1. **Different games have different initialization sequences**
   - Lorcana: Determine first player → Draw 7 → Optional mulligan
   - Gundam: Draw 5 → Place shields → Distribute tokens
   
2. **Setup function needs player context**
   - Player IDs must be provided and used consistently
   - State structure should accommodate player-specific zones
   
3. **Move execution is flexible**
   - Games can define custom initialization moves
   - Moves can operate on any player's state (not just active player)
   
4. **Type safety works across different state structures**
   - Generic types allow game-specific state definitions
   - Reducers are properly typed with params

## Future Improvements

1. **Extract common patterns**: Create helper utilities for common initialization tasks (draw cards, shuffle, etc.)
2. **Standardize mulligan**: Different TCGs have different mulligan rules - could provide common implementations
3. **Setup phases**: Consider a dedicated "setup phase" in flow system for pre-game actions
4. **Validation moves**: Add helper to validate game-specific deck construction rules

