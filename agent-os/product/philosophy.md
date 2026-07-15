# @tcg/core - Design Philosophy

## Overview

This document outlines the core design philosophy behind @tcg/core, explaining the principles, decisions, and trade-offs that shape the framework. Understanding these principles will help you build better games and contribute more effectively to the project.

## When Context is Missing

When implementing game engine features or evaluating game rules, if context is missing or unclear, use the `.md` files in the nearest folder to collect more information about how the game engine or game rule should be evaluated.

The codebase is extensively documented with markdown files that provide:
- **Architectural decisions** - Why certain patterns were chosen
- **Implementation details** - How specific features work
- **Game rules** - How game-specific mechanics should be implemented
- **Best practices** - Recommended approaches for common scenarios

Always consult these documentation files before making assumptions about implementation details or game rules. The documentation serves as the source of truth for understanding the system's design and behavior.

## Core Tenets for the TCG Rule Engine

These tenets guide the development and evolution of the engine, ensuring consistency and adherence to our architectural goals. They form the foundation upon which all design decisions are made.

### 1. Immutable State

**Core Idea:** All game state objects are immutable. When a change occurs, a new state object is created instead of modifying the existing one.

**Rationale & Benefits:**

- **Predictability & Debugging:** Simplifies reasoning about the game's state at any point, making bugs easier to track down as data doesn't change unexpectedly.

- **Thread-Safety:** Inherently safe for concurrent operations (e.g., server handling multiple games, AI calculations) without complex locking, as data shared between threads cannot be mutated.

- **Simplified State Management:** Enables straightforward implementation of features like undo/redo, historical review, and snapshots by simply referencing previous state versions.

- **Change Detection:** Efficiently detect changes by comparing object references, which can be beneficial for UI updates and network synchronization.

- **Functional Purity:** Encourages a more functional programming style, leading to functions that are easier to test and compose.

### 2. Replayable & Delta-Driven

**Core Idea:** Every game must be fully replayable from an initial state and a sequence of actions. State updates are primarily communicated and stored as "deltas" (the differences between states).

**Rationale & Benefits:**

- **Network Efficiency:** Sending only deltas significantly reduces bandwidth, crucial for responsive online play, especially with complex game states.

- **Latency Reduction:** Smaller data payloads contribute to faster transmission and a smoother player experience.

- **Auditing & Debugging:** Allows for precise reconstruction of any game state for debugging, analyzing specific scenarios, or even for cheat detection.

- **Robust Synchronization:** Clients can efficiently catch up or reconcile by applying a sequence of deltas from the server.

- **Optimistic Updates & Reconciliation:** Clients can apply deltas optimistically and later reconcile with server-authoritative deltas.

### 3. Server-Authoritative

**Core Idea:** The server's instance of the rule engine holds the definitive truth of the game state. Client-side engines perform optimistic updates for responsiveness but must always yield to the server's state.

**Rationale & Benefits:**

- **Consistency & Fairness:** Prevents cheating and ensures all players have a consistent view of the game, validated by a central authority.

- **Simplified Client Logic:** Clients focus on prediction and rendering, while complex validation and rule enforcement are centralized on the server.

- **Conflict Resolution:** The server is the ultimate arbiter in case of discrepancies or conflicting actions.

### 4. Deterministic Logic

**Core Idea:** Given an identical initial game state and the same sequence of actions and inputs (e.g., random number generator seeds), the engine must always produce the exact same resulting game state and sequence of events.

**Rationale & Benefits:**

- **Reliable Replays:** Essential for the "Replayable" tenet to function correctly for debugging and spectating.

- **Synchronization:** Critical for server-client agreement. If both run deterministic logic with the same inputs, their states should converge.

- **Testing:** Allows for predictable and repeatable test scenarios.

- **AI Development:** Enables AI agents to reliably simulate future game states.

### 5. Agnostic & Extensible Core

**Core Idea:** The core engine provides fundamental TCG mechanics (e.g., turn management, zones, action processing) but remains unaware of specific game rules, cards, or platform details. Game-specific logic is introduced via well-defined extension points.

**Rationale & Benefits:**

- **Reusability:** The core engine can be reused across multiple different trading card games, reducing development effort.

- **Maintainability:** Separates stable core logic from frequently changing game-specific rules.

- **Modularity:** Game designers can focus on implementing their unique game mechanics without needing to modify the core engine.

