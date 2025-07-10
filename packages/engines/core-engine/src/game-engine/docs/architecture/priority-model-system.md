# Priority Model System

This document describes the priority model system implemented in the core engine, which allows different games to define and use custom priority handling mechanisms.

## Overview

The priority model system provides a flexible way for games to define how priority passes between players. It supports different priority models based on game-specific rules:

1. **Turn-Based Priority** - Used in games like Magic: The Gathering, where priority passes around the table in turn order
2. **APNAP Priority** - Used in games like One Piece, where priority alternates between Active Player and Non-Active Players
3. **Focus-Based Priority** - Used in games like Riftbound, where priority is determined by game-specific "focus" mechanics
4. **Custom Priority** - Custom implementations for games with unique priority handling

## Architecture

The priority model system consists of the following components:

1. **PriorityModel Interface** - Defines the contract for all priority models
2. **Concrete Priority Model Implementations** - Turn-based, APNAP, Focus-based models
3. **Priority Factory** - Creates appropriate priority model instances based on game configuration
4. **Flow Controller Integration** - Uses priority models to manage game flow
5. **Flow Manager Integration** - Centralizes priority management operations

## PriorityModel Interface

All priority models implement the `PriorityModel` interface:

```typescript
export interface PriorityModel<G = any> {
  /**
   * Gets the player who should have initial priority
   */
  getInitialPriority: (ctx: any) => string;

  /**
   * Gets the next player in priority order
   */
  getNextPriority: (state: State<G>) => string | null;

  /**
   * Handles what happens when priority passes all the way around
   */
  handlePriorityCompletion: (
    state: State<G>,
    flowController: FlowController<G>
  ) => {
    advancementType: "nextStep" | "nextPhase" | "nextTurn" | null;
    nextId?: string;
  };
}
```

## Available Priority Models

### Turn-Based Priority Model

The Turn-Based model is the default model used by most card games. It implements these behaviors:

- Initial priority goes to the turn player
- Priority passes around the table in turn order
- When priority passes back to the turn player, the game state advances based on configuration

```typescript
export function createTurnBasedPriorityModel<G = any>(): PriorityModel<G> {
  return {
    getInitialPriority: (ctx) => getCurrentTurnPlayer(ctx),
    getNextPriority: (state) => getNextPlayerInTurnOrder(state),
    handlePriorityCompletion: (state, flowController) => flowController.getAutomaticAdvancement(state)
  };
}
```

### APNAP Priority Model

The APNAP (Active Player, Non-Active Player) model implements these behaviors:

- Initial priority goes to the turn player
- When turn player passes priority, it goes to the first non-active player
- Priority cycles through all non-active players
- After all non-active players pass, priority returns to the turn player

```typescript
export function createAPNAPPriorityModel<G = any>(): PriorityModel<G> {
  return {
    getInitialPriority: (ctx) => getCurrentTurnPlayer(ctx),
    getNextPriority: (state) => {
      // Implementation details...
    },
    handlePriorityCompletion: (state, flowController) => flowController.getAutomaticAdvancement(state)
  };
}
```

### Focus-Based Priority Model

The Focus-Based model allows for custom priority determination:

- Initial priority typically goes to the turn player
- Next priority is determined by a game-specific function
- Focus can shift based on game events or card effects

```typescript
export function createFocusBasedPriorityModel<G = any>(
  determineNextFocusPlayer: (state: State<G>) => string | null
): PriorityModel<G> {
  return {
    getInitialPriority: (ctx) => getCurrentTurnPlayer(ctx),
    getNextPriority: (state) => determineNextFocusPlayer(state),
    handlePriorityCompletion: (state, flowController) => flowController.getAutomaticAdvancement(state)
  };
}
```

## Priority Configuration

Games can configure their priority model through the `FlowConfiguration`:

```typescript
const flowConfig: FlowConfiguration = {
  turns: {
    phases: [/* phase definitions */]
  },
  priority: {
    initialPriority: "turnPlayer",
    priorityModel: "turn-based", // "turn-based", "apnap", "focus-based", "custom"
    customPriorityModel: /* optional custom priority model */,
    allowPriorityPassing: {
      main: true,
      combat: true
    },
    autoPriorityAdvance: {
      main: "nextPhase",
      combat: "nextTurn"
    }
  }
};
```

## Integration with Flow System

