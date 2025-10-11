# Gundam Game Start Test - Purpose and Insights

## Overview

This test suite (`gundam-engine-definition.test.ts` and `createMockGundamGame.ts`) demonstrates how the core TCG engine handles the beginning of game procedure for the Gundam Card Game. It serves as a minimal, test-focused implementation to understand and optimize engine initialization across different trading card games.

## Gundam's Unique Game Start Requirements

According to Gundam rules (section 5: Preparing to Play), the game has a complex initialization:

### 1. **Dual Deck System**
- Main deck: 50 cards (Unit, Pilot, Command, Base cards)
- Resource deck: 10 Resource cards
- Unlike most TCGs which have a single deck

### 2. **Shield Placement**
- 6 cards from the deck placed face-down in the Shield Section
- These act as the player's "life points"
- Hidden from opponent (visibility: "secret")

### 3. **Token Creation**
- EX Base token placed in Base Section for both players
- EX Resource token given to Player 2 (balances first-player advantage)

### 4. **Initial Hand with Mulligan**
- Each player draws 5 cards
- Optional redraw once (shuffle hand back, draw 5 new cards)
- Hand limit of 10 cards (enforced during end phase)

### 5. **Multiple Game Zones**
9 distinct zones with different properties:
- `deck` (private, ordered, max 50)
- `resourceDeck` (private, ordered, max 10)
- `hand` (private, unordered, max 10)
- `battleArea` (public, unordered, max 6 units)
- `shieldSection` (secret, unordered, max 6)
- `baseSection` (public, unordered, max 1 base)
- `resourceArea` (public, unordered, max 15)
- `trash` (public, unordered, unlimited)
- `removal` (public, unordered, unlimited)

## Test Structure

### Files

1. **`createMockGundamGame.ts`**
   - Creates minimal Gundam `GameDefinition`
   - Defines game state structure
   - Configures all 9 zones
   - Defines 7 game moves (draw, deployUnit, deployBase, playResource, attack, pass, concede)
   - Implements 5-phase turn flow (start → draw → resource → main → end)
   - Setup function for initial state

2. **`gundam-engine-definition.test.ts`**
   - 6 test cases covering:
     - Initial state validation
     - Zone configuration correctness
     - Move definitions
     - Phase flow structure
     - Game start sequence
     - Deterministic gameplay (seeded RNG)

### Key Insights for Core Engine Optimization

#### 1. **Initialization Complexity Varies by Game**

**Gundam requires:**
- Multiple deck shuffling operations
- Card movement to shields before hand draw
- Token creation (non-card game objects)
- Asymmetric player setup (P2 gets extra resource)

**Lorcana (by comparison) requires:**
- Single deck shuffle
- Simple 7-card hand draw
- No tokens or shields
- Symmetric setup for both players

**Optimization opportunities:**
- Game definitions should specify initialization steps declaratively
- Engine could provide a "setup phase flow" similar to turn flow
- Common patterns (shuffle deck, draw cards, create tokens) could be helpers

#### 2. **Zone Configuration is Critical**

Each zone has distinct properties that affect gameplay:
- `visibility`: private/public/secret (affects what opponent can see)
- `ordered`: affects shuffle operations and card positioning
- `maxSize`: enforced by engine (deck building, hand limits, board limits)
- `faceDown`: affects card revelation

**Optimization opportunities:**
- Engine should validate zone operations against constraints (e.g., prevent exceeding maxSize)
- Visibility filtering should be automatic in `getPlayerView()`
- Zone operations should be type-safe (prevent moving cards to invalid zones)

#### 3. **Game State Separation**

The test demonstrates clean separation:
- **Game-specific state** (`TestGameState`): phase, turn, currentPlayer, resources
- **Framework state** (internal): zones, cards, cardMetas
- **Game definition**: setup, moves, flow, zones

**Benefits:**
- Engine can optimize internal state management
- Games don't worry about zone bookkeeping
- State serialization is standardized

#### 4. **Deterministic Setup is Essential**

The test verifies that identical seeds produce identical initial states:
```typescript
const engine1 = createTestEngine(gameDefinition, players, { seed: "test" });
const engine2 = createTestEngine(gameDefinition, players, { seed: "test" });
expect(engine1.getState()).toEqual(engine2.getState());
```

**Why this matters:**
- Replays must recreate exact game state
- Server-client synchronization depends on determinism
- AI evaluation needs predictable scenarios
- Bug reproduction requires exact conditions

## Comparison with Other TCGs

### Lorcana
- Single 60-card deck
- Simple 7-card draw
- Fewer zones (6 vs Gundam's 9)
- No tokens at start
- Symmetric setup

### Magic: The Gathering
- Single 60+ card deck
- 7-card draw with unlimited mulligan
- Separate library for basic lands (in digital)
- Life counter starts at 20
- Symmetric setup

### Gundam (This Test)
- **Dual deck system** (50 main + 10 resource)
- 5-card draw with one mulligan
- **9 distinct zones** with varied properties
- **Shield system** (6 face-down cards)
- **Tokens** (EX Base, EX Resource)
- **Asymmetric setup** (P2 advantage compensation)

## How This Helps Optimization

### 1. **Identify Common Patterns**
By testing multiple games, we can extract common initialization patterns:
- Deck creation and shuffling
- Initial hand draw
- Token/counter creation
- Zone setup
- Player-specific initialization

These could become engine helpers or declarative config.

### 2. **Benchmark Initialization Performance**
The test suite can be extended to measure:
- Time to initialize engine
- Time to setup zones
- Time to execute first few moves
- Memory usage of initial state

### 3. **Validate Engine Contracts**
Tests ensure the engine correctly:
- Honors zone configurations
- Provides operations API to moves
- Maintains immutability
- Supports deterministic seeding
- Enables player view filtering

### 4. **Guide API Design**
Understanding diverse game starts informs:
- What should be in `GameDefinition`
- What helpers the engine should provide
- How setup phase should work
- When game-specific vs framework code applies

## Next Steps

### For Testing
1. Add move execution tests (draw, deploy, attack)
2. Test shield destruction mechanics
3. Test resource deck interactions
4. Test mulligan decision flow
5. Test asymmetric setup (P2 bonus)

### For Optimization
1. Profile initialization performance
2. Add setup phase flow (like turn flow)
3. Create common setup helpers (shuffle, draw, createToken)
4. Optimize zone operations for common patterns
5. Add declarative setup steps to `GameDefinition`

### For Documentation
1. Document best practices for game setup
2. Create setup flow examples for different TCGs
3. Explain zone configuration options
4. Show how to handle tokens and counters
5. Demonstrate asymmetric player setup

## Conclusion

This minimal test implementation reveals that TCG game starts vary significantly in complexity. The core engine must be flexible enough to support:
- Multiple deck systems
- Complex zone configurations  
- Token/counter creation
- Asymmetric player setups
- Declarative vs imperative initialization

By understanding these requirements early, we can design engine APIs that make game-specific initialization straightforward while maintaining the benefits of a shared core engine (determinism, replayability, immutability, server authority).

