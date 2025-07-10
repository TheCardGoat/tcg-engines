# ARCHITECTURE.md

## OVERVIEW

### 1.1 Core Tenets
The TCG framework is built on these architectural principles:
- **Immutable State**: All game state objects are immutable, changes create new objects
- **Replayable & Delta-Driven**: Games can be replayed from initial state + action logs
- **Server-Authoritative**: Server holds definitive game state
- **Deterministic Logic**: Same inputs always produce same outputs
- **Agnostic & Extensible Core**: Core engine unaware of specific game rules
- **Clear Action & Query Interfaces**: Well-defined APIs for actions and state queries
- **Separation of Concerns**: Game logic, rules, UI, and platform services strictly separated
- **Comprehensive Logging**: Structured logging at configurable levels
- **Localized Communication**: Player text designed for localization

### 1.2 System Architecture
```
Core Engine                    Game Engines
┌──────────────────┐          ┌─────────── ────┐
│ Framework        │◄─extends─┤ Specific Impl  │
│ - Flow control   │          │ - Game state   │
│ - State mgmt     │          │ - Card defs    │
│ - Event system   │          │ - Rules        │
│ - Move validation│          │ - Effects      │
└──────────────────┘          └────────────────┘
```

### 1.3 Hierarchical Game Structure
```
Segment
  └── Turn
      └── Phase
          └── Step
```
- **Segment**: Logical game sections (Setup, Mulligan, Gameplay, Sideboard)
- **Turn**: Complete cycle where each player becomes turn player
- **Phase**: Major divisions within turn (Draw Phase, Main Phase, Combat Phase)
- **Step**: Smaller divisions within phase (Untap Step, Draw Step)

## COMPONENTS

### 2.1 State Management System

#### 2.1.1 Core State Interface
```typescript
interface State<G = any> {
  G: G;                  // Game-specific state
  ctx: Ctx;              // Common context
  _stateID: number;      // Unique identifier
  _undo: Array<Undo<G>>; // Undo history
  _redo: Array<Undo<G>>; // Redo history
  _log?: LogEntry[];     // Action log
  _secret?: any;         // Secret information
}
```

#### 2.1.2 Context Management
```typescript
interface Ctx {
  playerOrder: Array<PlayerID>;
  turnPlayerPos: number;
  priorityPlayerPos: number;
  numTurns: number;
  currentPhase?: string;
  currentStep?: string;
  currentSegment?: string;
  restrictionUsage?: Record<string, any>;
}
```

#### 2.1.3 StateManager Operations
- `createState()`: Initialize game state from definition
- `processMove()`: Apply move to state, return new state
- `processEvent()`: Handle game events
- `createPlayerView()`: Filter state for specific player visibility

### 2.2 Flow Control System

#### 2.2.1 FlowConfiguration Structure
```typescript
interface FlowConfiguration {
  turns: {
    phases: FlowPhase[];
    onBegin?: (G: any) => any;
    onEnd?: (G: any) => any;
  };
  priority: {
    initialPriority: "turnPlayer" | string;
    priorityModel?: "turn-based" | "apnap" | "focus-based";
    allowPriorityPassing?: Record<string, boolean>;
    stepPriorityPassing?: Record<string, boolean>;
    autoPriorityAdvance?: Record<string, string | false>;
  };
  restrictions?: RestrictionConfiguration;
  segments?: GameSegment[];
}
```

#### 2.2.2 FlowController Responsibilities
- Query current phase and step configurations
- Determine priority passing permissions
- Calculate automatic advancement types
- Validate move eligibility
- Create move validators with priority checks

#### 2.2.3 FlowManager Operations
- `canPlayerAct()`: Check if player can make moves
- `passPriority()`: Transfer priority to next player
- `passTurn()`: End current player's turn
- `processFlowState()`: Handle automatic flow advancement
- `processFlowEvent()`: Process flow-related events

### 2.3 Priority System

#### 2.3.1 Priority Models
**Turn-Based Priority** (Default):
- Initial priority: turn player
- Passes around table in turn order
- Auto-advances when priority cycles

**APNAP Priority** (One Piece style):
- Active Player, Non-Active Player order
- Priority alternates between active/non-active players

