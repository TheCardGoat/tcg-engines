# Game Definition

This directory contains the Lorcana game definition - the declarative configuration that defines how Lorcana works within the `@tcg/core` framework.

## Structure

### Core Files

- **`lorcana-game-definition.ts`** - Main `GameDefinition` export that integrates all components
- **`state-shape.ts`** - Lorcana-specific game state type definitions
- **`zones.ts`** - Zone configurations (Deck, Hand, Play, Discard, Inkwell)
- **`flow.ts`** - Turn/phase/step flow definition using XState
- **`setup.ts`** - Game setup and initialization logic
- **`index.ts`** - Public exports

## Purpose

The game definition is the central configuration that tells the `@tcg/core` framework:

1. **What the game state looks like** - State shape including Lorcana-specific data (lore counts, challenge state, etc.)
2. **What moves are available** - Registry of all move handlers (playCard, quest, challenge, etc.)
3. **What zones exist** - Configuration for each zone and its properties
4. **How turns flow** - Phase structure and transitions (Beginning → Main → End)
5. **How games start** - Setup logic for initial state (shuffle decks, draw hands, etc.)

## Integration Pattern

```typescript
import { createGameDefinition } from "@tcg/core";
import type { LorcanaState } from "./state-shape";
import { lorcanaZones } from "./zones";
import { lorcanaFlow } from "./flow";
import { setupLorcanaGame } from "./setup";
import { lorcanaMoves } from "../moves";

export const lorcanaGame = createGameDefinition<LorcanaState>({
  id: "lorcana",
  name: "Disney Lorcana",
  version: "1.0.0",
  
  players: {
    min: 2,
    max: 2,
  },
  
  // Move registry
  moves: lorcanaMoves,
  
  // Zone configuration
  zones: lorcanaZones,
  
  // Flow definition
  flow: lorcanaFlow,
  
  // Setup function
  setup: setupLorcanaGame,
});
```

## State Shape Design

The Lorcana state extends the base `GameState` from `@tcg/core` with game-specific data:

```typescript
type LorcanaState = GameState & {
  lorcana: {
    // Lore tracking
    lore: Record<PlayerId, number>;
    
    // Challenge state
    challengeState?: {
      attacker: CardId;
      defender?: CardId;
    };
    
    // Any other Lorcana-specific state
  };
};
```

This keeps the core framework agnostic while allowing full customization.

## Zones Configuration

Defines all zones in Lorcana with their properties:

```typescript
const lorcanaZones = {
  deck: {
    visibility: "owner",
    ordered: true,
  },
  hand: {
    visibility: "owner",
    ordered: false,
  },
  play: {
    visibility: "all",
    ordered: false,
  },
  discard: {
    visibility: "all",
    ordered: true,
  },
  inkwell: {
    visibility: "owner",
    ordered: false,
  },
};
```

## Flow Definition

Defines the turn structure using XState state machine:

- **Beginning Phase**: Ready step, Draw step
- **Main Phase**: Play cards, Quest, Challenge, Activate abilities
- **End Phase**: End of turn effects, Clean up

## Setup Logic

Initializes a new Lorcana game:

1. Create initial state structure
2. Assign decks to players
3. Shuffle decks with seeded RNG
4. Draw initial hands
5. Determine starting player
6. Set initial lore to 0

## References

- See `@packages/core/ENGINE_INTEGRATION.md` for detailed integration guide
- See `@packages/core` source for base types and interfaces

