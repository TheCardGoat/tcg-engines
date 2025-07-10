# Core Engine

A lightweight engine for managing trading card games.

## Suggested Readings
https://longwelwind.net/blog/networking-turn-based-game/#fn-1
https://gafferongames.com/post/deterministic_lockstep/
https://docs.boardzilla.io/
https://boardgame.io/

## **Core Tenets for the TCG Rule Engine**

These tenets will guide the development and evolution of the engine, ensuring consistency and adherence to our architectural goals.

1. **Immutable State:**
    - **Core Idea:** All game state objects are immutable. When a change occurs, a new state object is created instead of modifying the existing one.
    - **Rationale & Benefits:**
        - **Predictability & Debugging:** Simplifies reasoning about the game's state at any point, making bugs easier to track down as data doesn't change unexpectedly.
        - **Thread-Safety:** Inherently safe for concurrent operations (e.g., server handling multiple games, AI calculations) without complex locking, as data shared between threads cannot be mutated.
        - **Simplified State Management:** Enables straightforward implementation of features like undo/redo, historical review, and snapshots by simply referencing previous state versions.
        - **Change Detection:** Efficiently detect changes by comparing object references, which can be beneficial for UI updates and network synchronization.
        - **Functional Purity:** Encourages a more functional programming style, leading to functions that are easier to test and compose.

2. **Replayable & Delta-Driven:**
    - **Core Idea:** Every game must be fully replayable from an initial state and a sequence of actions. State updates are primarily communicated and stored as "deltas" (the differences between states).
    - **Rationale & Benefits:**
        - **Network Efficiency:** Sending only deltas significantly reduces bandwidth, crucial for responsive online play, especially with complex game states.
        - **Latency Reduction:** Smaller data payloads contribute to faster transmission and a smoother player experience.
        - **Auditing & Debugging:** Allows for precise reconstruction of any game state for debugging, analyzing specific scenarios, or even for cheat detection.
        - **Robust Synchronization:** Clients can efficiently catch up or reconcile by applying a sequence of deltas from the server.
        - **Optimistic Updates & Reconciliation:** Clients can apply deltas optimistically and later reconcile with server-authoritative deltas.

3. **Server-Authoritative:**
    - **Core Idea:** The server's instance of the rule engine holds the definitive truth of the game state. Client-side engines perform optimistic updates for responsiveness but must always yield to the server's state.
    - **Rationale & Benefits:**
        - **Consistency & Fairness:** Prevents cheating and ensures all players have a consistent view of the game, validated by a central authority.
        - **Simplified Client Logic:** Clients focus on prediction and rendering, while complex validation and rule enforcement are centralized on the server.
        - **Conflict Resolution:** The server is the ultimate arbiter in case of discrepancies or conflicting actions.

4. **Deterministic Logic:**
    - **Core Idea:** Given an identical initial game state and the same sequence of actions and inputs (e.g., random number generator seeds), the engine must always produce the exact same resulting game state and sequence of events.
    - **Rationale & Benefits:**
        - **Reliable Replays:** Essential for the "Replayable" tenet to function correctly for debugging and spectating.
        - **Synchronization:** Critical for server-client agreement. If both run deterministic logic with the same inputs, their states should converge.
        - **Testing:** Allows for predictable and repeatable test scenarios.
        - **AI Development:** Enables AI agents to reliably simulate future game states.

5. **Agnostic & Extensible Core:**
    - **Core Idea:** The core engine provides fundamental TCG mechanics (e.g., turn management, zones, action processing) but remains unaware of specific game rules, cards, or platform details. Game-specific logic is introduced via well-defined extension points.
    - **Rationale & Benefits:**
        - **Reusability:** The core engine can be reused across multiple different trading card games, reducing development effort.
        - **Maintainability:** Separates stable core logic from frequently changing game-specific rules.
        - **Modularity:** Game designers can focus on implementing their unique game mechanics without needing to modify the core engine.
        - **Clear Boundaries:** Promotes a clean separation between the engine's responsibilities and the game's content.

