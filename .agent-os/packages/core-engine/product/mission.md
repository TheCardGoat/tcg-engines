# Product Mission

## Pitch

Core Engine is a specialized framework for building trading card game (TCG) simulators that helps game developers, studios, and hobbyists create robust game engines by providing a battle-tested, extensible core with type-safe state management, move validation, and delta synchronization out of the box.

## Users

### Primary Customers

- **TCG Game Developers**: Independent developers creating digital versions of trading card games who need a solid foundation without reinventing the wheel
- **Game Studios**: Studios working on TCG titles who want to focus on game-specific rules and UI rather than engine infrastructure
- **Hobbyists & Community Developers**: Enthusiasts building simulators for their favorite card games to enable online play

### User Personas

**Indie Game Developer** (25-40 years old)
- **Role:** Full-stack developer or small team lead
- **Context:** Working on a digital TCG implementation with limited resources
- **Pain Points:** Complex state management in card games, networking/multiplayer coordination, validation of game rules, ensuring deterministic gameplay for replays
- **Goals:** Ship a stable multiplayer TCG within 6-12 months, minimize infrastructure code, focus on game-specific features and UI

**Community Simulator Developer** (18-35 years old)
- **Role:** Open-source contributor or hobbyist programmer
- **Context:** Building fan-made simulators for popular TCGs to enable online play
- **Pain Points:** Implementing complex card interactions, handling edge cases in rules, maintaining compatibility with official game updates
- **Goals:** Create a functional simulator for online play, support community events, iterate quickly on card implementations

**Game Studio Technical Lead** (30-50 years old)
- **Role:** Senior engineer or architect
- **Context:** Leading TCG project development at an established studio
- **Pain Points:** Ensuring scalability for large player bases, maintaining code quality across team, supporting multiple game modes and formats
- **Goals:** Build production-ready TCG infrastructure, minimize technical debt, enable rapid iteration on game design

## The Problem

### Fragmented TCG Development Landscape

Existing game frameworks like Board Game IO and Boardzilla provide general board game infrastructure but lack specialized features critical to trading card games: complex card state tracking, zone-based card positioning, priority systems, and deterministic replay from action logs. Developers end up spending 40-60% of their time building engine fundamentals rather than implementing game-specific rules.

**Our Solution:** Core Engine provides a specialized TCG framework with immutable state management, move validation, zone systems, and delta synchronization built-in, reducing engine development time by 70%.

### Lack of Type Safety in Card Game Logic

Most card game implementations use loosely-typed data structures, leading to runtime errors in card interactions, state mutations, and validation logic. This results in difficult-to-debug issues and high maintenance costs.

**Our Solution:** Core Engine leverages TypeScript's strict mode with branded types, schema-first development, and comprehensive type inference to catch errors at compile time and provide excellent IDE support.

### Difficult State Synchronization for Multiplayer

Implementing reliable multiplayer for card games requires server-authoritative state with client-side optimistic updates and efficient delta synchronization. Building this from scratch is complex and error-prone.

**Our Solution:** Core Engine includes built-in delta synchronization using JSON patches (rfc6902), server-authoritative validation, and a lobby system for game connections, providing production-ready multiplayer infrastructure.

## Differentiators

### TCG-Specific Architecture

Unlike general game frameworks like Board Game IO or Boardzilla which are designed for any board game, Core Engine is purpose-built for trading card games with specialized abstractions: card instances with metadata, zone-based positioning (hand, deck, play area, graveyard), hierarchical game flow (segments → turns → phases → steps), and priority/turn player management. This results in 70% less boilerplate code and more intuitive game-specific implementations.

### Proven Production Track Record

Unlike theoretical frameworks or early-stage libraries, Core Engine is extracted from a battle-tested Disney Lorcana implementation. This means the architecture has been validated against real-world complexity including edge cases, performance requirements, and maintainability concerns at scale.

### Test-Driven Development Foundation

Unlike most game frameworks which treat testing as an afterthought, Core Engine enforces strict TDD practices with behavior-driven testing through public APIs, comprehensive test utilities, and a philosophy that tests are specifications. This results in robust, maintainable code with confidence in refactoring and feature additions.

## Key Features

### Core Features

- **Type-Safe Game Definitions**: Define games with full TypeScript type inference, custom card types, player state extensions, and game-specific rules with compile-time validation
- **Move System**: Declarative move definitions with automatic validation, context access, enumerable moves for AI/client-side rendering, and invalid move handling
- **State Management**: Immutable state with delta synchronization using JSON patches, server-authoritative validation, and efficient client updates
- **Card Abstraction**: Rich card instance model with metadata, filtering, operations (draw, shuffle, play, discard), and repository pattern for card definitions
- **Zone System**: Built-in support for card zones (hand, deck, play area, graveyard, exile) with position tracking and zone-specific operations

### Game Flow Features

- **Hierarchical Flow Management**: Game structure with segments (setup, gameplay, end), turns (player rotation), phases (draw, main, combat), and steps (untap, draw) with automatic transitions
- **Priority System**: Turn player and priority player tracking with automatic priority passing and validation
- **Flow Hooks**: Extensible hooks for phase/turn/step transitions, allowing game-specific logic injection at any point in the flow

### Developer Experience Features

- **Comprehensive Logging**: Structured logging with configurable levels, telemetry support, and debugging utilities for state inspection
- **Error Handling**: Type-safe result patterns, comprehensive error types (InvalidMoveError, MoveExecutionError), and helpful error messages
- **Test Utilities**: Factory functions for test data, mock card repositories, game state builders, and behavior-driven testing patterns

### Multiplayer Features

- **Lobby System**: Built-in lobby engine for game creation, player connections, and event-driven lifecycle management
- **Delta Synchronization**: Efficient state updates using rfc6902 JSON patches, minimizing bandwidth and supporting optimistic updates
- **Replay Support**: Deterministic game logic enabling full game replays from initial state + action logs for debugging and spectating
