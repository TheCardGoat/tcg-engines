# Game Engine Integration Guide

This document describes how to integrate a specific game engine with the core TCG framework. It includes patterns, best practices, and examples.

## Integration Architecture

The core engine provides the framework and infrastructure, while game engines implement game-specific rules and state:

```
┌───────────────────┐                 ┌───────────────────┐
│                   │                 │                   │
│                   │                 │                   │
│   Core Engine     │◄────Extends─────┤   Game Engine     │
│                   │                 │                   │
│                   │                 │                   │
└───────────┬───────┘                 └───────────┬───────┘
            │                                     │
            │                                     │
            │                                     │
            │                                     │
            ▼                                     ▼
┌───────────────────┐                 ┌───────────────────┐
│                   │                 │                   │
│  Generic Systems  │                 │  Game-Specific    │
│                   │                 │  Implementation   │
│  - Flow control   │                 │                   │
│  - State mgmt     │                 │  - Game state (G) │
│  - Event system   │                 │  - Card defs      │
│  - Move validation│                 │  - Rules          │
│                   │                 │  - Effects        │
└───────────────────┘                 └───────────────────┘
```

## Integration Requirements

To integrate a game engine with the core framework, you need to implement:

1. **Game State Definition**: Define the structure of your game's state (G)
2. **Flow Configuration**: Configure the flow of your game using the core flow interfaces
3. **Move Definitions**: Implement game-specific moves using the move system
4. **Card Definitions**: Define cards and their effects
5. **Game Definition**: Create a GameDefinition that combines all of the above

## Step-by-Step Integration

### 1. Define Game State Interface

Create a typed interface for your game's state:

```typescript
// src/game-engines/your-game/src/game-state.ts
export interface YourGameState {
  // Player state
  players: {
    [playerID: string]: {
      hand: CardInstance[];
      field: CardInstance[];
      deck: CardInstance[];
      discard: CardInstance[];
      resources: number;
      health: number;
    }
  };
  
  // Game state
  turn: number;
  phase: string;
  stack: Effect[];
  
  // Game-specific state
  specialResource: number;
  globalModifiers: Modifier[];
  
  // Any other game-specific data
}
```

### 2. Configure Game Flow

Define your game's flow using the FlowConfiguration interface:

```typescript
// src/game-engines/your-game/src/flow-config.ts
import { createFlowConfiguration } from "core-engine/flow/flow-config";
import type { FlowConfiguration } from "core-engine/flow";

export const yourGameFlowConfig: FlowConfiguration = createFlowConfiguration({
  turns: {
    phases: [
      {
        id: "start",
        name: "Start Phase",
        description: "Beginning of turn: draw cards, gain resources",
        allowsPriorityPassing: false,
        steps: [
          {
            id: "untap",
            name: "Untap Step",
            description: "Untap all cards",
            allowsPriorityPassing: false,
            advancesTo: "nextStep"
          },
          {
            id: "draw",
            name: "Draw Step",
            description: "Draw a card",
            allowsPriorityPassing: false,
            advancesTo: "nextPhase"
          }
        ],
        advancesTo: "nextPhase"
      },
      {
        id: "main",
        name: "Main Phase",
        description: "Play cards and activate abilities",
        allowsPriorityPassing: true,
        advancesTo: "nextPhase"
      },
      {
        id: "end",
        name: "End Phase",
        description: "End of turn cleanup",
        allowsPriorityPassing: true,
        advancesTo: "nextTurn"
      }
    ]
  },
  
  priority: {
    initialPriority: "turnPlayer",
    allowPriorityPassing: {
      main: true,
      end: true
    },
    autoPriorityAdvance: {
      untap: "nextStep",
      draw: "nextPhase",
      main: false,
      end: "nextTurn"
    }
  },
  
  specialRules: {
    // Game-specific rules
    maxCardsPerTurn: 1,
    resourceGainPerTurn: 1
  }
});
```

### 3. Implement Game Moves

Define game-specific moves using the move system:

```typescript
// src/game-engines/your-game/src/moves.ts
import { withPriorityCheck } from "core-engine/flow/flow-utils";
import type { YourGameState } from "./game-state";

// Define move types for your game
export type YourGameMove = (
  params: { G: YourGameState; ctx: any; playerID?: string },
  ...args: any[]
) => YourGameState;

// Example: Play card move
export const playCard: YourGameMove = withPriorityCheck(
  ({ G, playerID }, cardId: string) => {
    if (!playerID) return G;
    
    // Find the card in player's hand
    const player = G.players[playerID];
    const cardIndex = player.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return G;
    
    const card = player.hand[cardIndex];
    
    // Check if player has enough resources
    if (player.resources < card.cost) return G;
    
    // Remove card from hand
    const newHand = [...player.hand];
    newHand.splice(cardIndex, 1);
    
    // Add card to field
    const newField = [...player.field, card];
    
    // Spend resources
    const newResources = player.resources - card.cost;
    
    // Update game state
    return {
      ...G,
      players: {
        ...G.players,
        [playerID]: {
          ...player,
          hand: newHand,
          field: newField,
          resources: newResources
        }
      }
    };
  }
);

// Example: Activate ability move
export const activateAbility: YourGameMove = withPriorityCheck(
  ({ G, playerID }, cardId: string, abilityIndex: number) => {
    // Implement ability activation
    return G;
  }
);

// Define all moves
export const moves = {
  playCard,
  activateAbility,
  passTurn: ({ G }) => G, // Using built-in passTurn event instead
  passPriority: ({ G }) => G, // Using built-in passPriority event instead
};
```

### 4. Define Card System

Create your game's card system:

```typescript
// src/game-engines/your-game/src/cards/card-model.ts
export interface YourGameCard {
  id: string;           // Card definition ID
  name: string;
  cost: number;
  type: CardType;
  text: string;
  abilities: Ability[];
  
  // Card type specific properties
  power?: number;
  health?: number;
  specialAbilities?: string[];
  
  // Metadata
  set: string;
  rarity: string;
  artist: string;
}

export interface CardInstance {
  id: string;           // Unique instance ID
  definitionId: string; // Reference to card definition
  owner: string;
  controller: string;
  zone: string;
  tapped: boolean;
  counters: Record<string, number>;
  modifiers: Modifier[];
}

// src/game-engines/your-game/src/cards/card-definitions.ts
export const cardDefinitions: Record<string, YourGameCard> = {
  "card-001": {
    id: "card-001",
    name: "Basic Unit",
    cost: 2,
    type: "Unit",
    text: "When this enters play, draw a card.",
    power: 2,
    health: 2,
    abilities: [
      {
        trigger: "enters-play",
        effect: { type: "draw", amount: 1 }
      }
    ],
    set: "core",
    rarity: "common",
    artist: "Artist Name"
  },
  // More card definitions...
};
```

### 5. Create Game Definition

Put everything together into a GameDefinition:

```typescript
// src/game-engines/your-game/src/game-definition.ts
import type { GameDefinition } from "core-engine/game-configuration";
import { yourGameFlowConfig } from "./flow-config";
import { moves } from "./moves";
import type { YourGameState } from "./game-state";
import { createCardManager } from "./cards/card-manager";

// Define your game
export const YourGameDefinition: GameDefinition<YourGameState> = {
  name: "your-game",
  numPlayers: 2,
  
  // Add flow configuration
  flow: yourGameFlowConfig,
  
  // Initial game setup
  setup: (context) => {
    const { ctx } = context;
    const players = {};
    
    // Initialize player state
    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerID = String(i);
      players[playerID] = {
        hand: [],
        field: [],
        deck: [], // Will be populated with initial deck
        discard: [],
        resources: 0,
        health: 30
      };
    }
    
    // Return initial game state
    return {
      players,
      turn: 1,
      phase: "start",
      stack: [],
      specialResource: 0,
      globalModifiers: []
    };
  },
  
  // Game moves
  moves: moves,
  
  // Game end condition
  endIf: ({ G }) => {
    // Check if a player has 0 or less health
    for (const playerID in G.players) {
      if (G.players[playerID].health <= 0) {
        // Find the winner (assuming 2 players)
        const winnerId = Object.keys(G.players).find(id => id !== playerID);
        return { winner: winnerId };
      }
    }
    
    // Check if a player cannot draw (deck is empty)
    for (const playerID in G.players) {
      if (G.players[playerID].deck.length === 0) {
        // Find the winner
        const winnerId = Object.keys(G.players).find(id => id !== playerID);
        return { winner: winnerId };
      }
    }
    
    // Game continues
    return false;
  },
  
  // Player view (for hiding information)
  playerView: ({ G, playerID }) => {
    if (!playerID) return G; // Spectator view
    
    // Create a copy of G
    const playerView = { ...G };
    
    // Hide opponents' hands and face-down cards
    for (const pid in playerView.players) {
      if (pid !== playerID) {
        playerView.players[pid] = {
          ...playerView.players[pid],
          hand: playerView.players[pid].hand.map(card => ({ 
            ...card, 
            // Hide card details
            definitionId: "unknown" 
          })),
          // Hide other secret information...
        };
      }
    }
    
    return playerView;
  }
};
```

