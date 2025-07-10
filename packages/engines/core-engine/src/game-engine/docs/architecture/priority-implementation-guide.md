# Priority Model Implementation Guide

This guide provides a step-by-step walkthrough for implementing a custom priority model in a game engine using the core engine's priority model system.

## Overview

The priority model system allows different card games to define their own rules for how priority passes between players. This is critical for implementing various game mechanics such as:

- Turn-based actions (like Magic: The Gathering)
- Active Player, Non-Active Player order (like One Piece)
- Focus-based priority (like Riftbound)
- Stack-based resolution systems
- Custom priority rules for specific game phases

## Implementation Steps

### 1. Choose a Priority Model Type

First, decide which priority model best fits your game:

- **Turn-Based**: Priority passes in turn order, active player gets priority first
- **APNAP**: Active player gets priority first, then all non-active players, then back to active
- **Focus-Based**: Game-specific rules determine who gets priority
- **Custom**: Completely custom priority rules

### 2. Configure Flow in Game Definition

Update your game definition to use the chosen priority model:

```typescript
// Example for a turn-based game (like Lorcana)
const gameDefinition: GameDefinition = {
  flow: {
    turns: {
      phases: [
        {
          id: "beginning",
          name: "Beginning Phase",
          steps: [
            { id: "ready", name: "Ready Step", allowsPriorityPassing: false },
            { id: "set", name: "Set Step", allowsPriorityPassing: false },
            { id: "draw", name: "Draw Step", allowsPriorityPassing: false }
          ],
          allowsPriorityPassing: false
        },
        {
          id: "main",
          name: "Main Phase",
          allowsPriorityPassing: true
        },
        {
          id: "endOfTurn",
          name: "End of Turn Phase", 
          allowsPriorityPassing: true
        }
      ]
    },
    priority: {
      initialPriority: "turnPlayer",
      priorityModel: "turn-based", // Specify priority model type
      allowPriorityPassing: {
        main: true,
        endOfTurn: true
      },
      autoPriorityAdvance: {
        ready: "nextStep",
        set: "nextStep", 
        draw: "nextPhase",
        main: false, // Don't auto-advance when priority cycles
        endOfTurn: "nextTurn" // Move to next turn when priority cycles
      }
    }
  }
};
```

### 3. Implementing Custom Priority Model

If your game needs a custom priority model:

```typescript
import { 
  createFocusBasedPriorityModel, 
  PriorityModel 
} from "@lorcanito/core-engine";

// Define function for determining the next focus player
function determineNextFocusPlayer(state: State): string | null {
  // Custom game logic to decide which player gets priority next
  // For example, in Riftbound:
  if (state.G.lastActivePlayer) {
    return state.G.lastActivePlayer;
  }
  
  // Default to turn player if no specific focus
  return getCurrentTurnPlayer(state.ctx);
}

// Create the priority model
const focusPriorityModel = createFocusBasedPriorityModel(determineNextFocusPlayer);

// Use in game definition
const gameDefinition: GameDefinition = {
  flow: {
    // ...turns configuration...
    priority: {
      initialPriority: "turnPlayer",
      priorityModel: "focus-based",
      customPriorityModel: focusPriorityModel,
      // ...other priority configuration...
    }
  }
};
```

### 4. Validating Player Moves

Ensure that only players with priority can perform moves by using the priority validation system:

```typescript
import { createMoveValidator } from "@lorcanito/core-engine";

// Create a move validator using your game definition
const withPriorityCheck = createMoveValidator(gameDefinition);

// Define moves with priority validation
const moves = {
  playCard: withPriorityCheck(({ G, ctx, playerID }, cardId) => {
    // Move implementation
    // This will only execute if the player has priority
    return G;
  }),
  
  passPriority: true, // Use built-in passPriority event
  passTurn: true,     // Use built-in passTurn event
};
```

### 5. Using Priority Events in UI

In your game UI, provide buttons for passing priority and turn:

```typescript
// React component example
function GameControls({ G, ctx, playerID, moves, events }) {
  const hasPriority = ctx.priorityPlayer === playerID;
  
  return (
    <div className="game-controls">
      {hasPriority && (
        <>
          <button onClick={() => events.passPriority()}>
            Pass Priority
          </button>
          
          <button onClick={() => events.passTurn()}>
            Pass Turn
          </button>
        </>
      )}
    </div>
  );
}
```

### 6. Automatic State Advancement

Configure what happens when all players pass priority without taking actions:

```typescript
// In your flow configuration:
priority: {
  autoPriorityAdvance: {
    main: "nextPhase",     // Go to next phase when priority cycles
    combat: "nextStep",     // Go to next step when priority cycles
    endPhase: "nextTurn"   // Go to next turn when priority cycles
  }
}
```

### 7. Testing Priority Rules

Write tests to verify your priority model is working correctly:

```typescript
describe("My Game Priority Model", () => {
  it("should initialize with turn player having priority", () => {
    // Set up test state
    const initialState = {...};
    
    // Verify initial priority
    expect(getCurrentPriorityPlayer(initialState.ctx)).toBe("0");
  });
  
  it("should pass priority to next player in order", () => {
    // Set up test state with player 0 having priority
    let state = {...};
    
    // Pass priority
    state = processEvent(state, { name: "passPriority" }, gameDefinition);
    
    // Verify priority passed to player 1
    expect(getCurrentPriorityPlayer(state.ctx)).toBe("1");
  });
  
  it("should advance to next phase when priority cycles", () => {
    // Set up test state in main phase with player 2 having priority
    let state = {...};
    
    // Pass priority (which should cycle back to turn player)
    state = processEvent(state, { name: "passPriority" }, gameDefinition);
    
    // Verify phase advanced
    expect(state.ctx.currentPhase).toBe("combat");
  });
});
```

## Advanced Usage

### Priority Models for Different Phases

Some games have different priority models for different phases:

```typescript
function createHybridPriorityModel(gameState: State): PriorityModel {
  // Use different priority models based on phase
  if (gameState.ctx.currentPhase === "combat") {
    return createAPNAPPriorityModel();
  } else {
    return createTurnBasedPriorityModel();
  }
}

// In your flow configuration:
priority: {
  priorityModel: "custom",
  customPriorityModel: createHybridPriorityModel(gameState)
}
```

### Stack-Based Priority Systems

For games with a stack-based resolution system (like Magic):

```typescript
function createStackBasedPriorityModel(): PriorityModel {
  return {
    getInitialPriority: (ctx) => getCurrentTurnPlayer(ctx),
    
    getNextPriority: (state) => {
      // Standard turn order priority passing
      const nextPlayer = getNextPlayerInTurnOrder(state);
      return nextPlayer;
    },
    
    handlePriorityCompletion: (state, flowController) => {
      // If there's something on the stack, resolve it
      if (state.G.stack && state.G.stack.length > 0) {
        // Return special advancement type for stack resolution
        return {
          advancementType: "resolveStack",
          nextId: null
        };
      }
      
      // Otherwise use normal advancement
      return flowController.getAutomaticAdvancement(state);
    }
  };
}
```

## Best Practices

1. **Keep It Simple**: Start with a standard priority model and only customize if needed
2. **Clear UI Feedback**: Ensure players know who has priority at all times
3. **Test Edge Cases**: Test priority passing with different player counts and game states
4. **Validate All Moves**: Always wrap game-changing moves with priority validation
5. **Consider Spectator Mode**: Design your system to work well with non-participating observers
6. **Handle Disconnections**: Define what happens when a player with priority disconnects