The priority model is integrated with the flow system through:

1. **FlowController** - Creates and manages the appropriate priority model
2. **FlowManager** - Uses the priority model to handle priority events
3. **Events** - Priority events are processed through the flow manager

## Using Priority Models

### Basic Usage

For most games, using the default Turn-Based priority model is sufficient:

```typescript
const gameDefinition: GameDefinition = {
  flow: {
    turns: {
      phases: [/* phase definitions */]
    },
    priority: {
      initialPriority: "turnPlayer"
      // No priorityModel specified = turn-based by default
    }
  }
};
```

### Using APNAP Priority

For games that need APNAP style priority:

```typescript
const gameDefinition: GameDefinition = {
  flow: {
    turns: {
      phases: [/* phase definitions */]
    },
    priority: {
      initialPriority: "turnPlayer",
      priorityModel: "apnap"
    }
  }
};
```

### Using Focus-Based Priority

For games with custom focus mechanics:

```typescript
import { createFocusBasedPriorityModel } from "../flow/priority-models";

// Custom focus determination function
function determineNextFocusPlayer(state) {
  // Game-specific logic to determine who gets focus next
  return playerWithFocus;
}

const focusModel = createFocusBasedPriorityModel(determineNextFocusPlayer);

const gameDefinition: GameDefinition = {
  flow: {
    turns: {
      phases: [/* phase definitions */]
    },
    priority: {
      initialPriority: "turnPlayer",
      priorityModel: "focus-based",
      customPriorityModel: focusModel
    }
  }
};
```

## Advanced Features

### Custom Validation

The priority model can be used to validate player moves:

```typescript
// Automatically validate moves based on priority
const validateMove = flowController.createPriorityValidator();
const validatedMoveFunction = validateMove(originalMoveFunction);
```

### Automatic Advancement

The priority model determines what happens when priority completes a cycle:

- Move to the next step in the current phase
- Move to the next phase in the current turn
- Move to the next turn
- Stay in the current state

This is configured through:

```typescript
flow: {
  priority: {
    autoPriorityAdvance: {
      main: "nextPhase",
      combat: "nextTurn",
      upkeep: "nextStep"
    }
  }
}
```

## Implementation Examples

### Magic: The Gathering Style

```typescript
const mtgFlowConfig: FlowConfiguration = {
  turns: {
    phases: [
      {
        id: "beginning",
        name: "Beginning Phase",
        steps: [
          { id: "untap", name: "Untap Step", allowsPriorityPassing: false },
          { id: "upkeep", name: "Upkeep Step", allowsPriorityPassing: true },
          { id: "draw", name: "Draw Step", allowsPriorityPassing: true }
        ]
      },
      // More phases...
    ]
  },
  priority: {
    initialPriority: "turnPlayer",
    priorityModel: "turn-based",
    allowPriorityPassing: {
      upkeep: true,
      draw: true,
      precombat: true,
      // More phases...
    },
    autoPriorityAdvance: {
      untap: "nextStep",
      upkeep: "nextStep",
      draw: "nextPhase",
      // More phases and steps...
    }
  }
};
```

### Lorcana Style

```typescript
const lorcanaFlowConfig: FlowConfiguration = {
  turns: {
    phases: [
      {
        id: "beginning",
        name: "Beginning",
        steps: [
          { id: "ready", name: "Ready Step", allowsPriorityPassing: false },
          { id: "set", name: "Set Step", allowsPriorityPassing: false },
          { id: "draw", name: "Draw Step", allowsPriorityPassing: false }
        ]
      },
      { id: "main", name: "Main", allowsPriorityPassing: true },
      { id: "endOfTurn", name: "End of Turn", allowsPriorityPassing: true }
    ]
  },
  priority: {
    initialPriority: "turnPlayer",
    priorityModel: "turn-based",
    allowPriorityPassing: {
      beginning: false,
      main: true,
      endOfTurn: true
    },
    autoPriorityAdvance: {
      ready: "nextStep",
      set: "nextStep",
      draw: "nextPhase",
      main: false, // Don't auto-advance
      endOfTurn: "nextTurn"
    }
  }
};
```

## Conclusion

The priority model system provides a flexible framework for implementing various priority handling mechanisms across different games. By abstracting priority rules into model implementations, the core engine can support a wide variety of card games while maintaining a consistent interface.