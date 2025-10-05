# Product Roadmap

## Phase 0: Already Completed ✅

The following features have been implemented in the Disney Lorcana engine and form the foundation for the generic framework:

**Goal:** Establish production-ready TCG engine infrastructure
**Success Criteria:** Stable multiplayer gameplay, comprehensive test coverage, deterministic state management

### Core Engine Features

- [x] **Core Engine Architecture** - Server-authoritative engine with type-safe game definitions and extensible move system `COMPLETED`
- [x] **Card Abstraction System** - Card instance model with metadata, filtering, operations (draw, shuffle, play, discard) and repository pattern `COMPLETED`
- [x] **Move Validation & Execution** - Declarative move definitions with automatic validation, context access, and error handling `COMPLETED`
- [x] **State Management** - Immutable state with delta synchronization using JSON patches (rfc6902) for efficient updates `COMPLETED`
- [x] **Zone System** - Card zones (hand, deck, play area, graveyard, exile) with position tracking and zone-specific operations `COMPLETED`
- [x] **Hierarchical Flow Management** - Game structure with segments, turns, phases, and steps with automatic transitions `COMPLETED`
- [x] **Priority System** - Turn player and priority player tracking with automatic priority passing `COMPLETED`
- [x] **Error Handling** - Comprehensive error types (InvalidMoveError, MoveExecutionError) with type-safe result patterns `COMPLETED`
- [x] **Lobby Engine** - Game creation, player connections, and event-driven lifecycle management `COMPLETED`
- [x] **Test Infrastructure** - 277 test files with behavior-driven testing, factory functions, and test utilities `COMPLETED`

### Game Implementations

- [x] **Disney Lorcana Engine** - Full implementation with 112,000+ lines of production code `COMPLETED`
- [x] **Partial Engine Implementations** - Riftbound, One Piece, Grand Archive, Alpha Clash, Gundam (various completion states) `COMPLETED`

### Developer Experience

- [x] **Comprehensive Logging** - Structured logging with configurable levels and debugging utilities `COMPLETED`
- [x] **Type System** - TypeScript with branded types, schema-first development, and type utilities `COMPLETED`
- [x] **Development Tools** - Biome for formatting/linting, Bun for testing, Turbo for monorepo management `COMPLETED`

## Phase 1: Generic Framework Extraction

**Goal:** Transform Lorcana-specific implementation into a generic TCG framework
**Success Criteria:** Core engine is game-agnostic, at least 2 games can be fully implemented on the framework, all existing tests pass

### Framework Generalization

- [ ] **Extract Generic Card Model** - Remove Lorcana-specific card properties, create extensible base card interface with game-specific extension points `XL`
- [ ] **Generalize Game State** - Abstract player state, game state, and card metadata to support different TCG architectures `L`
- [ ] **Refactor Zone System** - Make zone definitions configurable per-game (different TCGs have different zones) `M`
- [ ] **Abstract Flow System** - Allow games to define custom segments, phases, and steps without modifying core engine `L`
- [ ] **Move System Generalization** - Ensure move validation and execution works for any TCG rule set `M`

### Documentation & Examples

- [ ] **Framework Documentation** - Comprehensive guide on creating new TCG engines using the framework `L`
- [ ] **API Reference** - Complete TypeDoc-generated API documentation with examples `M`
- [ ] **Starter Template** - Minimal TCG engine implementation template for quick starts `S`
- [ ] **Migration Guide** - Guide for converting Lorcana engine to use generic abstractions `S`

### Dependencies

- Refactoring existing code so all tests pass. We must have at least one test per card.

## Phase 2: Developer Experience & Tooling

**Goal:** Make the framework easy to adopt and iterate on
**Success Criteria:** New developers can implement a basic TCG in under 2 hours, comprehensive debugging support

### Developer Tools

- [ ] **Game State Debugger** - Visual debugger for inspecting game state, history, and move validation `L`
- [ ] **Move Enumeration Visualizer** - Tool to see all valid moves at any game state for testing `M`
- [ ] **Replay Viewer** - Visualize game replays from action logs for debugging and analysis `L`
- [ ] **Card Definition Validator** - CLI tool to validate card definitions against schema before runtime `S`

### Code Quality

- [ ] **Enable TypeScript Strict Mode** - Gradual migration to strict: true with branded types throughout `XL`
- [ ] **Remove Redux Dependency** - Complete migration to @tanstack/store `M`
- [ ] **Improve Test Coverage** - Achieve 95%+ behavior coverage across all core modules `L`
- [ ] **Performance Profiling** - Add telemetry and performance monitoring hooks `M`

### Documentation