6. **Clear Action & Query Interfaces:**
    - **Core Idea:** The engine must expose clear, well-defined APIs for (a) enumerating all possible legal actions a player can take from a given state, and (b) querying the current game state in a structured way (potentially via a DSL).
    - **Rationale & Benefits:**
        - **AI Enablement:** Action enumeration is fundamental for AI players to make informed decisions.
        - **UI Development:** Allows UIs to dynamically present valid player choices and display relevant game information.
        - **Tooling & Analytics:** A queryable state facilitates the development of external tools for game analysis, observation, or custom displays.
        - **Decoupling:** The internal representation of the state can evolve without breaking consumers of the query API.

7. **Separation of Concerns:**
    - **Core Idea:** Maintain a strict separation between different aspects of the system: core game logic (engine), game-specific rules (extensions), data representation, presentation (UI), and platform-specific services (networking, storage).
    - **Rationale & Benefits:**
        - **Improved Testability:** Each component can be tested in isolation.
        - **Enhanced Scalability:** Different parts of the system can be scaled or replaced independently.
        - **Flexibility:** Easier to adapt to new platforms or integrate new technologies for specific concerns (e.g., a new UI framework).
        - **Parallel Development:** Teams can work on different components concurrently with minimal interference.

8. **Comprehensive and Contextual Logging & Telemetry:**
    - **Core Idea:** The engine must provide robust, structured logging capabilities at configurable verbosity levels (e.g., Developer, Advanced Player, Normal Player). It must also expose mechanisms (e.g., events, hooks) to allow adapters/plugins to track all executed player actions and significant engine events for telemetry and analysis.
    - **Rationale & Benefits:**
        - **Enhanced Debuggability (Developer Logs):** Granular logs of internal operations, state transitions, rule evaluations, and decision points within the engine. This provides deep insight for developers and rich context for LLMs to understand execution flow and assist in troubleshooting.
        - **Transparency & Insight (Advanced Player Logs):** Offers detailed information to engaged players about *why* specific outcomes occurred, which rules were triggered, and the sequence of complex interactions. This can include data like dice rolls (if applicable and made transparent), specific card effects being resolved, and priority passing.
        - **Clear Communication (Normal Player Logs):** Presents concise, human-readable summaries of game events essential for standard gameplay (e.g., "Player A played Card X," "Player B's creature Y was destroyed," "Turn ends"). Avoids overwhelming the average player with internal engine details.
        - **Play Style Analysis & Balancing (Player Action Telemetry):** Systematically collecting data on *every* player action (what action, when, from what state, targeting what) provides invaluable insights for:
            - Understanding player behavior and strategy patterns.
            - Game balancing (e.g., identifying overpowered/underpowered cards or strategies).
            - AI agent training and improvement.
            - Content design (e.g., what types of cards or mechanics are most/least used).
        - **System Health & Performance Monitoring:** Structured logs and telemetry can be fed into monitoring systems to track engine performance, error rates, and overall system health.
        - **Reproducibility of Issues:** Detailed logs, especially when correlated with replay data, are critical for reproducing and diagnosing complex bugs.

9. **Localized Player Communication:**
    - **Core Idea:** All text-based information intended for presentation to players (e.g., game event descriptions, UI prompts derived from engine state, player-facing error messages) must be designed for localization. The engine and plugins should primarily deal with localization keys and necessary parameters rather than hardcoded strings in a single language.
    - **Rationale & Benefits:**
        - **Global Reach & Accessibility:** Allows the game to be easily translated and adapted for players in different regions and languages, significantly expanding the potential player base.
        - **Enhanced Player Experience:** Players are generally more engaged and have a better experience when they can interact with the game in their native language.
        - **Maintainability & Scalability of Translations:** Separating translatable text from code makes it easier for localization teams to manage translations without needing to modify game logic. Adding support for new languages becomes a more streamlined process.
        - **Consistency:** Using a centralized localization system (even if the engine just provides keys) helps ensure consistent terminology across all player-facing text.
        - **Cultural Adaptation:** Localization often goes beyond direct translation to include cultural nuances. A key-based system can support this by allowing different string resources per locale for the same programmatic key.