### 6. Game Engine Entry Point

Create the main entry point for your game engine:

```typescript
// src/game-engines/your-game/src/index.ts
import { createGame } from "core-engine/game";
import { YourGameDefinition } from "./game-definition";

// Create the game instance
export const YourGame = createGame(YourGameDefinition);

// Export key types and interfaces
export type { YourGameState } from "./game-state";
export { yourGameFlowConfig } from "./flow-config";
export { moves } from "./moves";

// Export utility functions if needed
export * from "./utils";

// Export card system
export * from "./cards/card-model";
export { cardDefinitions } from "./cards/card-definitions";
```

## Advanced Integration Patterns

### Plugin System

Extend your game with plugins:

```typescript
// src/game-engines/your-game/src/plugins/achievement-plugin.ts
import type { Plugin } from "core-engine/plugins";
import type { YourGameState } from "../game-state";

export const AchievementPlugin: Plugin<YourGameState> = {
  name: "achievements",
  
  // Set up achievements in initial state
  setup: (state) => {
    return {
      ...state,
      G: {
        ...state.G,
        achievements: {
          unlocked: [],
          progress: {}
        }
      }
    };
  },
  
  // Add achievement-specific moves
  moves: {
    checkAchievement: ({ G, playerID }, achievementId) => {
      // Check achievement logic
      return G;
    }
  },
  
  // Event handlers for tracking achievements
  events: {
    onMoveEnd: (state, { move, args, returnValue }) => {
      // Track move-based achievements
      return state;
    }
  }
};

// Use the plugin in your game definition
YourGameDefinition.plugins = [AchievementPlugin];
```

### Custom Effect Resolution

Implement game-specific effect resolution:

```typescript
// src/game-engines/your-game/src/effects/effect-system.ts
import { createEffectManager, EffectResolutionModel } from "core-engine/effects";
import type { YourGameState } from "../game-state";
import type { Effect } from "core-engine/effects";

// Create custom resolution model
export class YourGameEffectModel implements EffectResolutionModel<YourGameState> {
  addEffect(state, effect) {
    // Add effect to stack
    return {
      ...state,
      G: {
        ...state.G,
        stack: [...state.G.stack, effect]
      }
    };
  }
  
  resolveEffects(state) {
    // Resolve effects in LIFO order
    const stack = [...state.G.stack];
    let newState = state;
    
    while (stack.length > 0) {
      const effect = stack.pop();
      newState = this.resolveEffect(newState, effect);
    }
    
    // Clear stack
    return {
      ...newState,
      G: {
        ...newState.G,
        stack: []
      }
    };
  }
  
  resolveEffect(state, effect) {
    // Resolve specific effect
    switch (effect.type) {
      case "draw":
        return this.resolveDraw(state, effect);
      case "damage":
        return this.resolveDamage(state, effect);
      // Other effect types...
      default:
        return state;
    }
  }
  
  // Effect-specific implementations
  private resolveDraw(state, effect) {
    // Implementation...
    return state;
  }
  
  private resolveDamage(state, effect) {
    // Implementation...
    return state;
  }
  
  getActiveEffects(state) {
    return state.G.stack;
  }
}

// Create and configure your effect manager
export const yourGameEffectManager = createEffectManager({
  resolutionModel: new YourGameEffectModel(),
  // Other configuration...
});
```

## Best Practices

1. **Type Everything**: Use TypeScript interfaces for all game-specific types
2. **Immutable Updates**: Always create new state objects, never mutate existing ones
3. **Validation First**: Validate moves before applying them
4. **Function Composition**: Use higher-order functions to add behaviors to moves
5. **Clear Separation**: Keep core engine and game engine code clearly separated

