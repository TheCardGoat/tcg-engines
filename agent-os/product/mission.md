# @tcg/core - Product Mission

## Product Overview

**@tcg/core** is a production-ready, declarative game engine framework for building trading card games (TCGs) and turn-based strategy games. It provides developers with a complete, type-safe foundation for implementing complex card game rules with immutable state management, network synchronization, and deterministic gameplay.

## Vision

To become the definitive TypeScript framework for TCG development, empowering developers to build sophisticated card games by focusing on game-specific rules rather than infrastructure concerns.

## Mission Statement

Provide a robust, extensible, and developer-friendly framework that enables rapid development of trading card game engines with built-in multiplayer support, deterministic gameplay, and production-ready features out of the box.

## Core Values

1. **Developer Experience First** - Intuitive API design with excellent TypeScript support and comprehensive documentation
2. **Type Safety** - Leverage TypeScript's type system to catch errors at compile time
3. **Declarative over Imperative** - Games defined through configuration, not imperative code
4. **Production Ready** - Built for real-world multiplayer games with network sync, replay, and debugging
5. **Framework, Not Library** - Opinionated architecture that guides best practices
6. **Test-Driven** - Comprehensive test coverage and testability built into the design

## Target Users

### Primary Personas

**1. Indie Game Developer**
- Building their first or second TCG
- Wants to focus on game design, not engine plumbing
- Needs multiplayer support without backend complexity
- Values rapid iteration and prototyping

**2. TCG Platform Builder**
- Creating a platform to support multiple card games
- Needs consistent architecture across games
- Requires robust network synchronization
- Values maintainability and extensibility

**3. Game Studio Engineer**
- Professional developer building commercial TCG
- Needs production-ready features (replay, spectator, matchmaking)
- Requires performance and scalability
- Values comprehensive testing and debugging tools

### Secondary Personas

**4. Open Source Contributor**
- Interested in game engine architecture
- Wants to contribute to reference implementations
- Values clean code and good documentation

**5. Educational User**
- Learning game development or TCG mechanics
- Needs clear examples and tutorials
- Benefits from declarative, readable code

## Problem Statement

Building a trading card game engine from scratch is complex and time-consuming:

- **State Management Complexity** - Managing immutable game state across turns, phases, and moves
- **Network Synchronization** - Keeping client and server state synchronized efficiently
- **Deterministic Gameplay** - Ensuring identical outcomes for replays and validation
- **Testing Challenges** - Testing complex game rules with many edge cases
- **Boilerplate Code** - Writing repetitive infrastructure code instead of game logic
- **Multiplayer Infrastructure** - Implementing server-authoritative gameplay with client prediction
- **Debugging Difficulty** - Tracking down bugs in complex game state interactions

## Solution

@tcg/core solves these problems by providing:

1. **Declarative Game Definitions** - Define games through configuration objects
2. **Immutable State via Immer** - Automatic structural sharing for performance
3. **Delta Synchronization** - Efficient network sync using Immer patches
4. **Deterministic RNG** - Seeded random number generation for replay
5. **Move System** - Type-safe move validation and execution
6. **Flow Management** - Optional turn/phase/segment orchestration
7. **Zone Abstractions** - Flexible card location management
8. **Time-Travel Debugging** - Complete undo/redo with history replay
9. **Player Views** - Automatic information hiding for multiplayer
10. **Test-Friendly Design** - High test coverage with real engine instances

## Key Features

### Core Engine Features
- Immutable state management with Immer
- Type-safe move system with validation
- Deterministic gameplay with seeded RNG
- Delta-based network synchronization
- Complete undo/redo history
- Player-specific state views

### Game Definition Features
- Declarative game configuration
- Zone management (deck, hand, play, etc.)
- Flow orchestration (turns/phases/segments)
- Card instance system
- Targeting system
- Card filtering DSL

### Developer Experience Features
- Full TypeScript support with branded types
- Comprehensive test coverage
- Clear documentation and examples
- Reference implementations
- Integration guides
- Migration tooling

## Success Metrics