**Focus-Based Priority** (Riftbound style):
- Custom game-specific priority determination
- Focus shifts based on game events

#### 2.3.2 PriorityModel Interface
```typescript
interface PriorityModel<G = any> {
  getInitialPriority: (ctx: any) => string;
  getNextPriority: (state: State<G>) => string | null;
  handlePriorityCompletion: (
    state: State<G>, 
    flowController: FlowController<G>
  ) => { advancementType: string | null; nextId?: string };
}
```

### 2.4 Event System

#### 2.4.1 Core Event Types
```typescript
interface GameEvent {
  name: string;
  playerID?: string;
  args?: any[];
}

interface ActionShape {
  type: string;
  payload: any;
}
```

#### 2.4.2 EventProcessor Operations
- `registerEventHandler()`: Register event handling functions
- `processEvent()`: Execute event handlers
- `queueEvent()`: Add events to processing queue
- `processEventQueue()`: Process queued events in order

#### 2.4.3 Flow Events
- `passPriority`: Transfer priority to next player
- `passTurn`: End current player's turn immediately
- `endPhase`: Complete current phase
- `setPhase`: Transition to specific phase
- `endTurn`: Complete current turn

### 2.5 Move System

#### 2.5.1 Move Interface
```typescript
interface Move<G = any> {
  (params: { G: G; ctx: any; playerID?: string }, ...args: any[]): G;
  client?: boolean;
  undoable?: boolean;
  redactedMoveArgs?: boolean;
  ignoreStaleStateID?: boolean;
}
```

#### 2.5.2 Move Validation
```typescript
function withPriorityCheck<G>(moveFn: Move<G>): Move<G> {
  return ({ G, ctx, playerID, ...rest }, ...args) => {
    if (playerID && !hasPriorityPlayer(ctx, playerID)) {
      return G;
    }
    return moveFn({ G, ctx, playerID, ...rest }, ...args);
  };
}
```

#### 2.5.3 MoveProcessor Responsibilities
- Register game-specific moves
- Validate moves against flow rules
- Apply moves to state
- Track move history for undo/redo

### 2.6 Effect System

#### 2.6.1 Effect Interface
```typescript
interface Effect {
  id: string;
  type: string;
  source: string;
  controller: string;
  timestamp: number;
  duration?: Duration;
  condition?: Condition;
  targets?: Target[];
  value?: any;
}
```

#### 2.6.2 Effect Resolution Models
- **StackResolutionModel**: LIFO resolution (Magic style)
- **QueueResolutionModel**: FIFO resolution
- **ChainResolutionModel**: Chain-based resolution

#### 2.6.3 EffectManager Operations
- `registerEffectHandler()`: Register effect type handlers
- `createEffect()`: Add effects to resolution system
- `resolveEffect()`: Execute effect resolution
- `checkEffect()`: Validate effect conditions

### 2.7 Card System

#### 2.7.1 Card Interface
```typescript
interface Card {
  id: string;           // Instance ID
  definitionId: string; // Card definition reference
  owner: string;
  controller?: string;
  zone: string;
  position?: number;
  tapped?: boolean;
  counters?: Record<string, number>;
  attachments?: string[];
  attachedTo?: string;
  modifiers?: Record<string, any>;
  metadata?: Record<string, any>;
}
```

#### 2.7.2 Zone System
```typescript
interface Zone {
  id: string;
  name: string;
  owner?: "player" | "shared";
  visibility: "public" | "private" | "hidden";
  ordered: boolean;
  limit?: number;
}
```

#### 2.7.3 CardManager Operations
- `createCard()`: Create new card instances
- `moveCard()`: Transfer cards between zones
- `modifyCard()`: Apply modifiers to cards
- `findCards()`: Query cards by criteria

## PATTERNS

### 3.1 Game Integration Pattern

#### 3.1.1 GameDefinition Structure
```typescript
interface GameDefinition<G = any, SetupData = G> {
  name: string;
  numPlayers: number;
  flow: FlowConfiguration;
  setup: (context: { ctx: Ctx }, setupData?: SetupData) => G;
  moves: MoveMap<G>;
  plugins?: Plugin[];
  endIf?: (G: G) => { winner?: string } | false;
  playerView?: (G: G, playerID: string) => G;
}
```

