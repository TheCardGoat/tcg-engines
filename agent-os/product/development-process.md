# Development Process & Approach

**A guide for early contributors to understand our development philosophy, trajectory, and implementation strategy.**

## Overview

This document outlines the development process we follow when building game engines and the core framework. Understanding this approach will help you contribute effectively and align with our architectural vision. For the foundational principles that guide our decisions, see the [Design Philosophy](philosophy.md).

## Core Development Principle: Outside-to-Inside

### The Philosophy

We build the core library **from outside to inside**. This means we start with the ideal external API that developers need, then work inward to implement the supporting infrastructure.

**What This Means in Practice:**

1. **Start with the Ideal API** - We first define what the perfect external API would look like for developers implementing game interactions
2. **Design the Test API** - We determine what the desired API should be for writing test cases
3. **Work Backward** - We then implement the simplest possible solution that meets these API requirements
4. **Extract to Core** - When we identify overlapping logic across game engines, we move it to the core framework

This approach ensures that:
- The API remains developer-friendly and intuitive
- The framework solves real problems developers face
- We avoid over-engineering or building features that aren't needed
- The core framework grows organically from actual use cases

### The Development Cycle

```
Ideal API Design → Test Specification → Simple Implementation → Extract Common Logic → Refine Core
```

## Test-Driven Development: Rules as Code

### Tests as Specifications

Tests are not just validation—they are **executable specifications** that represent the comprehensive rules of the game in code.

**Our Approach:**

1. **Write Tests First** - Each feature starts with a test that clearly outlines:
   - Expected input (what the developer provides)
   - Expected output (what the engine returns)
   - Expected state changes (how the game state evolves)

2. **Tests Represent Rules** - For example, in Disney Lorcana:
   - "Players can play a card" becomes a `playCard` specification
   - This specification is a code representation of the written comprehensive rules
   - The test serves as both documentation and validation

3. **Clean Test Structure** - Tests should be readable and self-documenting:
   ```typescript
   // ✅ Good: Clear input and expected output
   test('player can play a card from hand', () => {
     const engine = createTestEngine(gameDefinition, players);
     const card = engine.getState().players[0].hand[0];
     
     const result = engine.executeMove('playCard', {
       playerId: 'p1',
       cardId: card.id,
     });
     
     expect(result.success).toBe(true);
     expect(engine.getState().players[0].hand).not.toContain(card.id);
     expect(engine.getState().field).toContain(card.id);
   });
   ```

### Why This Matters

- **Rules are Executable** - Game rules become code that can be tested and verified
- **Documentation Through Tests** - Tests serve as living documentation of game mechanics
- **Regression Prevention** - Tests catch when rule implementations break
- **Clear Requirements** - Tests force us to think clearly about what we're building

## Separation of Concerns: Game Engine vs. Core Engine

### The Golden Rule

**The game engine should be slim and focused solely on game-specific rules.**

### What Belongs in the Game Engine

The game engine should contain **only code that directly represents game rules**:

- Card definitions and abilities
- Game-specific move implementations
- Rule-specific validations (e.g., "can only play one card per turn")
- Game-specific state structures
- Phase and turn definitions specific to the game

### What Belongs in the Core Engine

The core engine handles **general TCG infrastructure** that applies across games:

- **Move Validation** - Generic validation framework
- **Zone Management** - Deck, hand, field, graveyard operations
- **Turn Management** - Turn order, phase transitions
- **Game Flow Management** - State machine for game progression
- **Targeting System** - Generic targeting and selection
- **Card Filtering** - Query DSL for finding cards
- **State Management** - Immutability, history, patches
- **Network Synchronization** - Delta patches and state sync

### The Extraction Process

When implementing game engines:

1. **Start Simple** - Implement the simplest solution that works for your specific game
2. **Identify Patterns** - When you see the same logic in multiple places or across games
3. **Extract to Core** - Move generic logic to the core framework
4. **Refactor Game Engine** - Update the game engine to use the core functionality

**Example:**

```typescript
// ❌ Game Engine: Don't implement zone management here
function playCard(state, cardId) {
  // Manual zone manipulation
  const hand = state.players[0].hand;
  const field = state.players[0].field;
  hand.splice(hand.indexOf(cardId), 1);
  field.push(cardId);
}

// ✅ Game Engine: Use core zone operations
function playCard(state, cardId) {
  moveCard(state, {
    from: { zone: 'hand', playerId: 'p1' },
    to: { zone: 'field', playerId: 'p1' },
    cardId,
  });
}
```

## Simple API Design

### The Principle

**Keep the API simple and small.** Complex and vast APIs make it difficult for contributors to understand and contribute.

### The Main Function

The TCG engine should have **one main function**: `executeMove`.

```typescript
// ✅ Simple, focused API
const result = engine.executeMove(moveType, moveData);

// ❌ Complex API with many entry points
engine.playCard(...);
engine.activateAbility(...);
engine.challenge(...);
// ... many more methods
```

### Why Simplicity Matters

- **Lower Barrier to Entry** - New contributors can understand the API quickly
- **Easier to Test** - One function means one way to interact with the engine
- **Easier to Extend** - Adding new moves doesn't require new API surface
- **Easier to Document** - Less surface area means better documentation coverage

### API Evolution

As we build, we may discover we need additional functions. That's okay—but we should:
1. Start with the simplest possible API
2. Add functions only when there's a clear, demonstrated need
3. Prefer composition over new API surface
4. Document why each function exists

## Development Order: A Practical Example

Using **Disney Lorcana** as our reference implementation, here's the development order we follow:

### Phase 1: Implement Player Moves

First, we implement all the moves that players can explicitly execute:

1. **Put a Card in Inkwell** - Basic resource management
2. **Play a Card** - Core card playing mechanics
3. **Activate Card's Ability** - Ability activation system
4. **Quest with a Card** - Questing mechanics
5. **Challenge** - Combat system
6. **Enter a Location** - Location-specific mechanics
7. **Resolve an Effect in the Bag** - Effect resolution
8. **Skip an Effect** - Effect skipping

**Why This Order:**
- These are the primary interactions players have with the game
- They establish the foundation for all other mechanics
- They help us identify what core infrastructure we need

### Phase 2: Implement Automatic Logic

Once all player moves are implemented, we add automatic game logic:

1. **Game State Checks** - Win/loss conditions, game end detection
2. **Beginning of Phase Evaluation** - Automatic triggers at phase start
3. **End of Turn Evaluation** - Cleanup and turn transition logic
4. **Automatic Triggers** - State-based effects that fire automatically

**Why After Moves:**
- Automatic logic often depends on moves being properly implemented
- We need to understand the full game flow before automating it
- State checks require a complete understanding of the game state

### Phase 3: Implement Card Effects

Finally, we implement card-specific effects, starting simple and building complexity:

1. **Simple Action Cards** - Cards with straightforward, one-time effects
   - Example: "Draw 2 cards"
   - Example: "Deal 3 damage to target"

2. **Triggered Abilities** - The most complex part
   - Enter-the-battlefield triggers
   - Leave-the-battlefield triggers
   - Event-based triggers (when X happens, do Y)
   - Conditional triggers
   - Stack management for triggered abilities

**Why This Order:**
- Simple effects help us build the effect system infrastructure
- Triggered abilities are the most complex and require a solid foundation
- We can test the effect system with simple cases before tackling complexity

### The Complete Development Sequence

```
1. Player Moves (all explicit actions)
   ↓
2. Automatic Logic (game flow, state checks)
   ↓
3. Simple Card Effects (action cards)
   ↓
4. Complex Card Effects (triggered abilities)
```

## Practical Workflow

### Step-by-Step Implementation

1. **Write the Test**
   ```typescript
   test('player can put card in inkwell', () => {
     // Define expected input and output
   });
   ```

2. **Implement the Simplest Solution**
   ```typescript
   // In game engine
   executeMove('putCardInInkwell', { cardId, playerId }) {
     // Simple implementation that makes the test pass
   }
   ```

3. **Identify Overlaps**
   - "Do I need zone management? → Extract to core"
   - "Do I need validation? → Extract to core"
   - "Is this game-specific? → Keep in game engine"

4. **Refactor and Extract**
   - Move generic logic to core
   - Update game engine to use core functions
   - Ensure tests still pass

5. **Repeat for Next Feature**

### Example: Implementing "Play Card"

```typescript
// Step 1: Write test
test('player can play card from hand', () => {
  const engine = createTestEngine(gameDefinition, players);
  const card = getCardFromHand(engine, 'p1');
  
  const result = engine.executeMove('playCard', {
    playerId: 'p1',
    cardId: card.id,
  });
  
  expect(result.success).toBe(true);
  expectCardInZone(engine, card.id, 'field');
  expectCardNotInZone(engine, card.id, 'hand');
});

// Step 2: Simple implementation
moves: {
  playCard: {
    condition: (state, context) => {
      // Game-specific: Can only play one card per turn
      return !state.players[context.playerId].hasPlayedCard;
    },
    reducer: (draft, context) => {
      // Use core zone operations
      moveCard(draft, {
        from: { zone: 'hand', playerId: context.playerId },
        to: { zone: 'field', playerId: context.playerId },
        cardId: context.cardId,
      });
      
      // Game-specific rule
      draft.players[context.playerId].hasPlayedCard = true;
    },
  },
}

// Step 3: Identify what's generic
// - Zone operations → Already in core ✅
// - Move validation → Already in core ✅
// - "One card per turn" → Game-specific, stays in game engine ✅
```

## Key Takeaways for Contributors

1. **Start with Tests** - Tests define what we're building
2. **Keep It Simple** - Implement the simplest solution first
3. **Separate Concerns** - Game rules in game engine, infrastructure in core
4. **Follow the Order** - Moves → Automatic Logic → Simple Effects → Complex Effects
5. **Extract Patterns** - Move common logic to core when you see it repeated
6. **One Main Function** - Keep the API simple with `executeMove` as the primary interface

## Questions to Ask Yourself

When implementing a feature, ask:

- **Is this a game rule?** → Game engine
- **Is this generic TCG infrastructure?** → Core engine
- **Can I write a test that clearly shows input/output?** → You're ready to implement
- **Is this the simplest solution?** → Good, start here
- **Have I seen this pattern before?** → Consider extracting to core

## Conclusion

This development process ensures that:
- We build APIs that developers actually want to use
- Game engines stay focused on game rules
- The core framework grows organically from real needs
- Contributors can understand and contribute effectively
- The codebase remains maintainable and extensible

Remember: **Start outside (with the ideal API), work inward (to implementation), and extract common patterns (to core).** This approach keeps us focused on what matters: making it easy to build trading card games.

---

**Related Documents:**
- [Design Philosophy](philosophy.md) - Core principles and tenets
- [Mission Statement](mission.md) - Project goals and vision
- [Roadmap](roadmap.md) - Development phases and priorities

**Last Updated**: 2025-01-27
**Version**: 1.0.0

