# Flow Manager Specification

## Overview

The Flow Manager is a sophisticated state machine responsible for orchestrating game flow across all game engines in the core-engine system. It provides a hierarchical structure for managing game progression through **Segments**, **Phases**, and **Steps**, along with a comprehensive hook system for game-specific logic.

Think of the Flow Manager as a sophisticated traffic controller that:
- Determines the current state of the game
- Manages valid transitions between states  
- Enforces turn-based priority systems
- Provides callbacks for game-specific logic at every level
- Handles both automatic and conditional transitions

## Hierarchical Structure

The Flow Manager organizes game flow in a three-tier hierarchy:

```
Game
└── Segments (Top-level game divisions)
    └── Turns (Player-specific divisions within segments)
        └── Phases (Structured divisions within turns)
            └── Steps (Granular subdivisions within phases)
```

### 1. Segments

**Purpose**: Create major divisions in your game that represent distinct gameplay modes or periods.

**Common Examples**:
- **Setup/Pre-Game**: Deck shuffling, mulligan, first player selection
- **Main Game**: The core gameplay loop
- **End Game**: Victory conditions, cleanup, scoring
- **Sideboarding**: Between-game modifications (in tournament play)
- **Draft**: Card selection phase (in limited formats)

**Key Properties**:
- `next`: Which segment follows this one (string or function)
- `endIf`: Condition to end this segment (function returning boolean)
- `onBegin`: Called when segment starts (function)
- `onEnd`: Called when segment ends (function)
- `turn`: Turn structure configuration for this segment

**Example from Alpha Clash**:
```typescript
segments: {
  startingAGame: {
    next: "duringGame",
    endIf: ({ ctx }) => !!ctx.otp && !ctx.pendingMulligan,
    onBegin: ({ G, coreOps }) => {
      // Initialize game setup
      coreOps.shuffleAllDecks();
      return G;
    },
    turn: { /* phase definitions */ }
  },
  duringGame: {
    next: "endGame", 
    endIf: ({ ctx }) => !!ctx.gameOver,
    turn: { /* main game phases */ }
  },
  endGame: {
    next: undefined, // Game ends here
    onBegin: ({ G, coreOps }) => {
      // Calculate final scores, cleanup
      return G;
    }
  }
}
```

### 2. Turns

**Purpose**: Manage player-specific progression within segments. Only one player can have the "turn" at any given time.

**Key Concepts**:
- **Turn Player**: The player currently taking their turn
- **Turn Order**: Sequence in which players take turns
- **Turn Count**: Tracks number of completed turns
- **Priority Player**: Player who can currently take actions (may differ from turn player)

**Turn Structure**:
```typescript
turn: {
  phases: {
    // Phase definitions
  },
  moves: {
    // Moves available throughout the turn
  }
}
```

### 3. Phases

**Purpose**: Structure individual turns into meaningful gameplay periods with specific rules and available actions.

**Common Examples**:
- **Beginning Phase**: Ready cards, draw cards, trigger start-of-turn effects
- **Main Phase**: Play cards, activate abilities, make attacks
- **Combat Phase**: Structured combat with attacker/defender priority
- **End Phase**: End-of-turn effects, cleanup, discard to hand size

**Key Properties**:
- `start`: Boolean indicating if this is the starting phase of a turn
- `next`: Which phase follows (string, function, or null)
- `endIf`: Condition to advance to next phase (function)
- `onBegin`: Called when phase starts (function)
- `onEnd`: Called when phase ends (function)
- `moves`: Actions available during this phase
- `steps`: Sub-divisions within the phase