#### 3.1.2 Game Factory Pattern
```typescript
function createGame<G>(gameDefinition: GameDefinition<G>) {
  return {
    setup: () => createInitialState(gameDefinition),
    makeMove: (state, move, ...args) => processMoveWithManager(state, move, args, gameDefinition),
    processEvent: (state, eventName, ...args) => processEventWithManager(state, eventName, args, gameDefinition),
    playerView: (state, playerID) => createPlayerView(state, playerID, gameDefinition)
  };
}
```

### 3.2 Segment Management Pattern

#### 3.2.1 GameSegment Interface
```typescript
interface GameSegment {
  id: string;
  name: string;
  start?: boolean;
  end?: boolean;
  next?: string;
  flow?: FlowConfiguration;
  onBegin?: (state: GameState) => GameState;
  onEnd?: (state: GameState) => GameState;
  endIf?: (state: GameState) => boolean;
}
```

#### 3.2.2 SegmentManager Operations
- `transition()`: Handle segment transitions
- `getCurrentFlow()`: Get active flow configuration
- `checkTransition()`: Evaluate transition conditions

### 3.3 Restriction Management Pattern

#### 3.3.1 Turn Restrictions
```typescript
interface TurnRestriction {
  id: string;
  maxPerTurn: number;
  resetTiming: 'turnStart' | 'turnEnd' | 'phaseStart' | 'phaseEnd';
  scope: 'player' | 'global';
}
```

#### 3.3.2 Restriction Enforcement
```typescript
function withRestrictions<G>(
  restrictions: RestrictionConfiguration,
  moveFn: Move<G>
): Move<G> {
  return ({ G, ctx, playerID }, ...args) => {
    // Validate against restrictions
    if (!canPerformAction(ctx, playerID, actionId)) {
      return G;
    }
    // Track action usage
    return moveFn({ G, ctx, playerID }, ...args);
  };
}
```

### 3.4 Conditional Flow Pattern

#### 3.4.1 Conditional Execution
```typescript
interface ConditionalExecution {
  condition: (state: GameState) => boolean;
  action: 'skip' | 'execute' | 'replace';
  replacement?: FlowStep | FlowPhase;
}
```

#### 3.4.2 Enhanced Flow Elements
```typescript
interface EnhancedFlowStep extends FlowStep {
  conditional?: ConditionalExecution;
}

interface EnhancedFlowPhase extends FlowPhase {
  conditional?: ConditionalExecution;
  steps?: EnhancedFlowStep[];
}
```

### 3.5 Plugin Pattern

#### 3.5.1 Plugin Interface
```typescript
interface Plugin<G = any> {
  name: string;
  setup?: (state: State<G>) => State<G>;
  moves?: Record<string, Move<G>>;
  events?: Record<string, EventHandler<G>>;
  effects?: Record<string, EffectHandler<G>>;
  playerView?: (G: G, playerID: string) => G;
}
```

#### 3.5.2 Plugin Integration
Plugins extend game functionality by:
- Adding setup logic to initial state
- Contributing additional moves
- Registering event handlers
- Providing effect handlers
- Modifying player views

## IMPLEMENTATION

### 4.1 Core Implementation Structure

#### 4.1.1 Directory Organization
```
src/game-engine/core-engine/
├── flow/
│   ├── flow-config.ts          # Flow configuration types
│   ├── flow-controller.ts      # Flow control logic
│   ├── flow-manager.ts         # Flow management coordination
│   ├── segment-manager.ts      # Game segment management
│   ├── restrictions/           # Turn action restrictions
│   ├── conditional/            # Conditional flow execution
│   └── priority-models/        # Priority model implementations
├── game/
│   ├── state/                  # State management
│   ├── moves/                  # Move processing
│   ├── events/                 # Event handling
│   ├── effects/                # Effect resolution
│   ├── cards/                  # Card system
│   └── zones/                  # Zone management
└── plugins/                    # Plugin system
```

