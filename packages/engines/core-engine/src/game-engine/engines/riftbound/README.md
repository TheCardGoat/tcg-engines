# Riftbound TCG Engine

A complete implementation of the Riftbound Trading Card Game using the CoreEngine framework.

## Overview  

This engine implements the full Riftbound ruleset based on the comprehensive rules document, including:

- **10 Zones per player**: deck, hand, resourceDeck, resourceArea, battleArea, shieldBase, shieldSection, removalArea, trash, sideboard
- **6 Domains**: Fury (red), Calm (green), Mind (blue), Body (orange), Chaos (purple), Order (yellow)  
- **5 Card Types**: Units, Gear, Spells, Runes, Battlefields, Legends
- **Complex Combat System**: Showdowns, Chain system, Battlefield control
- **Multiple Game Modes**: 1v1, FFA3, FFA4, 2v2

## Architecture

The engine follows the established CoreEngine pattern with these key components:

### Type System
- `src/riftbound-engine-types.ts` - Core game types and interfaces
- `src/riftbound-generic-types.ts` - Generic types that extend CoreEngine
- `src/cards/definitions/cardTypes.ts` - Card type definitions

### Core Engine
- `src/riftbound-engine.ts` - Main engine class extending CoreEngine
- `src/utils/createEmptyRiftboundGameState.ts` - Game state initialization
- `src/moves/moves.ts` - Move implementations

### Testing
- `src/testing/riftbound-test-engine.ts` - Test utilities and mock game states
- `src/testing/riftbound-engine.test.ts` - Basic engine tests

## Key Features Implemented

### ✅ Game State Management
- Complete zone system with 10 zones per player
- Resource pools (Energy and domain-specific Power)
- Victory point tracking and scoring
- Turn and priority management

### ✅ Type Safety
- Comprehensive TypeScript types for all game concepts
- Proper move parameter typing
- Card type definitions with full inheritance

### ✅ Testing Infrastructure
- Test engine with mock game states
- Assertion utilities for game state validation
- Support for custom initial states

### 🔄 In Progress
- Move system implementation (basic structure complete)
- Card definitions and abilities
- Combat and showdown mechanics
- Keyword implementations

### 📋 Planned
- Complete card database
- Game flow segments
- Network synchronization
- Advanced rule enforcement

## Usage

### Basic Test Setup

```typescript
import { RiftboundTestEngine } from './src/testing/riftbound-test-engine';

// Create a test game
const testEngine = new RiftboundTestEngine();

// Verify initial state
testEngine.assertThatZonesContain({
  deck: 40,
  hand: 4,
  resourceDeck: 12,
}, "player_one");

// Make moves
testEngine.endTurn();
testEngine.drawCard(2);
```

### Custom Initial States

```typescript
// Create engine with custom zone counts
const customEngine = new RiftboundTestEngine(
  { hand: 7, deck: 30 }, // Player one state
  { hand: 5, deck: 35 }  // Player two state
);
```

### Move Execution

```typescript
// Execute moves with type safety
const result = engine.processMove("playCard", {
  instanceId: "card-123",
  targets: ["target-456"],
  location: "battlefield-1",
});

if (result.success) {
  console.log("Move successful!");
} else {
  console.log("Move failed:", result.error);
}
```

## Game Rules Implementation

### Zones and Visibility
- **Public zones**: battleArea, shieldBase, shieldSection, removalArea, trash
- **Private zones**: hand (owner only)
- **Secret zones**: deck, resourceDeck, sideboard (face-down)

### Resource System
- **Energy**: Generic numeric resource for all costs
- **Power**: Domain-specific colored resource
- **Rune Pools**: Empty at end of draw phase and end of turn

### Combat System
- **Showdowns**: Interaction windows during combat
- **Chain System**: Stack-based spell/ability resolution
- **Battlefield Control**: Conquest and holding mechanics

### Victory Conditions
- **1v1 Modes**: 8 points to win
- **2v2 Mode**: 11 points to win
- **Final Point**: Special restrictions for winning

## Development Status

This engine is in active development. The core structure is complete and functional for testing, with ongoing work on:

1. **Card System**: Complete card definitions and abilities
2. **Move Implementation**: Full rule enforcement for all moves
3. **Combat System**: Complex showdown and chain mechanics
4. **Game Modes**: Support for all official play modes
5. **Performance**: Optimization for large game states

## Testing

Run the test suite:

```bash
bun test src/game-engine/engines/riftbound/
```

The test engine provides comprehensive utilities for testing game logic with mock states and assertions.

## Contributing

When adding new features:

1. Update type definitions in `src/riftbound-engine-types.ts`
2. Implement moves in `src/moves/moves.ts` 
3. Add tests using `RiftboundTestEngine`
4. Update this README with new functionality

The engine follows the same patterns as the existing Lorcana and Gundam engines for consistency.

---

For detailed game rules, see [RULES.md](RULES.md). For visual representations of game flow, see [FLOWCHARTS.md](FLOWCHARTS.md), and for definitions of terms, see [GLOSSARY.md](GLOSSARY.md). 