## **High-Level Architecture**

This architecture aims to embody the tenets described above:

Code

`+-----------------------------------+      +-----------------------------------+
|         Client Application        |      |        Server Application         |
|              (Browser)            |      | (Node.js, Java, Python, etc.)     |
+-----------------------------------+      +-----------------------------------+
| Platform-Specific Adapters        |      | Platform-Specific Adapters        |
| (UI Rendering, Input, Network)    |<---->| (Network, Persistence, Auth)      |
+-----------------------------------+      +-----------------------------------+
| Optimistic TCG Engine Instance    |      | Authoritative TCG Engine Instance |
|                                   |      |                                   |
|  +----------------------------+   |      |  +----------------------------+   |
|  |      Core Rule Engine      |   |<---->|      Core Rule Engine         |   |
|  | - Immutable State Mgt      |   | Delta| - Immutable State Mgt         |   |
|  | - Action Processing        |   | Sync | - Action Processing           |   |
|  | - Turn/Phase Mgt           |   |   &  | - Turn/Phase Mgt              |   |
|  | - Deterministic Logic      |   | Moves| - Deterministic Logic         |   |
|  | - Action Enumeration API   |   |      | - Action Enumeration API      |   |
|  | - State Query API (DSL)    |   |      | - State Query API (DSL)       |   |
|  +----------------------------+   |      |  +----------------------------+   |
|  | Game-Specific Rules Plugin |   |      |  | Game-Specific Rules Plugin |   |
|  | (e.g., "Game X Rules")     |   |      |  | (e.g., "Game X Rules")     |   |
|  | - Card Def & Effects       |   |      |  | - Card Def & Effects.      |   |
|  | - Game-Specific Triggers   |   |      |  | - Game-Specific Triggers   |   |
|  | - Win/Loss Conditions      |   |      |  | - Win/Loss Conditions      |   |
|  | - Action Validation Logic  |   |      |  | - Action Validation Logic  |   |
|  +----------------------------+   |      |  +----------------------------+   |
+-----------------------------------+      +-----------------------------------+`

**Key Components & Interactions:**

1. **Core Rule Engine:**
    - **Responsibilities:**
        - Manages the fundamental, game-agnostic mechanics: turns, phases, priority, player order.
        - Processes actions submitted by players.
        - Maintains the immutable game state. On any change, it generates a new state and calculates the delta from the previous state.
        - Enforces deterministic execution of rules.
        - Provides an API to enumerate all valid actions for the current player in the current state.
        - Provides an API (potentially a DSL) to query any aspect of the current game and card state.
    - **Characteristics:** Game-agnostic, highly reusable.

2. **Game-Specific Rules Plugin (Per Game):**
    - **Responsibilities:**
        - Defines all data for a specific TCG: card definitions, abilities, keywords, resources, zones (beyond generic ones like hand/deck if needed).
        - Implements the logic for all card effects, triggers, and game-specific interactions.
        - Defines the win, loss, and draw conditions for the game.
        - Provides game-specific validation logic for actions (e.g., "Can this card be played now?").
    - **Interaction:** Plugs into the Core Rule Engine, which calls out to it for game-specific evaluations and effect resolutions. The Core Engine provides context (current state, action being performed) to the plugin.

3. **Client Application:**
    - Hosts an instance of the Core Rule Engine and the relevant Game-Specific Rules Plugin.
    - **Optimistic Updates:** When a player performs an action, the client's engine can immediately process it and update the local UI for responsiveness.
    - Sends player actions to the Server Application.
    - Receives authoritative state deltas (or full states if necessary for resync) from the server.
    - **Reconciliation:** If the optimistic local state diverges from the server's authoritative state after a delta is received, the client must reconcile its state to match the server's. This might involve rolling back optimistic changes and re-applying the server's delta.