**Example from Lorcana**:
```typescript
phases: {
  beginningPhase: {
    start: true,
    next: "mainPhase",
    // Phase ends when all steps complete (currentStep becomes null)
    endIf: ({ ctx }) => ctx.currentStep === null,
    steps: {
      readyStep: { 
        start: true,
        next: "setStep",
        onBegin: ({ coreOps }) => {
          coreOps.readyAllCards();
        },
        endIf: () => true // Auto-advance
      },
      setStep: { 
        next: "drawStep",
        onBegin: ({ coreOps }) => {
          coreOps.gainLoreFromLocations();
        },
        endIf: () => true // Auto-advance
      },
      drawStep: { 
        next: null, // Last step - returns to phase with currentStep = null
        onBegin: ({ coreOps }) => {
          coreOps.drawCard();
        },
        endIf: () => true // Auto-advance
      }
    }
  },
  mainPhase: {
    next: "endOfTurnPhase",
    moves: {
      playCard: moves.playCard,
      quest: moves.quest,
      challenge: moves.challenge
    }
  }
}
```

### 4. Steps

**Purpose**: Break complex phases into granular, sequential operations that must complete in order.

**Common Examples**:
- **Combat Steps**: Declare attackers → Declare blockers → Apply damage
- **Beginning Steps**: Ready → Upkeep → Draw
- **Resource Steps**: Untap → Upkeep → Draw → Main

**Key Properties**:
- `start`: Boolean indicating the first step in a phase
- `next`: Which step follows (string, function, or null)
- `endIf`: Condition to advance to next step (function)
- `onBegin`: Called when step starts (function)
- `onEnd`: Called when step ends (function)
- `moves`: Actions available only during specific step

**Example from Gundam**:
```typescript
steps: {
  active: {
    start: true,
    next: "startStep",
    onBegin: ({ coreOps }) => {
      // Set all cards to active (Rule 6-2-2)
      coreOps.setAllCardsActive();
    },
    endIf: () => true // Auto-advance
  },
  startStep: {
    next: null,
    onBegin: ({ coreOps }) => {
      // Activate "at the start of the turn" effects (Rule 6-2-3)
      coreOps.processTurnStartEffects();
    },
    endIf: () => true
  }
}
```

## Transition System

### Automatic Transitions

The Flow Manager automatically processes transitions when conditions are met:

**Transition Triggers**: When `endIf` returns true, the current entity (step/phase/segment) ends and transitions occur.

**Transition Destinations**: The `next` property determines where to go:
- If `next` has a value → transition to that specific entity
- If `next` is null → set current entity to null (return to parent level)

**Specific Transition Behaviors**:

1. **Step Completion**: When step's `endIf` returns true
   - If `next: "stepName"` → transition to that step
   - If `next: null` → set `currentStep = null` (return to phase level)
   - Phase can use `currentStep === null` to trigger its own `endIf` condition

2. **Phase Completion**: When phase's `endIf` returns true
   - If `next: "phaseName"` → transition to that phase  
   - If `next: null` → set `currentPhase = null` (return to segment level)

3. **Segment Completion**: When segment's `endIf` returns true
   - If `next: "segmentName"` → transition to that segment (starts with player 0)
   - If `next: null` or undefined → set `currentSegment = null` (game waits for manual intervention)

4. **Turn Completion**: When all phases in a turn complete → advance to next player's turn
   - New turn starts in the phase marked with `start: true`
   - If no phase has `start: true` → no active phase (currentPhase = null)

### Conditional Transitions

Use functions for dynamic flow control:

```typescript
phases: {
  mainPhase: {
    next: ({ G, ctx }) => {
      // Dynamic transition based on game state
      if (G.combatInitiated) return "combatPhase";
      if (ctx.turnPlayerWantsToContinue) return "mainPhase";
      return "endPhase";
    },
    endIf: ({ G, ctx }) => {
      return G.playerPassedTurn || G.timeoutReached;
    }
  }
}
```

### Priority Management

The Flow Manager handles player priority with the following rules:

**Turn vs Priority Player**:
- **Turn Player**: The player who currently owns the turn
- **Priority Player**: The player who can currently take actions
- When turn player is set, priority player is automatically set to the same player
- Priority can shift during responses (e.g., card played → opponent gets priority to respond)