- **Clear Boundaries:** Promotes a clean separation between the engine's responsibilities and the game's content.

### 6. Clear Action & Query Interfaces

**Core Idea:** The engine must expose clear, well-defined APIs for (a) enumerating all possible legal actions a player can take from a given state, and (b) querying the current game state in a structured way (potentially via a DSL).

**Rationale & Benefits:**

- **AI Enablement:** Action enumeration is fundamental for AI players to make informed decisions.

- **UI Development:** Allows UIs to dynamically present valid player choices and display relevant game information.

- **Tooling & Analytics:** A queryable state facilitates the development of external tools for game analysis, observation, or custom displays.

- **Decoupling:** The internal representation of the state can evolve without breaking consumers of the query API.

### 7. Separation of Concerns

**Core Idea:** Maintain a strict separation between different aspects of the system: core game logic (engine), game-specific rules (extensions), data representation, presentation (UI), and platform-specific services (networking, storage).

**Rationale & Benefits:**

- **Improved Testability:** Each component can be tested in isolation.

- **Enhanced Scalability:** Different parts of the system can be scaled or replaced independently.

- **Flexibility:** Easier to adapt to new platforms or integrate new technologies for specific concerns (e.g., a new UI framework).

- **Parallel Development:** Teams can work on different components concurrently with minimal interference.

### 8. Comprehensive and Contextual Logging & Telemetry

**Core Idea:** The engine must provide robust, structured logging capabilities at configurable verbosity levels (e.g., Developer, Advanced Player, Normal Player). It must also expose mechanisms (e.g., events, hooks) to allow adapters/plugins to track all executed player actions and significant engine events for telemetry and analysis.

**Rationale & Benefits:**

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

### 9. Localized Player Communication

**Core Idea:** All text-based information intended for presentation to players (e.g., game event descriptions, UI prompts derived from engine state, player-facing error messages) must be designed for localization. The engine and plugins should primarily deal with localization keys and necessary parameters rather than hardcoded strings in a single language.

**Rationale & Benefits:**

- **Global Reach & Accessibility:** Allows the game to be easily translated and adapted for players in different regions and languages, significantly expanding the potential player base.

- **Enhanced Player Experience:** Players are generally more engaged and have a better experience when they can interact with the game in their native language.

- **Maintainability & Scalability of Translations:** Separating translatable text from code makes it easier for localization teams to manage translations without needing to modify game logic. Adding support for new languages becomes a more streamlined process.

- **Consistency:** Using a centralized localization system (even if the engine just provides keys) helps ensure consistent terminology across all player-facing text.

- **Cultural Adaptation:** Localization often goes beyond direct translation to include cultural nuances. A key-based system can support this by allowing different string resources per locale for the same programmatic key.

## Core Philosophy

### 1. Declarative Over Imperative

**Principle**: Games should be defined through configuration, not imperative code.