4. **Server Application:**
    - Hosts the authoritative instance of the Core Rule Engine and the Game-Specific Rules Plugin.
    - Receives actions from all connected clients.
    - Validates actions using its authoritative engine instance.
    - If an action is valid, processes it, updates the authoritative game state, and generates a delta.
    - Broadcasts the delta to all relevant clients.
    - Handles persistence, authentication, matchmaking, etc. (via platform-specific adapters).

5. **Platform-Specific Adapters:**
    - **Responsibilities:** Abstract away the specifics of the environment.
        - **Client-side:** UI rendering, handling user input, network communication with the server.
        - **Server-side:** Network communication with clients, database/persistence layers, authentication services.
    - **Benefit:** Allows the Core Engine and Game Plugins to remain pure logic, untangled from I/O or platform dependencies.

**Data Flow Example (Player Plays a Card):**

1. Player on Client A interacts with UI to play a card.
2. Client A's Platform Adapter translates this into an "PlayCardAction".
3. Client A's Core Engine (optimistically) validates and processes the action using the Game-Specific Engine. A new local state and delta are generated. UI updates.
4. Client A's Platform Adapter sends the "PlayCardAction" to the Server.
5. Server's Platform Adapter receives the action.
6. Server's Core Engine (authoritatively) validates and processes the action. A new authoritative state and delta are generated.
7. Server's Platform Adapter broadcasts the authoritative delta to all connected clients (Client A, Client B, spectators).
8. Client A receives the server's delta. If its optimistic state matches, no change. If different, it reconciles (e.g., by reapplying the server delta to the state before its optimistic update).
9. Client B receives the server's delta, applies it to its state, and its UI updates.

# Core Engine Architecture

The Core Engine is the heart of the modular TCG engine, providing a flexible and extensible foundation for trading card games. It implements immutable state management, deterministic game flow, and a plugin-based architecture.

## 🏗️ Architecture Overview

The Core Engine follows these key principles:
- **Immutable State**: All state changes create new objects
- **Server-Authoritative**: Definitive game state maintained server-side
- **Deterministic Logic**: Same inputs always produce same outputs
- **Modular Design**: Clear separation of concerns with plugin architecture

## 🎮 Core Entities

### CoreEngine (`engine/core-engine.ts`)
**Main orchestrator coordinating all game operations.**

```typescript
class CoreEngine<G> {
  processMove(playerID: string, moveType: string, args: unknown[]): boolean
  processEvent(eventType: string, playerID: string, ...args: unknown[]): boolean
  getState(): ClientState<G>
  subscribe(callback: (state: ClientState<G>) => void): () => void
}
```

**Key Responsibilities:**
- Process player moves and validate them
- Handle game events (passPriority, passTurn, endPhase, etc.)
- Manage authoritative/client engine pattern for multiplayer
- Apply player view filtering for hidden information
- Coordinate state transitions through FlowEventManager

**Connections:**
- Uses `FlowEventManager` for flow operations
- Manages `State<G>` containing game state and context
- Subscribes clients to state changes
- Filters player views for multiplayer games

### Context System (`context/`, `state/context.ts`)
**Manages game context and provides controlled access.**

```typescript
interface Ctx {
  playerOrder: PlayerID[]
  turnPlayerPos: number
  priorityPlayerPos: number
  currentSegment?: string
  currentPhase?: string
  currentStep?: string
  zones?: Record<string, Zone>
  cards: GameCards
}
```

**Key Components:**
- **`Ctx`**: Core context with player order, flow state, zones, cards
- **`GameController`**: Controlled read/write access via interfaces
- **Context utilities**: Player management functions

**Usage Example:**
```typescript
const controller = createGameController(ctx);
controller.setPriorityPlayer("player1");
controller.setPhase("main");
const updatedCtx = controller.getUpdatedContext();
```

### Flow System (`flow/`)
**Manages game progression through phases, turns, and segments.**

