# Spec Requirements Document

> Spec: Core Engine Foundation (M1-M2)
> Created: 2025-10-07
> Status: ✅ **COMPLETED** (Implementation completed October 2025)

## Overview

Build the foundational `@tcg/core` engine with a declarative GameDefinition pattern, type-safe move system, Immer-based immutable state management, delta synchronization via patches, and turn/phase/step flow orchestration. This framework will enable TCG developers to build production-ready trading card games without reinventing state management, multiplayer sync, and complex turn structures.

## User Stories

### Game Developer Building a TCG

As a game developer, I want to define my game's rules declaratively through a GameDefinition, so that I can focus on game-specific logic without implementing low-level state management.

**Workflow:**
1. Developer creates a GameDefinition with initial state setup, valid moves, flow configuration, and win conditions
2. Developer implements move reducers that update state immutably via Immer
3. Developer configures turn flow with phases and steps specific to their game
4. Framework validates moves, manages state transitions, and generates deltas automatically
5. Developer receives type-safe APIs with full TypeScript autocomplete

**Problem Solved:** Eliminates boilerplate state management code and ensures consistency across move execution and validation.

### Multiplayer Game Synchronization

As a developer building a multiplayer TCG, I want the framework to generate minimal state deltas, so that I can efficiently synchronize game state between server and clients over the network.

**Workflow:**
1. Player executes a move on the client
2. Engine validates and applies the move, generating Immer patches automatically
3. Developer sends only the patches (not full state) to the server
4. Server applies patches to authoritative state and broadcasts to other clients
5. Clients apply patches to their local state, staying synchronized

**Problem Solved:** Reduces network bandwidth by 90%+ compared to sending full state, enables smooth multiplayer experience with minimal latency.

### Implementing Undo/Redo and Replay

As a developer, I want built-in support for undo/redo and game replay, so that I can provide time-travel debugging and spectator features without complex implementation.

**Workflow:**
1. Framework automatically tracks all state changes and generates patches
2. Developer calls `engine.undo()` to revert the last move
3. Developer calls `engine.redo()` to reapply an undone move
4. Developer calls `engine.replay(actions)` to reconstruct a game from action log
5. Framework maintains consistency and ensures deterministic replay

**Problem Solved:** Enables powerful debugging, testing, and spectator features that would otherwise require significant custom development.

## Spec Scope

1. **GameDefinition Type System** - Declarative configuration for game setup, moves, flow, win conditions, and player views with full TypeScript generics.

2. **Rule Engine Core** - Main engine class that accepts GameDefinition, processes moves, manages state transitions, and provides APIs for game interaction.

3. **Immer-Based State Management** - Immutable state updates using Immer with automatic patch generation for every state change.

4. **Zone Management System** - First-class zone abstraction for managing card zones (hand, deck, play area, graveyard, exile, etc.) with support for private/public/secret zones, zone operations (draw, shuffle, move cards), and zone queries.

5. **Card State Management** - Generic card instance model with mandatory core fields (id, zone, owner, tapped, etc.) and game-specific extensions. Computed properties pattern for derived values (power + modifiers).

6. **Card Filtering DSL** - Declarative query language for selecting and filtering cards based on properties, zones, and game state (e.g., "all creatures with power > 5", "all tapped permanents you control").

7. **Targeting System** - Comprehensive targeting infrastructure for move validation, including target selection, legal target validation, target requirements (min/max), targeting restrictions, and multi-target support.

8. **Move System** - Type-safe move definitions with validation conditions, execution reducers, automatic error handling, and integrated targeting support.

9. **XState Flow Manager** - Turn/phase/step orchestration using XState state machines for configurable, visualizable game flow with automatic transitions, guards, and actions.

10. **Seeded RNG System** - Deterministic random number generation with seed management, allowing replay consistency and testing predictability.

11. **AI Move Enumeration** - APIs for enumerating all valid moves and targets at any game state, enabling AI opponent implementation and move suggestion.

12. **Delta Synchronization** - Utilities for working with Immer patches: apply, reverse, serialize, and deserialize for network transmission.

13. **Player View Filtering** - Generate player-specific state views that hide private information (opponent's hand, deck contents, face-down cards).

14. **Replay System** - Reconstruct any game state from initial state plus action log with deterministic execution.

## Out of Scope

- **UI/Rendering** - Framework is logic-only; no React, Vue, or UI components included
- **Networking Layer** - No WebSocket implementation, HTTP client, or matchmaking services
- **AI Opponents** - No built-in AI; framework supports it but doesn't provide implementation
- **Asset Management** - No image loading, sound effects, or asset pipeline
- **Persistence** - No database integration or save/load functionality (consumer's responsibility)
- **Authentication** - No user accounts, login, or authorization
- **Reference Game Implementation** - M3 (Magic-like engine) is separate from core engine spec

## Expected Deliverable

1. **Functional Core Engine** - Developers can create a TCG with zones, cards, and moves executing correctly. Example: simple card game with deck, hand, and play zones where players can draw, play, and interact with cards.

2. **Zone Management Working** - Zones (deck, hand, play area, graveyard) with operations (draw, shuffle, move between zones) and support for private/public visibility.

3. **Card Filtering DSL Functional** - Query language for selecting cards: developers can write filters like `cards.where({ zone: 'play', type: 'creature', power: { gte: 5 } })`.

4. **Seeded RNG Integrated** - Deterministic randomness: shuffling deck with seed produces same order, enabling replay and testing.

5. **AI Move Enumeration** - API to get all valid moves and targets at current state: `engine.getValidMoves(playerId)` returns enumerated actions.

6. **XState Flow Orchestration** - Turn flow managed via XState machines with visualizable state transitions, guards, and actions.

7. **Delta Synchronization Working** - Engine generates Immer patches for every move, patches can be serialized/deserialized for network sync.

8. **Comprehensive Test Coverage** - 95%+ behavior test coverage covering zones, cards, filtering, RNG, flow, and replay.

9. **Type-Safe APIs** - Full TypeScript strict mode with generics, no `any` types, complete IDE autocomplete.

10. **Documentation Complete** - API reference via TypeDoc, guides for zones/cards/DSL/flow/RNG, and tutorial showing complete TCG implementation.