#### 4.1.2 Component Integration Points
- **StateManager** ↔ **FlowManager**: State updates and flow control
- **FlowManager** ↔ **EventProcessor**: Flow events processing
- **MoveProcessor** ↔ **FlowController**: Move validation
- **EventProcessor** ↔ **EffectManager**: Effect triggering
- **CardManager** ↔ **ZoneManager**: Card zone management

### 4.2 Game Engine Integration

#### 4.2.1 Step-by-Step Integration
1. **Define Game State**: Create typed interface for game-specific state
2. **Configure Flow**: Define phases, steps, and priority rules
3. **Implement Moves**: Create game-specific moves with validation
4. **Define Cards**: Create card definitions and effects
5. **Create GameDefinition**: Combine all components
6. **Create Game Instance**: Use factory to create playable game

#### 4.2.2 Integration Requirements
- Game state interface extending base State<G>
- Flow configuration matching game rules
- Move definitions with priority validation
- Card system integration
- Player view filtering for hidden information

### 4.3 Advanced Features

#### 4.3.1 Lorcana-Specific Implementation
**Segment System**: preGame → duringGame → endGame transitions
**Triggered Abilities**: "Bag" system for ability resolution
**Turn Restrictions**: "Once per turn" inkwell limitations
**State Checks**: Automatic validation after actions
**Priority Rules**: Active player resolves triggers first
**Conditional Steps**: Skip draw on first turn
**Sub-steps**: Dynamic bag resolution within phases
**Multi-zone Management**: Explicit zone support

#### 4.3.2 Testing Patterns
- Unit tests for individual components
- Integration tests for component interactions
- Game-specific scenario tests
- Property-based testing for state invariants
- Performance tests for large state updates

### 4.4 Configuration Examples

#### 4.4.1 Magic: The Gathering Style
```typescript
const mtgFlowConfig: FlowConfiguration = {
  turns: {
    phases: [
      {
        id: "beginning",
        steps: [
          { id: "untap", allowsPriorityPassing: false },
          { id: "upkeep", allowsPriorityPassing: true },
          { id: "draw", allowsPriorityPassing: true }
        ]
      },
      { id: "precombat", allowsPriorityPassing: true },
      { id: "combat", steps: [...] },
      { id: "postcombat", allowsPriorityPassing: true },
      { id: "ending", steps: [...] }
    ]
  },
  priority: {
    initialPriority: "turnPlayer",
    priorityModel: "turn-based",
    autoPriorityAdvance: {
      untap: "nextStep",
      draw: "nextPhase",
      precombat: "nextPhase"
    }
  }
};
```

#### 4.4.2 Lorcana Style
```typescript
const lorcanaFlowConfig: FlowConfiguration = {
  turns: {
    phases: [
      {
        id: "beginning",
        steps: [
          { 
            id: "ready", 
            allowsPriorityPassing: false,
            conditional: {
              condition: (state) => state.ctx.turn > 1,
              action: "skip"
            }
          },
          { id: "set", allowsPriorityPassing: false },
          { 
            id: "draw", 
            allowsPriorityPassing: false,
            conditional: skipDrawOnFirstTurn
          }
        ]
      },
      { id: "main", allowsPriorityPassing: true }
    ]
  },
  priority: {
    initialPriority: "turnPlayer",
    autoPriorityAdvance: {
      ready: "nextStep",
      set: "nextStep",
      draw: "nextPhase",
      main: "nextTurn"
    }
  },
  restrictions: {
    perPlayer: {
      inkwell: { maxPerTurn: 1, resetTiming: "turnStart" }
    }
  }
};
```

### 4.5 Extension Points

#### 4.5.1 Custom Priority Models
Implement `PriorityModel<G>` interface for game-specific priority rules

#### 4.5.2 Custom Effect Resolution
Implement `EffectResolutionModel<G>` for game-specific effect processing

#### 4.5.3 Custom Validation
Create validators using `withPriorityCheck()` and `withRestrictions()` wrappers

#### 4.5.4 Custom Events
Register custom event handlers in EventProcessor

#### 4.5.5 Plugin Development
Create plugins implementing `Plugin<G>` interface for modular functionality

This architecture provides a flexible, extensible framework for implementing various trading card games while maintaining consistency, testability, and clear separation of concerns.