```typescript
class FlowManager<G> {
  canPlayerAct(state: State<G>, playerID: string): boolean
  passPriority(state: State<G>, playerID: string): State<G>
  passTurn(state: State<G>, playerID: string): State<G>
  processFlowTransitions(state: State<G>): State<G>
}
```

**Key Components:**
- **`FlowManager`**: Central coordinator for flow operations
- **`FlowController`**: Priority and move validation
- **`FlowEventManager`**: Flow event processing
- **Priority Models**: APNAP, turn-based, focus-based priority
- **Restrictions**: Game restriction tracking and validation

**Flow Hierarchy:**
```
Game
├── Segments (e.g., "main", "combat")
│   ├── Phases (e.g., "draw", "main", "end")
│   │   └── Steps (e.g., "declare_attackers", "damage")
│   └── Turn structure
└── Priority system
```

### Card System (`card/`)
**Represents and manages card entities.**

```typescript
class CoreCardModel<T extends CoreCardDefinition> {
  get publicId(): string
  get card(): T
  getOwner(context: CardContext): string | undefined
  getZone(context: CardContext): string | undefined
  getModifiers(context: CardContext): any
}
```

**Key Components:**
- **`CoreCardModel`**: Base card model with instance ID
- **`CoreCardDefinition`**: Static card properties
- **`CoreCardRepository`**: Card definition management
- **`CardContext`**: Dynamic card context interface

**Usage:**
```typescript
const card = new CoreCardModel(definition, "instance_123");
const owner = card.getOwner(context);
const zone = card.getZone(context);
```

### Zone System (`zones/`)
**Manages card locations and movements.**

```typescript
class ZoneManager {
  moveCard(cardID: string, fromZone: string, toZone: string): ZoneMoveResult
  shuffleZone(zoneId: string, seed?: string): ZoneShuffleResult
  searchZone(zoneId: string, predicate: Function): ZoneSearchResult
  peekZone(zoneId: string, count: number): ZonePeekResult
}
```

**Zone Properties:**
```typescript
interface Zone {
  id: string
  name: string
  visibility: "public" | "private" | "owner"
  ordered: boolean
  sizeLimit?: number
  ownerRestricted?: boolean
  cards: string[]
}
```

**Common Operations:**
- **Movement**: Cards move between zones with validation
- **Shuffle**: Deterministic with optional seed for reproducibility  
- **Search**: Find cards matching criteria
- **Peek**: Look at cards without removing them

### Modifier System (`modifiers/`)
**Handles temporary and persistent effect modifications.**

```typescript
class ModifierManager {
  createModifier(params: ModifierCreateParams): UniversalModifier
  processModifiers(baseStates: Map<string, ProcessedCardState>): ModifierProcessingResult
  removeModifier(modifierId: string): boolean
}
```

**Key Components:**
- **`ModifierManager`**: Core coordinator
- **Layer Processor**: Applies modifiers in correct layer order
- **Event System**: Modifier lifecycle management
- **Cleanup Scheduler**: Duration-based cleanup

**Modifier Types:**
- **Card Modifiers**: Affect specific card instances
- **Player Modifiers**: Affect player-wide properties
- **Zone Modifiers**: Affect zone-wide rules
- **Global Modifiers**: Affect game-wide rules

## 🔗 Entity Relationships

```
CoreEngine (Orchestrator)
├── FlowEventManager ──→ FlowManager ──→ FlowController
│   └── Priority Models & Restrictions
├── State<G>
│   ├── G (Game-specific state)
│   └── Ctx (Framework state)
│       ├── ZoneManager ──→ Zones ──→ Card instances
│       ├── Player tracking
│       └── Flow state
├── GameController ──→ Controlled context operations
└── ModifierManager ──→ Card state processing
    ├── Layer Processor
    ├── Event System
    └── Cleanup Scheduler

Cards ←→ Zones (location tracking)
Cards ←→ Modifiers (effect application)  
Flow ←→ Context (state progression)
```

## 🎯 Data Flow

### 1. Move Processing
```
Player Move → CoreEngine.processMove()
├── Validate via FlowManager.canPlayerAct()
├── Execute move function
├── Update State<G>
└── Process flow transitions
```

