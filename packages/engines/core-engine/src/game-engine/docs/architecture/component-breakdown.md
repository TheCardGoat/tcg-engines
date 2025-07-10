# TCG Framework Component Breakdown

This document provides a detailed breakdown of each major component in the TCG framework, including responsibilities, interfaces, and interactions with other components.

## 1. State Management

### Responsibility
Manages the game state, including state transitions, history tracking, and serialization.

### Key Components

#### 1.1 State Interface
```typescript
export interface State<G = any> {
  G: G;                  // Game-specific state
  ctx: Ctx;              // Common context
  _stateID: number;      // Unique identifier
  _undo: Array<Undo<G>>; // Undo history
  _redo: Array<Undo<G>>; // Redo history
  _log?: LogEntry[];     // Action log
  _secret?: any;         // Secret information
}
```

#### 1.2 State Manager
```typescript
export class StateManager<G = any> {
  createState(gameDefinition: GameDefinition): State<G>;
  processMove(state: State<G>, move: Move): State<G>;
  processEvent(state: State<G>, event: GameEvent): State<G>;
  createPlayerView(state: State<G>, playerID: string): State<G>;
}
```

#### 1.3 Context Management
```typescript
export interface Ctx {
  playerOrder: Array<PlayerID>;
  turnPlayerPos: number;
  priorityPlayerPos: number;
  numTurns: number;
  currentPhase?: string;
  currentStep?: string;
  // Other context properties
}
```

### Interactions
- Provides state to **Flow Manager** for flow control
- Receives state updates from **Event Processor**
- Handles state changes from **Move Processor**

## 2. Flow Control System

### Responsibility
Manages game flow, including phases, steps, priority, and automatic advancements.

### Key Components

#### 2.1 Flow Configuration
```typescript
export interface FlowConfiguration {
  turns: {
    phases: FlowPhase[];
    onBegin?: (G: any) => any;
    onEnd?: (G: any) => any;
  };
  priority: {
    initialPriority: "turnPlayer" | string;
    allowPriorityPassing?: Record<string, boolean>;
    stepPriorityPassing?: Record<string, boolean>;
    autoPriorityAdvance?: Record<string, "nextStep" | "nextPhase" | "nextTurn" | false>;
  };
  specialRules?: Record<string, any>;
}
```

#### 2.2 Flow Controller
```typescript
export class FlowController<G = any> {
  constructor(config: FlowConfiguration);
  getCurrentPhase(state: State<G>): FlowPhase | null;
  getCurrentStep(state: State<G>): FlowStep | null;
  isPriorityPassingAllowed(state: State<G>): boolean;
  getPriorityAdvancementType(state: State<G>): "nextStep" | "nextPhase" | "nextTurn" | false;
  getNextStepInPhase(state: State<G>): FlowStepType | null;
  getNextPhase(state: State<G>): FlowPhaseType | null;
  canPlayerAct(state: State<G>, playerID: string): boolean;
  getAutomaticAdvancement(state: State<G>): { advancementType: string | null; nextId?: string };
  createPriorityValidator<G>(): MoveValidator<G>;
  processPriorityPass(state: State<G>, nextPlayer: string, turnPlayer: string): State<G>;
}
```

#### 2.3 Flow Manager
```typescript
export class FlowManager<G = any> {
  constructor(flowController: FlowController<G>, gameDefinition: GameDefinition);
  canPlayerAct(state: State<G>, playerID: string): boolean;
  createMoveValidator(): MoveValidator<G>;
  passPriority(state: State<G>, playerID: string): State<G>;
  passTurn(state: State<G>, playerID: string): State<G>;
  processFlowState(state: State<G>): State<G>;
  processFlowEvent(state: State<G>, eventName: string, playerID: string, ...args: any[]): State<G>;
}
```

### Interactions
- Uses **State Manager** to access and update game state
- Provides validation to **Move Processor**
- Processes flow-related events from **Event Processor**

## 3. Event System

### Responsibility
Handles event processing, queuing, and resolution.

### Key Components

