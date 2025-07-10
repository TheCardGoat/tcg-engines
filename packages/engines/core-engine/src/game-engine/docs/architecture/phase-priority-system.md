# Phase & Priority System Design

This document details the design and implementation of the phase and priority system in the TCG framework.

## Overview

The phase and priority system is a core component that manages:
1. The flow of the game through phases and steps
2. Which player can act at any given time
3. How the game state advances when players pass priority

## Hierarchical Structure

The game flow follows a hierarchical structure:

```
Segment
  └── Turn
        └── Phase
              └── Step
```
- **Segment**: A logical grouping of game actions, often corresponding to a player's turn "Setup", "Mulligan", "Gameplay", "Sideboard", etc.
- **Turn**: A complete cycle where each player gets to be the turn player
- **Phase**: Major divisions within a turn (e.g., "Draw Phase", "Main Phase")
- **Step**: Smaller divisions within a phase (e.g., "Untap Step", "Draw Step")

This structure provides a flexible framework that can model various TCG implementations.

### Transitioning

At any given time, the game must be in one segment, turn. Phases and Steps are optional but provide a way to break down the game flow further.
Moves, Actions and Events may be enable or disabled based on the current segment, turn, phase or step.
Turns alternate between players, until a segment-condition is met, at which point the game may transition to the next segment or end.
Segments, Steps and Phases may have their own rules for when they can be entered or exited, allowing for complex game flows.

## Game Configuration

Each game defines its flow using a GameDefinition object:

## Priority System

The priority system determines which player can act at any given time.

### Core Concepts

#### Moves, Actions, and Events
- **Move**: A player-initiated action that changes the game state (e.g., playing a card, attacking)
- **Action**: A user-defined operation that can be performed at any time, that do not interfer with the game flow. Like sending a message, asking for concessions, etc.
- **Event**: A game-defined occurrence that relates to a change in the game context (e.g., a player passing priority, a turn ending)

#### Priority Players

1. **Turn Player**: The player whose turn it is
2. **Priority Player**: The player who currently has priority to make moves. Actions can be executed by any player at any time, but only the priority player can make moves.
3. **Priority Passing**: The mechanism for transferring priority between players

### Priority Rules

1. Initially, the turn player gets priority at the beginning of each phase
2. Only the player with priority can make moves.
3. After a player makes a move, they retain priority (until they pass it or an event occurs that changes priority)
4. A player with priority can pass priority to the next player in turn order
5. If all players pass priority in succession without taking actions, the game automatically advances

### Priority Configuration

Each game configures its priority rules and game structure through a `GameDefinition` object.
## Flow Events

The system provides key events for managing game flow:

### `passPriority`

Passes priority to the next player in turn order.

```typescript
function passPriorityEvent(
  state: State,
  playerID: PlayerID,
  gameDefinition: GameDefinition,
): State {
  // Only the priority player can pass priority
  const priorityPlayer = getCurrentPriorityPlayer(state.ctx);
  if (priorityPlayer !== playerID) {
    return state;
  }
  
  // Check if priority passing is allowed in current state
  if (!isPriorityPassingAllowed(state, gameDefinition)) {
    return state;
  }
  
  // Find the next player in turn order
  const nextPriorityPlayer = getNextPlayerInTurnOrder(state);
  if (!nextPriorityPlayer) {
    return state;
  }
  
  // Get the current turn player
  const turnPlayer = getCurrentTurnPlayer(state.ctx);
  
  // If priority would return to turn player (completed full cycle)
  if (nextPriorityPlayer === turnPlayer) {
    // Handle automatic advancement based on configuration
    return handleAdvancement(state, gameDefinition);
  }
  
  // Otherwise, just pass priority to next player
  const newCtx = setPriorityPlayer(state.ctx, nextPriorityPlayer);
  return { ...state, ctx: newCtx };
}
```

### `passTurn`

Immediately ends the current player's turn, skipping any remaining phases or steps.

```typescript
function passTurnEvent(
  state: State,
  playerID: PlayerID,
  gameDefinition: GameDefinition,
): State {
  // Only priority player can pass the turn
  const priorityPlayer = getCurrentPriorityPlayer(state.ctx);
  if (priorityPlayer !== playerID) {
    return state;
  }
  
  // Create endTurn event
  return processEvent(
    state,
    {
      name: "endTurn",
      args: [{ force: true }],
    },
    gameDefinition,
  );
}
```

## Flow Controller

The FlowController class manages the flow configuration and provides methods for querying and manipulating the game flow:

```typescript
export class FlowController<G = any> {
  private config: FlowConfiguration;

  constructor(config: FlowConfiguration) {
    this.config = config;
  }

  // Gets the current phase configuration
  getCurrentPhase(state: State<G>): FlowPhase | null {
    const phaseId = state.ctx.currentPhase;
    if (!phaseId) return null;
    return this.getPhaseById(phaseId);
  }

  // Gets the current step configuration
  getCurrentStep(state: State<G>): FlowStep | null {
    const phaseId = state.ctx.currentPhase;
    const stepId = state.ctx.currentStep;
    
    if (!phaseId || !stepId) return null;
    
    const phase = this.getPhaseById(phaseId);
    if (!phase || !phase.steps) return null;
    
    return phase.steps.find(step => step.id === stepId) || null;
  }

  // Determines if priority passing is allowed in current state
  isPriorityPassingAllowed(state: State<G>): boolean {
    const phase = this.getCurrentPhase(state);
    const step = this.getCurrentStep(state);

    // Check step-specific configuration first
    if (step) {
      // If step explicitly defines priority passing, use that
      if (typeof step.allowsPriorityPassing === 'boolean') {
        return step.allowsPriorityPassing;
      }

      // Otherwise check in step priority passing config
      if (this.config.priority.stepPriorityPassing?.[step.id] !== undefined) {
        return !!this.config.priority.stepPriorityPassing[step.id];
      }
    }

    // Then check phase-specific configuration
    if (phase) {
      // If phase explicitly defines priority passing, use that
      if (typeof phase.allowsPriorityPassing === 'boolean') {
        return phase.allowsPriorityPassing;
      }

      // Otherwise check in phase priority passing config
      if (phase.id && this.config.priority.allowPriorityPassing?.[phase.id] !== undefined) {
        return !!this.config.priority.allowPriorityPassing[phase.id];
      }
    }

    // Default: don't allow priority passing
    return false;
  }
  
  // Other methods...
}
```

## Flow Manager

The FlowManager centralizes all flow-related operations:

```typescript
export class FlowManager<G = any> {
  private flowController: FlowController<G>;
  private gameDefinition: GameDefinition;

  constructor(flowController: FlowController<G>, gameDefinition: GameDefinition) {
    this.flowController = flowController;
    this.gameDefinition = gameDefinition;
  }
  
  // Core entry point for flow events
  processFlowEvent(
    state: State<G>,
    eventName: string,
    playerID: string,
    ...args: any[]
  ): State<G> {
    // Handle flow-specific events
    let nextState = state;
    
    switch (eventName) {
      case 'passPriority':
        nextState = this.passPriority(state, playerID);
        break;
        
      case 'passTurn':
        nextState = this.passTurn(state, playerID);
        break;
        
      default:
        // For other events, delegate to the normal event processor
        nextState = processEvent(
          state,
          {
            name: eventName,
            args,
          },
          this.gameDefinition,
        );
    }
    
    // Process any automatic advancements
    return this.processFlowState(nextState);
  }
  
  // Implementation for the passPriority event
  passPriority(state: State<G>, playerID: string): State<G> {
    // Implementation...
  }
  
  // Implementation for the passTurn event
  passTurn(state: State<G>, playerID: string): State<G> {
    // Implementation...
  }
  
  // Processes automatic advancement after events
  processFlowState(state: State<G>): State<G> {
    // Implementation...
  }
  
  // Other methods...
}
```

## Move Validation

Moves are validated based on priority through decorator functions:

```typescript
export function withPriorityCheck<G>(
  moveFn: (params: { G: G; ctx: any; playerID?: string }, ...args: any[]) => G
): (params: { G: G; ctx: any; playerID?: string }, ...args: any[]) => G {
  return ({ G, ctx, playerID, ...rest }, ...args) => {
    // If player doesn't have priority, return G unchanged
    if (playerID && !hasPriorityPlayer(ctx, playerID)) {
      return G;
    }
    
    // Otherwise, proceed with the move
    return moveFn({ G, ctx, playerID, ...rest }, ...args);
  };
}
```

## Priority Models

The framework supports multiple priority models:

### 1. Turn-Based Priority

Used in games like Magic: The Gathering. The active player gets priority first, then passes around the table.

```typescript
export function createTurnBasedPriorityModel(): PriorityModel {
  return {
    getInitialPriority: (ctx) => {
      return getCurrentTurnPlayer(ctx);
    },
    
    getNextPriority: (state) => {
      const ctx = state.ctx;
      const currentPlayer = getCurrentPriorityPlayer(ctx);
      const players = ctx.playerOrder;
      
      const currentIdx = players.indexOf(currentPlayer);
      const nextIdx = (currentIdx + 1) % players.length;
      
      return players[nextIdx];
    },
    
    handlePriorityCompletion: (state, flowController) => {
      return flowController.getAutomaticAdvancement(state);
    }
  };
}
```

### 2. APNAP Priority

Used in games like One Piece. APNAP stands for "Active Player, Non-Active Player" order.