## Testing Your Integration

Test your game engine integration:

```typescript
// src/game-engines/your-game/src/__tests__/basic-flow.test.ts
import { YourGame } from "../index";

describe("YourGame basic flow", () => {
  it("initializes with correct state", () => {
    const game = YourGame.setup();
    
    expect(game.G.players["0"]).toBeDefined();
    expect(game.G.players["1"]).toBeDefined();
    expect(game.ctx.currentPhase).toBe("start");
    expect(game.ctx.currentStep).toBe("untap");
  });
  
  it("allows playing a card", () => {
    let game = YourGame.setup();
    
    // Set up test state
    game = {
      ...game,
      G: {
        ...game.G,
        players: {
          ...game.G.players,
          "0": {
            ...game.G.players["0"],
            hand: [{ id: "card-1", definitionId: "card-001", /* other props */ }],
            resources: 5
          }
        }
      },
      ctx: {
        ...game.ctx,
        currentPhase: "main",
        priorityPlayerPos: 0
      }
    };
    
    // Execute move
    const newGame = YourGame.makeMove(game, "playCard", "0", "card-1");
    
    // Check results
    expect(newGame.G.players["0"].hand.length).toBe(0);
    expect(newGame.G.players["0"].field.length).toBe(1);
    expect(newGame.G.players["0"].resources).toBe(3); // Cost was 2
  });
  
  // More tests...
});
```

## Common Integration Challenges

### 1. State Management Complexity

**Challenge**: Managing complex state updates for deeply nested game state.

**Solution**: Use utility functions for immutable updates:

```typescript
// src/game-engines/your-game/src/utils/state-utils.ts
export function updatePlayerState<G extends { players: Record<string, any> }>(
  G: G,
  playerID: string,
  updater: (playerState: any) => any
): G {
  return {
    ...G,
    players: {
      ...G.players,
      [playerID]: updater(G.players[playerID])
    }
  };
}

// Usage:
return updatePlayerState(G, playerID, player => ({
  ...player,
  hand: [...player.hand, newCard]
}));
```

### 2. Effect Sequencing

**Challenge**: Managing complex sequences of effects that depend on each other.

**Solution**: Implement a specialized effect queue:

```typescript
// Handling effect sequencing
function processEffectQueue(state: State<YourGameState>): State<YourGameState> {
  // Get the effect queue
  const queue = state.G.effectQueue || [];
  if (queue.length === 0) return state;
  
  // Process the next effect
  const [nextEffect, ...remainingEffects] = queue;
  
  // Apply the effect
  let nextState = applyEffect(state, nextEffect);
  
  // Update the queue
  nextState = {
    ...nextState,
    G: {
      ...nextState.G,
      effectQueue: remainingEffects
    }
  };
  
  // If the effect created new effects, process those next
  if (nextEffect.generatedEffects && nextEffect.generatedEffects.length > 0) {
    nextState = {
      ...nextState,
      G: {
        ...nextState.G,
        effectQueue: [
          ...nextEffect.generatedEffects,
          ...nextState.G.effectQueue
        ]
      }
    };
  }
  
  // Continue processing if there are more effects
  if (nextState.G.effectQueue.length > 0) {
    return processEffectQueue(nextState);
  }
  
  return nextState;
}
```

### 3. Game-Specific Validation

**Challenge**: Implementing game-specific validation that goes beyond core engine validation.

**Solution**: Use validator functions that can be composed:

```typescript
// src/game-engines/your-game/src/validators.ts
export function validateResourceCost(
  cardCostFn: (card: any) => number
): (params: { G: YourGameState; ctx: any; playerID?: string }, cardId: string) => boolean {
  return ({ G, playerID }, cardId) => {
    if (!playerID) return false;
    const player = G.players[playerID];
    const card = player.hand.find(c => c.id === cardId);
    if (!card) return false;
    
    const cost = cardCostFn(card);
    return player.resources >= cost;
  };
}

// Usage with move validation
const playCard = validateMove(
  validateResourceCost(card => card.cost),
  ({ G, playerID }, cardId) => {
    // Move implementation assuming validation passed
    return G;
  }
);
```

This integration guide provides a comprehensive framework for implementing a game engine that works with the core TCG engine.