**Priority Rules**:
- Turn count only increments when a turn is passed (not during priority shifts)
- Turn-based effects trigger during their respective phases (usually beginning phase)
- Priority management is manual - moves change priority as needed
- For now, complex priority response chains are kept simple

## Hook System

### Available Hooks

Each level of the hierarchy supports lifecycle hooks:

**`onBegin(fnContext)`**: Called when entering the state
- Use for: Initialization, automatic effects, state setup
- Return: Updated game state (or undefined for no change)

**`onEnd(fnContext)`**: Called when leaving the state  
- Use for: Cleanup, state transitions, final effects
- Return: Updated game state (or undefined for no change)

**`endIf(fnContext)`**: Determines when to transition to next state
- Use for: Custom transition conditions
- Return: Boolean (true = transition now)

### Function Context

All hooks receive a `fnContext` object containing:
```typescript
interface FnContext<G> {
  G: G;                    // Game state
  ctx: CoreCtx;           // Core engine context  
  coreOps: CoreOperation; // Core operations API
  _getUpdatedState: () => CoreEngineState<G>; // Internal state getter
}
```

### Hook Execution Order

When transitioning between states:
1. Next state's `onBegin` is called (when entering any state)
2. Current state's `endIf` is checked
3. Current state's `onEnd` is called (if transitioning out)
4. Game state is updated with any changes

**Important Notes**:
- `onBegin` is always called when entering a state, regardless of source (null or another entity)
- `onBegin` is NOT called when transitioning to the same state (no actual transition)
- `onBegin` can modify state that triggers `endIf`, which then triggers `onEnd`
- The sequence enables: `onBegin` → `endIf` → `onEnd` in a single transition

## Move System Integration

### Move Availability Hierarchy

Moves (player actions) are available at different levels:

**Global Moves**: Available throughout the entire game
```typescript
// In game definition
moves: {
  concede: moves.concede,
  undo: moves.undo
}
```

**Segment Moves**: Available during entire segment
```typescript
segments: {
  duringGame: {
    moves: {
      pauseGame: moves.pauseGame
    }
  }
}
```

**Phase Moves**: Available during specific phase
```typescript
phases: {
  mainPhase: {
    moves: {
      playCard: moves.playCard,
      activateAbility: moves.activateAbility
    }
  }
}
```

**Step Moves**: Available only during specific step
```typescript
steps: {
  declareAttackers: {
    moves: {
      declareAttacker: moves.declareAttacker
    }
  }
}
```

### Move Resolution

The Flow Manager resolves moves using a simple inheritance system:
1. Step-level moves (most specific)
2. Phase-level moves  
3. Segment-level moves
4. Global moves (least specific)

**Move Inheritance Rules**:
- All moves inherit downward through the hierarchy
- A move defined at segment level is available to all turns, phases, and steps in that segment
- A move defined at phase level is available to all steps in that phase
- No restrictions or conflicts - simple inheritance model
- Lower-level definitions can override higher-level ones if needed

## Game Examples

### Example 1: Simple Card Game (Riftbound)

```typescript
segments: {
  setup: {
    next: "gamePlay",
    turn: {
      phases: {
        setup: {
          start: true,
          next: "setup" // Loops until conditions met
        }
      }
    }
  },
  gamePlay: {
    next: "endGame", 
    turn: {
      phases: {
        action: {
          start: true,
          next: "ending"
        },
        ending: {
          next: "action" // Return to action for next turn
        }
      }
    }
  }
}
```

### Example 2: Complex TCG (Alpha Clash)