Unlike general-purpose game engines like [boardgame.io](https://boardgame.io/) that focus on turn-based games broadly, @tcg/core is specifically designed for trading card games. This specialization allows us to provide declarative abstractions that eliminate boilerplate.

**What This Means**:

```typescript
// ✅ Declarative: Define what the game is
const gameDefinition: GameDefinition<State, Moves> = {
  name: "My TCG",
  setup: (players) => ({ /* initial state */ }),
  moves: {
    playCard: {
      condition: (state, context) => { /* validation */ },
      reducer: (draft, context) => { /* state change */ },
    },
  },
};

// ❌ Imperative: Don't write how to orchestrate the game
// No need to manually manage turn order, phase transitions, or state synchronization
```

**Benefits**:
- Less code to write and maintain
- Framework handles orchestration automatically
- Easier to reason about game logic
- Natural fit for TCG-specific concepts (zones, targeting, card abilities)

**Trade-offs**:
- Less flexibility for non-TCG games
- Learning curve for declarative patterns
- Opinionated architecture

### 2. Type Safety as a Foundation

**Principle**: Leverage TypeScript's type system to catch errors at compile time, not runtime.

Type safety isn't just a feature—it's a core philosophy. Every API is designed with type safety in mind, using branded types, discriminated unions, and advanced TypeScript features.

**What This Means**:

```typescript
// ✅ Branded types prevent ID mixups
type PlayerId = string & { readonly __brand: 'PlayerId' };
type CardId = string & { readonly __brand: 'CardId' };

// Type error at compile time, not runtime
engine.executeMove("playCard", { 
  playerId: cardId  // ❌ Type error: CardId cannot be assigned to PlayerId
});

// ✅ Discriminated unions for type-safe moves
type Move = 
  | { type: 'playCard'; cardId: CardId }
  | { type: 'attack'; attackerId: CardId; targetId: CardId };
```

**Benefits**:
- Catch bugs before they reach production
- Better IDE autocomplete and IntelliSense
- Self-documenting code through types
- Refactoring safety

**Trade-offs**:
- Requires TypeScript knowledge
- More verbose type definitions
- Compile-time overhead (minimal)

### 3. TCG-First Design

**Principle**: Optimize for trading card game patterns, not general board games.

While [boardgame.io](https://boardgame.io/) is excellent for general turn-based games, @tcg/core is purpose-built for TCGs. This means first-class support for concepts that are central to card games but secondary in board games.

**TCG-Specific Features**:

- **Zones**: Deck, hand, play, graveyard, exile—all with proper visibility rules
- **Card Instances**: Multiple copies of the same card with different states
- **Targeting**: Complex targeting requirements (creatures, players, zones)
- **Card Abilities**: Triggered, activated, and static abilities
- **Card Filtering**: Query DSL for finding cards matching criteria
- **Zone Operations**: Draw, shuffle, mill, search, peek—all built-in

**Comparison with boardgame.io**:

| Feature | boardgame.io | @tcg/core |
|---------|--------------|-----------|
| **Scope** | General turn-based games | Trading card games specifically |
| **State Management** | Manual state updates | Declarative with Immer |
| **Card Concepts** | Generic pieces | First-class card/zone abstractions |
| **Type Safety** | JavaScript-first, TypeScript optional | TypeScript-first, strict types |
| **Network Sync** | Built-in multiplayer | Delta patches with Immer |
| **Determinism** | Optional | Built-in seeded RNG |
| **Player Views** | Manual filtering | Automatic information hiding |

**Benefits**:
- Less code for TCG-specific features
- Better abstractions for card game concepts
- Fewer bugs from reinventing card game patterns
- Faster development for TCGs

**Trade-offs**:
- Not suitable for non-card games
- Steeper learning curve for non-TCG developers
- Opinionated about TCG structure

### 4. Immutability by Default

**Principle**: All state changes create new state objects, never mutate existing state.

Immutability is enforced through [Immer](https://immerjs.github.io/immer/), which provides a mutable-style API while maintaining immutability under the hood.

**What This Means**:

```typescript
// ✅ Write mutable-style code, get immutability
reducer: (draft, context) => {
  // This looks like mutation, but creates new state
  draft.players[0].hand.push(cardId);
  draft.players[0].life -= 5;
}

// Framework automatically:
// - Creates new state object
// - Generates patches for network sync
// - Maintains history for undo/redo
// - Preserves structural sharing for performance
```

**Benefits**:
- Time-travel debugging (undo/redo)
- Efficient network synchronization (delta patches)
- Predictable state updates
- Easy to test (pure functions)
- No accidental state mutations

**Trade-offs**:
- Slight performance overhead (mitigated by structural sharing)
- Requires understanding of Immer patterns
- Memory usage for history (configurable)

### 5. Framework, Not Library

**Principle**: Provide opinionated architecture that guides best practices, not just utilities.

@tcg/core is a framework, not a library. It makes decisions for you about how games should be structured, how state should be managed, and how moves should be validated. This reduces decision fatigue and ensures consistency.

**What This Means**:

```typescript
// ✅ Framework provides structure
const engine = new RuleEngine(gameDefinition, players, {
  seed: "deterministic-seed",
});

// Framework handles:
// - Move validation
// - State updates
// - History tracking
// - Network synchronization
// - Player views
// - Game end detection
// - Flow orchestration

// ❌ Don't build your own state management
// ❌ Don't implement your own move validation
// ❌ Don't write custom network sync
```

**Benefits**:
- Consistent patterns across games
- Less code to write
- Framework handles edge cases
- Best practices built-in
- Easier onboarding for new developers

**Trade-offs**:
- Less flexibility for unconventional games
- Must learn framework patterns
- Framework updates may require migration

### 6. Developer Experience First

**Principle**: Optimize for developer happiness and productivity, not just technical excellence.

Every API decision considers: Is this easy to use? Is it discoverable? Does it provide helpful errors? Does it work well with TypeScript?

**What This Means**:

- **Excellent TypeScript Support**: Full type inference, branded types, discriminated unions
- **Helpful Error Messages**: Clear validation errors, type errors with context
- **Comprehensive Documentation**: Guides, examples, API reference
- **Testing Utilities**: Complete TDD toolkit, test factories, assertions
- **Developer Tools**: Logging, telemetry, debugging utilities

**Benefits**:
- Faster development
- Fewer bugs
- Easier onboarding
- Better maintainability
- Higher code quality

**Trade-offs**:
- More time spent on DX features
- Larger API surface area
- More documentation to maintain

### 7. Production Ready by Default

**Principle**: Built-in features that real games need, not optional add-ons.

Unlike frameworks that require you to build multiplayer, replay, or debugging features yourself, @tcg/core includes these from day one.

**Built-in Production Features**:

- **Network Synchronization**: Delta patches for efficient multiplayer
- **Deterministic Replay**: Seeded RNG enables perfect replays
- **Time-Travel Debugging**: Undo/redo and history replay
- **Player Views**: Automatic information hiding for multiplayer
- **Logging & Telemetry**: Structured logging and event tracking
- **Validation**: Runtime validation with Zod schemas
- **Error Handling**: Comprehensive error types and handling

**Comparison with boardgame.io**:

| Feature | boardgame.io | @tcg/core |
|---------|--------------|-----------|
| **Multiplayer** | Built-in lobby system | Delta patches (you build transport) |
| **Replay** | Game logs | Deterministic replay with seeded RNG |
| **Debugging** | Time-travel via logs | Undo/redo + history replay |
| **AI** | Auto-generated bots | Move enumeration for AI integration |
| **Storage** | Built-in persistence | Framework-agnostic (you choose) |

**Benefits**:
- Faster time to production
- Consistent features across games
- Less code to write
- Framework-tested features

**Trade-offs**:
- Larger bundle size (mitigated by tree-shaking)
- More to learn initially
- Framework updates affect all games

### 8. Test-Driven by Design

**Principle**: Make testing easy, natural, and comprehensive.

Testing isn't an afterthought—it's built into the framework design. The framework is testable, and it provides tools to make your games testable.

**What This Means**:

```typescript
// ✅ Framework designed for testing
import { createTestEngine, expectMoveSuccess } from '@tcg/core/testing';

const engine = createTestEngine(gameDefinition, players, { seed: 'test' });

// Test moves
expectMoveSuccess(engine, 'playCard', { playerId: 'p1', data: { cardId: 'c1' } });

// Test state
expectStateProperty(engine, 'players[0].hand.length', 6);

// Deterministic testing
const result1 = engine.executeMove('drawCard', { playerId: 'p1' });
const engine2 = createTestEngine(gameDefinition, players, { seed: 'test' });
const result2 = engine2.executeMove('drawCard', { playerId: 'p1' });
// result1 === result2 (deterministic)
```

**Benefits**:
- Easy to write tests
- Deterministic testing
- High test coverage (95%+ target)
- Confidence in refactoring
- Regression prevention

**Trade-offs**:
- Requires test-writing discipline
- Test suite maintenance
- Initial test setup time

## Design Decisions

### Why Immer?

**Decision**: Use Immer for immutable state management.

**Rationale**:
- Mutable-style API is intuitive
- Automatic structural sharing for performance
- Patch generation for network sync
- Time-travel debugging support
- Battle-tested in production

**Alternatives Considered**:
- Redux: Too verbose, requires too much boilerplate
- Zustand: Not designed for complex game state
- Manual immutability: Too error-prone, too verbose

### Why TypeScript-First?

**Decision**: TypeScript is required, not optional.

**Rationale**:
- Type safety catches bugs at compile time
- Better developer experience (autocomplete, refactoring)
- Self-documenting code
- Enables advanced patterns (branded types, discriminated unions)

**Alternatives Considered**:
- JavaScript with JSDoc: Less type safety, more runtime errors
- Optional TypeScript: Inconsistent codebase, missed opportunities

### Why Declarative Game Definitions?

**Decision**: Games defined through configuration objects, not classes or functions.

**Rationale**:
- Less boilerplate
- Easier to serialize and version
- Natural fit for TCG rules
- Framework can optimize and validate

**Alternatives Considered**:
- Class-based: More verbose, harder to serialize
- Function-based: Less structured, harder to validate
- DSL: Too complex, requires parser

### Why Delta Synchronization?

**Decision**: Use Immer patches for network synchronization.

**Rationale**:
- Efficient (only send changes, not full state)
- Automatic (no manual diffing)
- Bidirectional (client and server sync)
- Framework-tested

**Alternatives Considered**:
- Full state sync: Too inefficient for large games
- Manual diffing: Error-prone, verbose
- Operational transforms: Too complex for TCGs

### Why Seeded RNG?

**Decision**: All randomness uses seeded random number generators.

**Rationale**:
- Deterministic gameplay enables replay
- Testable (same seed = same outcome)
- Validatable (server can verify client moves)
- Debuggable (reproduce bugs with seed)

**Alternatives Considered**:
- Math.random(): Non-deterministic, can't replay
- Server-only RNG: Requires server for all randomness
- Hybrid: Too complex, inconsistent behavior

## Comparison with Alternatives

### vs. boardgame.io

[boardgame.io](https://boardgame.io/) is an excellent framework for general turn-based games. @tcg/core is specifically designed for trading card games.

**When to use boardgame.io**:
- Building non-card board games
- Need built-in lobby/matchmaking
- Want auto-generated AI bots
- Prefer JavaScript over TypeScript

**When to use @tcg/core**:
- Building trading card games
- Need TCG-specific features (zones, targeting, card abilities)
- Want type safety and TypeScript
- Need deterministic replay
- Building custom multiplayer infrastructure

### vs. Custom Solutions

Building your own game engine gives you complete control but requires significant effort.

**When to build custom**:
- Unique requirements not covered by frameworks
- Need complete control over architecture
- Have extensive game engine experience
- Building proprietary technology

**When to use @tcg/core**:
- Building a TCG (saves months of development)
- Want production-ready features
- Need type safety and testing tools
- Want to focus on game design, not infrastructure

### vs. Unity/Godot

Full game engines are powerful but overkill for web-based TCGs.

**When to use Unity/Godot**:
- Need 3D graphics
- Building mobile apps
- Need physics simulation
- Building action games

**When to use @tcg/core**:
- Building web-based TCGs
- Want lightweight, fast framework
- Need server-side game logic
- Prefer TypeScript/JavaScript ecosystem

## Principles in Practice

### Example: Adding a New Move

**Following the Philosophy**:

```typescript
// ✅ Declarative: Define the move in game definition
const moves: GameMoveDefinitions<State, Moves> = {
  playCard: {
    // Type-safe condition
    condition: (state, context) => {
      const player = state.players.find(p => p.id === context.playerId);
      return player?.hand.includes(context.data?.cardId) ?? false;
    },
    
    // Immutable reducer (looks mutable, is immutable)
    reducer: (draft, context) => {
      const player = draft.players.find(p => p.id === context.playerId);
      const cardId = context.data?.cardId as CardId;
      
      // Framework handles:
      // - State immutability (via Immer)
      // - Patch generation (for network sync)
      // - History tracking (for undo/redo)
      // - Player view updates (for multiplayer)
      
      player.hand = player.hand.filter(id => id !== cardId);
      draft.field.push(cardId);
    },
  },
};
```

**Benefits**:
- Type-safe (TypeScript catches errors)
- Declarative (no orchestration code)
- Immutable (framework handles it)
- Testable (deterministic with seed)
- Production-ready (network sync, replay built-in)

## Conclusion

@tcg/core's philosophy centers on making TCG development faster, safer, and more enjoyable. By being opinionated about architecture, prioritizing type safety, and providing TCG-specific abstractions, we enable developers to focus on what makes their game unique rather than reinventing infrastructure.

The trade-offs are intentional: we optimize for TCG development at the expense of general-purpose flexibility. If you're building a trading card game, these trade-offs are worth it. If you're building something else, consider [boardgame.io](https://boardgame.io/) or another framework.

---

**References**:
- [boardgame.io](https://boardgame.io/) - General-purpose turn-based game framework
- [Immer](https://immerjs.github.io/immer/) - Immutable state management
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

**Last Updated**: 2025-01-27
**Version**: 1.0.0