#### 3.1 Event Interface
```typescript
export interface GameEvent {
  name: string;
  playerID?: string;
  args?: any[];
}

export interface ActionShape {
  type: string;
  payload: any;
}
```

#### 3.2 Event Processor
```typescript
export class EventProcessor<G = any> {
  registerEventHandler(name: string, handler: EventHandler<G>): void;
  processEvent(state: State<G>, event: GameEvent): State<G>;
  queueEvent(state: State<G>, event: GameEvent): State<G>;
  processEventQueue(state: State<G>): State<G>;
}
```

#### 3.3 Event Registry
```typescript
// Event handler registry
const eventHandlers = {
  endTurn: endTurnEvent,
  passTurn: passTurnEvent,
  passPriority: passPriorityEvent,
  endPhase: endPhaseEvent,
  setPhase: setPhaseEvent,
  setStep: setStepEvent,
  endStep: endStepEvent,
  // Other event handlers
};
```

### Interactions
- Processes events from **Move Processor**
- Triggers effects in **Effect System**
- Updates state through **State Manager**
- Interacts with **Flow Manager** for flow-related events

## 4. Move System

### Responsibility
Handles move validation, execution, and effects.

### Key Components

#### 4.1 Move Interface
```typescript
export interface Move<G = any> {
  (params: { G: G; ctx: any; playerID?: string }, ...args: any[]): G;
  client?: boolean;
  undoable?: boolean;
  redactedMoveArgs?: boolean;
  ignoreStaleStateID?: boolean;
}

export type MoveMap<G = any> = {
  [moveName: string]: Move<G>;
};
```

#### 4.2 Move Processor
```typescript
export class MoveProcessor<G = any> {
  registerMove(name: string, move: Move<G>): void;
  validateMove(state: State<G>, name: string, playerID: string, ...args: any[]): boolean;
  processMove(state: State<G>, name: string, playerID: string, ...args: any[]): State<G>;
}
```

#### 4.3 Move Validation
```typescript
export function withPriorityCheck<G>(
  moveFn: (params: { G: G; ctx: any; playerID?: string }, ...args: any[]) => G
): Move<G> {
  return ({ G, ctx, playerID, ...rest }, ...args) => {
    // Validation logic
    if (playerID && !hasPriorityPlayer(ctx, playerID)) {
      return G;
    }
    return moveFn({ G, ctx, playerID, ...rest }, ...args);
  };
}
```

### Interactions
- Uses **Flow Controller** for move validation
- Triggers events through **Event Processor**
- Updates state through **State Manager**

## 5. Card System

### Responsibility
Manages card creation, movement, and state.

### Key Components

#### 5.1 Card Interface
```typescript
export interface Card {
  id: string;
  definitionId: string;
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

#### 5.2 Zone System
```typescript
export interface Zone {
  id: string;
  name: string;
  owner?: "player" | "shared";
  visibility: "public" | "private" | "hidden";
  ordered: boolean;
  limit?: number;
}