```typescript
export function createAPNAPPriorityModel(): PriorityModel {
  return {
    getInitialPriority: (ctx) => {
      return getCurrentTurnPlayer(ctx);
    },
    
    getNextPriority: (state) => {
      const ctx = state.ctx;
      const turnPlayer = getCurrentTurnPlayer(ctx);
      const currentPlayer = getCurrentPriorityPlayer(ctx);
      
      // If current player is turn player, pass to first non-turn player
      if (currentPlayer === turnPlayer) {
        const nonActivePlayer = ctx.playerOrder.find(p => p !== turnPlayer);
        return nonActivePlayer;
      }
      
      // If we're at the last player, go back to turn player
      return turnPlayer;
    },
    
    handlePriorityCompletion: (state, flowController) => {
      return flowController.getAutomaticAdvancement(state);
    }
  };
}
```

### 3. Focus-Based Priority

Used in games like Riftbound. Players gain "focus" which gives them priority.

```typescript
export function createFocusBasedPriorityModel(): PriorityModel {
  return {
    getInitialPriority: (ctx) => {
      // Focus starts with turn player
      return getCurrentTurnPlayer(ctx);
    },
    
    getNextPriority: (state) => {
      // Based on who has focus next (usually determined by game-specific rules)
      return determineNextFocusPlayer(state);
    },
    
    handlePriorityCompletion: (state, flowController) => {
      // Focus system might have different advancement rules
      return flowController.getAutomaticAdvancement(state);
    }
  };
}
```

## Implementation Patterns

### 1. Flow Factory

Create flow-related components through a factory pattern:

```typescript
export function createFlowManager<G = any>(
  gameDefinition: GameDefinition<G>
): FlowManager<G> {
  // Get or create flow configuration
  const flowConfig = gameDefinition.flow || createDefaultFlowConfiguration();
  
  // Create flow controller
  const flowController = new FlowController<G>(flowConfig);
  
  // Create and return flow manager
  return new FlowManager<G>(flowController, gameDefinition);
}
```

### 2. Flow Integration

Integrate flow management with the event system:

```typescript
export function processEvent(
  state: State,
  action: { name: string; args?: any[] },
  gameDefinition: GameDefinition,
): State {
  // Handle both ActionShape.GameEvent and simple event objects with name/args
  const type = action.name;
  const playerID = action.playerID || null;
  const args = action.args || [];

  // Check if this is a flow-related event
  const flowEvents = ['passPriority', 'passTurn'];
  if (flowEvents.includes(type)) {
    // Use the flow manager to process flow events
    const flowManager = createFlowManager(gameDefinition);
    return flowManager.processFlowEvent(
      state,
      type,
      playerID || '',
      ...(Array.isArray(args) ? args : [args]),
    );
  }
  
  // Otherwise use the traditional event handler
  if (typeof eventHandlers[type] !== "function") return state;
  return eventHandlers[type](
    state,
    playerID,
    ...(Array.isArray(args) ? args : [args]),
    gameDefinition,
  );
}
```

## Game-Specific Usage Examples

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
      {
        id: "precombat",
        name: "Pre-Combat Main Phase",
        allowsPriorityPassing: true
      },
      {
        id: "combat",
        name: "Combat Phase",
        steps: [
          { id: "begin", name: "Beginning of Combat", allowsPriorityPassing: true },
          { id: "declare_attackers", name: "Declare Attackers", allowsPriorityPassing: true },
          { id: "declare_blockers", name: "Declare Blockers", allowsPriorityPassing: true },
          { id: "damage", name: "Combat Damage", allowsPriorityPassing: true },
          { id: "end", name: "End of Combat", allowsPriorityPassing: true }
        ]
      },
      {
        id: "postcombat",
        name: "Post-Combat Main Phase",
        allowsPriorityPassing: true
      },
      {
        id: "ending",
        name: "Ending Phase",
        steps: [
          { id: "end", name: "End Step", allowsPriorityPassing: true },
          { id: "cleanup", name: "Cleanup Step", allowsPriorityPassing: false }
        ]
      }
    ]
  },
  priority: {
    initialPriority: "turnPlayer",
    autoPriorityAdvance: {
      untap: "nextStep",
      upkeep: "nextStep",
      draw: "nextPhase",
      precombat: "nextPhase",
      begin: "nextStep",
      declare_attackers: "nextStep",
      declare_blockers: "nextStep",
      damage: "nextStep",
      end_combat: "nextPhase",
      postcombat: "nextPhase",
      end: "nextStep",
      cleanup: "nextTurn"
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
        ],
        allowsPriorityPassing: false
      },
      {
        id: "main",
        name: "Main",
        allowsPriorityPassing: true
      },
      {
        id: "endOfTurn",
        name: "End of Turn",
        allowsPriorityPassing: true
      }
    ]
  },
  priority: {
    initialPriority: "turnPlayer",
    allowPriorityPassing: {
      beginning: false,
      main: true,
      endOfTurn: true
    },
    autoPriorityAdvance: {
      ready: "nextStep",
      set: "nextStep",
      draw: "nextPhase",
      main: false,
      endOfTurn: "nextTurn"
    }
  }
};
```