```typescript
segments: {
  duringGame: {
    turn: {
      phases: {
        startOfTurn: {
          start: true,
          next: "expansion",
          onBegin: ({ coreOps }) => {
            coreOps.processTurnStartEffects();
          }
        },
        expansion: {
          next: "primary",
          steps: {
            readyStep: {
              start: true,
              next: "drawStep",
              onBegin: ({ coreOps }) => {
                coreOps.readyAllCards();
              }
            },
            drawStep: {
              next: "resourceStep", 
              onBegin: ({ coreOps }) => {
                coreOps.drawCard();
              }
            },
            resourceStep: {
              next: null,
              moves: {
                placeResource: moves.placeResource
              }
            }
          }
        },
        primary: {
          next: ({ G }) => G.combatInitiated ? "clash" : "endOfTurn",
          moves: {
            playCard: moves.playCard,
            initiateClash: moves.initiateClash
          }
        },
        clash: {
          next: "primary",
          steps: {
            attackStep: { start: true, next: "counterStep" },
            counterStep: { next: "obstructStep" },
            obstructStep: { next: "clashBuffStep" },
            clashBuffStep: { next: "damageStep" },
            damageStep: { next: null }
          }
        }
      }
    }
  }
}
```

### Example 3: Multiplayer Setup (Grand Archive)

```typescript
segments: {
  startingAGame: {
    turn: {
      phases: {
        chooseFirstPlayer: {
          start: true,
          next: "chooseChampions",
          endIf: ({ ctx }) => ctx.otp !== undefined
        },
        chooseChampions: {
          next: "mulligan",
          onBegin: ({ coreOps }) => {
            coreOps.setPendingChampionSelection(coreOps.getPlayers());
          },
          endIf: ({ ctx }) => {
            return ctx.playerOrder.every(playerId => 
              ctx.players[playerId].championSelected
            );
          }
        }
      }
    }
  }
}
```

## Best Practices

### 1. Segment Design

- **Keep segments conceptually distinct**: Each segment should represent a fundamentally different mode of play
- **Use clear naming**: `startingAGame`, `duringGame`, `endGame` instead of `segment1`, `segment2`
- **Handle edge cases**: Always define what happens when segments end unexpectedly

### 2. Phase Structure

- **Follow game rules closely**: Phase names and structure should match official game documentation
- **One responsibility per phase**: Each phase should have a clear, single purpose
- **Use steps for complex phases**: Break down phases with multiple sequential actions

### 3. Step Implementation

- **Keep steps atomic**: Each step should do one thing completely
- **Use auto-advancing steps**: Most steps should automatically advance with `endIf: () => true`
- **Handle player input carefully**: Only add moves to steps that require player decisions

### 4. Hook Usage

- **`onBegin` for setup**: Use to initialize state, trigger automatic effects
- **`onEnd` for cleanup**: Use to finalize state, trigger end-of-period effects  
- **`endIf` for conditions**: Use for complex transition logic, avoid simple boolean checks

### 5. Move Organization

- **Layer moves appropriately**: Place moves at the most specific level where they're needed
- **Avoid duplication**: Don't redefine the same move at multiple levels unless behavior differs
- **Use descriptive names**: Move names should clearly indicate what action they perform

### 6. Error Handling

- **Provide defaults**: Always have fallback behavior for undefined transitions
- **Validate state**: Check that required properties exist before using them
- **Log transitions**: Use debug logging to track flow progression during development

## Common Patterns

### Pattern 1: Auto-Advancing Setup Steps
```typescript
steps: {
  shuffleDeck: {
    start: true,
    next: "drawHand",
    onBegin: ({ coreOps }) => {
      coreOps.shuffleAllDecks();
    },
    endIf: () => true // Auto-advance
  }
}
```

### Pattern 2: Player Decision Points
```typescript
phases: {
  mulligan: {
    endIf: ({ ctx }) => !ctx.pendingMulligan.size,
    moves: {
      keepHand: moves.keepHand,
      mulligan: moves.mulligan
    }
  }
}
```