### 2. State Updates
```
State<G> Update → FlowEventManager.processAllTransitions()
├── Check automatic phase/segment progression
├── Apply onBegin/onEnd hooks
├── Update context via GameController
└── Notify subscribers
```

### 3. Card Operations
```
Card Movement → ZoneManager.moveCard()
├── Validate movement rules
├── Update zone contents
├── Update Ctx.zones
└── Trigger zone events
```

### 4. Effect Application
```
Base Card States → ModifierManager.processModifiers()
├── Collect applicable modifiers
├── Apply through layer system
├── Calculate final states
└── Return processed states
```

## 🚀 Usage Examples

### Basic Engine Setup
```typescript
const engine = new CoreEngine({
  game: gameDefinition,
  players: ["player1", "player2"],
  cards: gameCards,
  matchID: "match_123"
});

// Subscribe to state changes
engine.subscribe((state) => {
  console.log("Game state updated:", state);
});
```

### Processing Moves
```typescript
// Player makes a move
const success = engine.processMove("player1", "playCard", ["card_123"]);

// Process flow events
engine.processEvent("passPriority", "player1");
engine.processEvent("endPhase", "player1");
```

### Working with Zones
```typescript
const zoneManager = ctx.zoneManager;

// Move card between zones
zoneManager.moveCard("card_123", "player1_hand", "player1_play");

// Shuffle deck
zoneManager.shuffleZone("player1_deck", "seed_123");

// Search for cards
const result = zoneManager.searchZone("player1_deck", 
  (cardId) => getCard(cardId).cost <= 3
);
```

### Modifier Management
```typescript
const modifierManager = new ModifierManager({ gameName: "lorcana" });

// Create a modifier
const modifier = modifierManager.createModifier({
  source: "card_123",
  layer: ModifierLayer.EFFECTS,
  priority: 100,
  targets: { type: "card", instanceIds: ["card_456"] },
  effects: [{ type: "setProperty", property: "cost", value: 0 }],
  duration: { type: "endOfTurn" }
});

// Process all modifiers
const result = modifierManager.processModifiers(baseCardStates, gameState);
```

## 🔧 Extension Points

### Custom Game Rules
```typescript
const gameDefinition: GameDefinition = {
  setup: ({ ctx }) => initialGameState,
  moves: {
    customMove: ({ G, ctx, playerID }, ...args) => {
      // Custom move logic
      return newGameState;
    }
  },
  segments: {
    main: {
      turn: {
        phases: {
          draw: { endIf: (state) => /* condition */ },
          main: { next: "end" },
          end: { next: null }
        }
      },
      next: null
    }
  }
};
```

### Custom Priority Models
```typescript
class CustomPriorityModel implements PriorityModel {
  getNextPriorityPlayer(state: State, turnPlayer: string): string | null {
    // Custom priority logic
  }
  
  isPriorityPassingAllowed(state: State): boolean {
    // Custom validation
  }
}
```

### Custom Zone Validation
```typescript
const zoneConfig: ZoneSystemConfig = {
  movementRules: {
    customValidation: (cardId, fromZone, toZone, context) => {
      // Custom validation logic
      return { valid: true };
    }
  }
};
```

## 📚 File Structure

```
core-engine/
├── card/           # Card system
├── context/        # Context management  
├── engine/         # Core engine
├── flow/           # Flow management
├── game/           # Game structure
├── modifiers/      # Modifier system
├── move/           # Move types
├── state/          # State management
├── utils/          # Utilities
└── zones/          # Zone system
```

## 🧪 Testing

The Core Engine emphasizes test-driven development:

```typescript
describe("CoreEngine", () => {
  it("processes valid moves", () => {
    const engine = createTestEngine();
    const success = engine.processMove("player1", "testMove", []);
    expect(success).toBe(true);
  });
});
```

Each subsystem includes comprehensive tests demonstrating expected behavior and serving as living documentation.