export interface ZoneState {
  id: string;
  cards: string[];
}
```

#### 5.3 Card Manager
```typescript
export class CardManager<G = any> {
  createCard(state: State<G>, playerID: string, cardDefinition: CardDefinition): State<G>;
  moveCard(state: State<G>, cardId: string, toZone: string, position?: number): State<G>;
  modifyCard(state: State<G>, cardId: string, modifier: CardModifier): State<G>;
  findCards(state: State<G>, criteria: CardCriteria): Card[];
}
```

### Interactions
- Updates state through **State Manager**
- Triggers effects through **Effect System**
- Processes events through **Event Processor**

## 6. Effect System

### Responsibility
Handles effect creation, resolution, and application.

### Key Components

#### 6.1 Effect Interface
```typescript
export interface Effect {
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

export type Duration =
  | { type: "endOfTurn" }
  | { type: "untilLeaves" }
  | { type: "turns"; count: number }
  | { type: "permanent" };
```

#### 6.2 Effect Resolution Models
```typescript
export interface EffectResolutionModel<G = any> {
  addEffect(state: State<G>, effect: Effect): State<G>;
  resolveEffects(state: State<G>): State<G>;
  getActiveEffects(state: State<G>): Effect[];
}

export class StackResolutionModel<G = any> implements EffectResolutionModel<G> {
  // LIFO resolution
}

export class QueueResolutionModel<G = any> implements EffectResolutionModel<G> {
  // FIFO resolution
}

export class ChainResolutionModel<G = any> implements EffectResolutionModel<G> {
  // Chain-based resolution
}
```

#### 6.3 Effect Manager
```typescript
export class EffectManager<G = any> {
  registerEffectHandler(type: string, handler: EffectHandler<G>): void;
  createEffect(state: State<G>, effect: Effect): State<G>;
  resolveEffect(state: State<G>, effect: Effect): State<G>;
  checkEffect(state: State<G>, effect: Effect): boolean;
}
```

### Interactions
- Processes effects from **Event Processor**
- Updates state through **State Manager**
- Applies effects to cards through **Card Manager**

## 7. Player Management

### Responsibility
Handles player information, turns, and views.

### Key Components

#### 7.1 Player Interface
```typescript
export interface Player {
  id: string;
  name?: string;
  isConnected?: boolean;
  isActive?: boolean;
  data?: Record<string, any>;
}
```

#### 7.2 Player Manager
```typescript
export class PlayerManager<G = any> {
  addPlayer(state: State<G>, player: Player): State<G>;
  removePlayer(state: State<G>, playerId: string): State<G>;
  updatePlayer(state: State<G>, playerId: string, data: Partial<Player>): State<G>;
  getPlayerView(state: State<G>, playerId: string): State<G>;
}
```

#### 7.3 Turn Order Management
```typescript
export function setNextTurnPlayer(ctx: Ctx): Ctx {
  const nextTurnPlayerPos = (ctx.turnPlayerPos + 1) % ctx.playerOrder.length;
  return { ...ctx, turnPlayerPos: nextTurnPlayerPos };
}

export function getCurrentTurnPlayer(ctx: Ctx): PlayerID | null {
  if (ctx.turnPlayerPos < 0 || ctx.turnPlayerPos >= ctx.playerOrder.length) {
    return null;
  }
  return ctx.playerOrder[ctx.turnPlayerPos];
}
```

### Interactions
- Uses **State Manager** for player state
- Interacts with **Flow Manager** for turn order
- Provides player views through **State Manager**

## 8. Game Engine Integration

### Responsibility
Provides integration points for game-specific implementations.

### Key Components

#### 8.1 Game Definition Interface
```typescript
export interface GameDefinition<G = any, SetupData = G> {
  name: string;
  numPlayers: number;
  flow: FlowConfiguration;
  setup: (context: { ctx: Ctx }, setupData?: SetupData) => G;
  moves: MoveMap<G>;
  plugins?: Plugin[];
}
```

#### 8.2 Game Factory
```typescript
export function createGame<G>(gameDefinition: GameDefinition<G>) {
  return {
    setup: () => {
      const state = createInitialState(gameDefinition);
      return state;
    },
    
    makeMove: (state: State<G>, move: string, ...args: any[]) => {
      return processMoveWithManager(state, move, args, gameDefinition);
    },
    
    processEvent: (state: State<G>, eventName: string, ...args: any[]) => {
      return processEventWithManager(state, eventName, args, gameDefinition);
    },
    
    playerView: (state: State<G>, playerID: string) => {
      return createPlayerView(state, playerID, gameDefinition);
    },
  };
}
```

#### 8.3 Plugin System
```typescript
export interface Plugin<G = any> {
  name: string;
  setup?: (state: State<G>) => State<G>;
  moves?: Record<string, Move<G>>;
  events?: Record<string, EventHandler<G>>;
  effects?: Record<string, EffectHandler<G>>;
  playerView?: (G: G, playerID: string) => G;
}
```

### Interactions
- Integrates with all core components
- Provides extension points for game engines
- Manages game lifecycle

This component breakdown provides a detailed view of the TCG framework's architecture, showing how each component is structured and how they interact with each other.