### Pattern 3: Conditional Phase Loops
```typescript
phases: {
  mainPhase: {
    next: ({ G }) => {
      if (G.combatDeclared) return "combatPhase";
      if (G.turnEnded) return "endPhase";
      return "mainPhase"; // Continue in same phase
    }
  }
}
```

### Pattern 4: Priority Windows
```typescript
steps: {
  priorityWindow: {
    endIf: ({ ctx }) => ctx.allPlayersPassed,
    moves: {
      playInstant: moves.playInstant,
      activateAbility: moves.activateAbility,
      pass: moves.pass
    }
  }
}
```
## CoreCtx Properties

The `CoreCtx` object is the central context for the core engine, tracking game state and flow. Here are its key properties:

- `playerOrder`: Array of player IDs in turn order.
- `turnPlayerPos`: Index of the current turn player in `playerOrder`.
- `priorityPlayerPos`: Index of the current priority player in `playerOrder`.
- `gameId`: Unique identifier for the game instance.
- `matchId`: Unique identifier for the match (if applicable).
- `otp`: ID of the "on the play" player (first player).
- `choosingFirstPlayer`: Player currently choosing first player.
- `pendingMulligan`: Set of player IDs who have not completed mulligan.
- `pendingChampionSelection`: Set of player IDs who have not selected a champion.
- `gameOver`: Boolean indicating whether the game is over. Once set, no further moves can be executed.
- `winner`: Player ID of the winner (if game is over).
- `manualMode`: If true, the rule engine is disabled and players can manually correct board state (useful for fixing evaluation bugs).
- `numTurns`: Counter for the number of turns that have passed. A turn is incremented when both players have played in a segment. It starts at 0 and does not reset when transitioning segments.
- `numTurnMoves`: Counter for the number of moves executed during the current turn. It resets whenever either the `turnPlayer` or the turn changes.
- `numMoves`: Counter for the total number of successful moves executed in the game.
- `currentSegment`: Name of the current segment.
- `currentPhase`: Name of the current phase.
- `currentStep`: Name of the current step.
- `cards`: All cards in the game.
- `cardZones`: Mapping of card IDs to their zones.
- `moveHistory`: Array of move history entries.
- `players`: Mapping of player IDs to their player state.
- `seed`: Random seed for deterministic operations.

## Flow Navigation API

The Flow Manager exposes methods for arbitrary navigation, available through the core engine for legitimate gameplay use cases:

### Manual Navigation Methods

```typescript
// Set current segment (starts with first player)
flowManager.setSegment(segmentName: string): void

// Set current phase within current segment
flowManager.setPhase(phaseName: string): void

// Set current step within current phase  
flowManager.setStep(stepName: string): void

// Jump to specific segment/phase/step combination
flowManager.jumpTo({
  segment?: string,
  phase?: string, 
  step?: string
}): void
```

**Use Cases**:
- Game-specific flow control (e.g., "skip to combat phase")
- Special card effects that modify turn structure
- Tournament format variations (e.g., time extensions)
- Game state restoration after disconnection

**Behavior**:
- Navigation always triggers appropriate `onBegin` hooks
- Invalid navigation attempts are handled gracefully
- Navigation respects game state consistency

## Debugging and Development

### Flow Tracing

Enable flow debugging:
```typescript
import { debuggers } from "~/game-engine/core-engine/utils/logger";
debuggers.flowTransitions = true;
```

### State Inspection

Check current flow state:
```typescript
const currentSegment = state.ctx.currentSegment;
const currentPhase = state.ctx.currentPhase; 
const currentStep = state.ctx.currentStep;
```

### Transition Testing

Test specific transitions:
```typescript
const shouldTransition = flowManager.shouldEndPhase(state, fnContext);
const nextPhase = flowManager.getNextPhase(state, fnContext);
```

---

This specification provides a comprehensive guide to implementing and using the Flow Manager system. The hierarchical structure provides maximum flexibility while maintaining clear organization, and the hook system allows for game-specific customization at every level of the flow.
