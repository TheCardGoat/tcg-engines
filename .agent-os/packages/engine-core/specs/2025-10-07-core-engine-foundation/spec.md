# Spec Requirements Document

> Spec: Core Engine Foundation (M1-M2)
> Created: 2025-10-07

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

2. **Game Engine Core** - Main engine class that accepts GameDefinition, processes moves, manages state transitions, and provides APIs for game interaction.

3. **Immer-Based State Management** - Immutable state updates using Immer with automatic patch generation for every state change.

4. **Move System** - Type-safe move definitions with validation conditions, execution reducers, and automatic error handling.

5. **Flow Manager** - Turn/phase/step orchestration with configurable phases, automatic transitions, lifecycle hooks (onBegin, onEnd), and endIf conditions.

6. **Delta Synchronization** - Utilities for working with Immer patches: apply, reverse, serialize, and deserialize for network transmission.

7. **Player View Filtering** - Generate player-specific state views that hide private information (opponent's hand, deck contents).

8. **Replay System** - Reconstruct any game state from initial state plus action log with deterministic execution.

## Out of Scope

- **UI/Rendering** - Framework is logic-only; no React, Vue, or UI components included
- **Networking Layer** - No WebSocket implementation, HTTP client, or matchmaking services
- **AI Opponents** - No built-in AI; framework supports it but doesn't provide implementation
- **Asset Management** - No image loading, sound effects, or asset pipeline
- **Persistence** - No database integration or save/load functionality (consumer's responsibility)
- **Authentication** - No user accounts, login, or authorization
- **Reference Game Implementation** - M3 (Magic-like engine) is separate from core engine spec

## Expected Deliverable

1. **Functional Core Engine** - Developers can create a simple TCG (e.g., coin flip game or rock-paper-scissors) using GameDefinition with moves executing correctly and state transitioning through phases.

2. **Delta Synchronization Working** - Engine generates Immer patches for every move, patches can be serialized/deserialized, and state can be reconstructed by applying patches in sequence.

3. **Comprehensive Test Coverage** - 95%+ behavior test coverage with tests documenting expected behavior for all core features: move validation, state transitions, flow orchestration, player views, and replay.

4. **Type-Safe APIs** - Full TypeScript strict mode with generics, no `any` types, complete IDE autocomplete for GameDefinition and moves.

5. **Documentation Complete** - API reference via TypeDoc, core concepts guide explaining GameDefinition/moves/flow/deltas, and quick start tutorial showing simple game implementation.