- [ ] **Interactive Tutorial** - Step-by-step guide to building a simple TCG from scratch `L`
- [ ] **Video Walkthroughs** - Screen recordings showing common implementation patterns `M`
- [ ] **Troubleshooting Guide** - Common errors and solutions for TCG implementation `S`

### Dependencies

- Phase 1 must be complete for framework documentation to be accurate
- TypeScript strict mode requires significant refactoring effort

## Phase 3: Advanced Features & Optimization

**Goal:** Support production-scale TCGs with advanced features
**Success Criteria:** Framework handles 10,000+ concurrent games, supports AI opponents, extensible effect system

### Performance & Scale

- [ ] **State Compression** - Optimize state storage and transmission for large games `M`
- [ ] **Lazy Card Loading** - Load card definitions on-demand rather than all upfront `S`
- [ ] **Connection Pooling** - Optimize multiplayer connections for large player bases `M`
- [ ] **Caching Layer** - Cache frequently accessed game data and move validations `M`

### Advanced Gameplay

- [ ] **AI Opponent Framework** - Base classes and utilities for implementing AI players `XL`
- [ ] **Tournament Mode** - Multi-game tournaments with brackets and standings `L`
- [ ] **Spectator System** - Allow real-time spectating of ongoing games `M`
- [ ] **Custom Game Modes** - Framework for implementing draft, sealed, commander, etc. `L`

### Effect System

- [ ] **Trigger System** - Event-driven triggers for card abilities (on play, on death, etc.) `XL`
- [ ] **Stack System** - Priority-based stack for resolving card effects in order `L`
- [ ] **Continuous Effects** - Support for persistent effects that modify game rules `L`
- [ ] **Replacement Effects** - Effects that replace game events before they happen `M`

### Dependencies

- Requires Phase 1 and 2 to be stable
- AI framework needs comprehensive move enumeration from Phase 1
- Effect system may require core architecture changes

## Phase 4: Ecosystem & Integrations

**Goal:** Build ecosystem around the framework
**Success Criteria:** 5+ third-party game implementations, active community, plugin marketplace

### Community & Open Source

- [ ] **Open Source Release** - Publish framework as open source with contribution guidelines `M`
- [ ] **Plugin System** - Allow third-party plugins for custom functionality `L`
- [ ] **Community Templates** - Collection of community-contributed game templates `M`
- [ ] **Discord/Forum** - Community space for support and collaboration `S`

### Integrations

- [ ] **Unity Integration** - Bridge for using Core Engine with Unity frontend `XL`
- [ ] **Godot Integration** - Bridge for using Core Engine with Godot frontend `XL`
- [ ] **Web Component Library** - Pre-built React/Vue components for common TCG UI `L`
- [ ] **Card Database Integration** - Adapters for popular card databases (Scryfall, EDHREC, etc.) `M`

### Developer Services

- [ ] **Hosted Game Server** - Optional cloud hosting for Core Engine games `XL`
- [ ] **Matchmaking Service** - Centralized matchmaking across Core Engine games `L`
- [ ] **Analytics Dashboard** - Game analytics and player behavior tracking `L`

### Dependencies

- Requires stable, well-documented framework from Phase 1-3
- Open source release needs legal review and contribution infrastructure
- Hosted services require significant infrastructure investment

## Future Considerations

### Potential Enhancements

- **Mobile SDK**: Native iOS/Android bindings for Core Engine
- **Blockchain Integration**: NFT support for digital card ownership
- **Machine Learning**: Card balance analysis and meta prediction
- **Cross-Platform Play**: Unified player accounts across implementations
- **3D Card Rendering**: Integration with 3D rendering engines for card visualization

### Research Areas

- **Automatic Rule Extraction**: ML-based extraction of rules from physical card text
- **Procedural Card Generation**: AI-generated card designs for prototyping
- **Balance Testing**: Automated testing for card balance and power level
- **Natural Language Moves**: Allow players to describe moves in natural language

## Versioning Strategy

- **v1.0**: Phase 1 complete - Generic framework extraction
- **v1.5**: Phase 2 complete - Developer experience improvements
- **v2.0**: Phase 3 complete - Advanced features and optimization
- **v3.0**: Phase 4 complete - Ecosystem and integrations

## Success Metrics

- **Adoption**: 10+ production TCG implementations using the framework
- **Performance**: Support 10,000+ concurrent games with <100ms move latency
- **Developer Satisfaction**: <2 hour onboarding time for new developers
- **Code Quality**: 95%+ test coverage, 0 critical bugs in production
- **Community**: 1,000+ GitHub stars, 50+ contributors