### Adoption Metrics
- Number of games built with @tcg/core
- GitHub stars and community engagement
- NPM downloads and active projects
- Community contributions

### Developer Experience Metrics
- Time to first working game
- Developer satisfaction (surveys)
- Documentation quality ratings
- Support request frequency

### Technical Metrics
- Test coverage (target: 95%+)
- API stability (semantic versioning)
- Performance benchmarks
- Bundle size optimization

### Community Metrics
- Active contributors
- Issue resolution time
- Pull request merge rate
- Community-contributed examples

## Competitive Landscape

### Alternatives

**1. Boardgame.io**
- General board game framework
- Not specialized for TCGs
- Different architecture philosophy

**2. Custom Solutions**
- Built from scratch per game
- High development time
- Inconsistent patterns

**3. Unity/Godot**
- Full game engines, not TCG-specific
- Overkill for web-based TCGs
- Steeper learning curve

### Differentiation

@tcg/core is differentiated by:
- TCG-specific abstractions (zones, cards, targeting)
- TypeScript-first design
- Declarative game definitions
- Built-in network sync
- Production-ready multiplayer
- Comprehensive testing support

## Product Roadmap Alignment

The product roadmap focuses on three pillars:

1. **Core Framework Stability** - Robust, well-tested foundation
2. **Developer Experience** - Excellent DX with docs and tooling
3. **Ecosystem Growth** - Reference implementations and community

See `roadmap.md` for detailed phase breakdown.

## Go-to-Market Strategy

### Phase 1: Foundation (Current)
- Build reference implementations (Lorcana, Gundam)
- Comprehensive documentation
- Open source release

### Phase 2: Community Building
- Tutorials and guides
- Example games
- Developer outreach
- Conference talks

### Phase 3: Ecosystem Growth
- Third-party game implementations
- Plugin system
- Tooling ecosystem
- Commercial support options

## Technical Philosophy

### Architecture Principles
- **Immutability** - All state changes create new state
- **Purity** - Functions are pure and testable
- **Composition** - Small, composable pieces
- **Type Safety** - Leverage TypeScript fully
- **Declarative** - Configuration over code
- **Testability** - Design for testing first

### Engineering Standards
- TDD (Test-Driven Development)
- 95%+ test coverage
- Comprehensive documentation
- Semantic versioning
- Clear migration guides
- Backwards compatibility

## Dependencies Strategy

### Core Dependencies
- **Immer** - Immutable state management
- **Zod** - Runtime type validation
- **nanoid** - Unique ID generation
- **seedrandom** - Deterministic RNG

### Development Dependencies
- **TypeScript** - Type system and compiler
- **Bun** - Fast test runner
- **Biome** - Linting and formatting

### Dependency Philosophy
- Minimize dependencies
- Choose stable, well-maintained libraries
- Avoid frameworks with breaking changes
- Keep bundle size small

## Future Vision

### 1-2 Year Vision
- De facto TypeScript TCG framework
- Multiple successful games in production
- Active community of contributors
- Rich ecosystem of tooling

### 3-5 Year Vision
- Platform for TCG innovation
- AI/ML integration for playtesting
- Visual game designer tool
- Commercial support offerings
- Tournament and esports integration

## Risks and Mitigation

### Technical Risks
- **Performance at scale** - Mitigation: Profiling and optimization
- **API stability** - Mitigation: Semantic versioning, deprecation cycles
- **Framework lock-in** - Mitigation: Export standards, migration tools

### Market Risks
- **Low adoption** - Mitigation: Marketing, examples, outreach
- **Competition** - Mitigation: Continuous innovation, community focus
- **Maintenance burden** - Mitigation: Modular design, community contributions

## Conclusion

@tcg/core represents a comprehensive solution for building production-ready trading card games in TypeScript. By focusing on developer experience, type safety, and production features, it enables developers to build sophisticated card games efficiently while maintaining code quality and testability.

The framework's declarative approach, combined with powerful features like delta synchronization and deterministic gameplay, positions it as the leading choice for TypeScript TCG development.

---

**Last Updated**: 2025-10-09
**Version**: 0.1.0
**Status**: Active Development
