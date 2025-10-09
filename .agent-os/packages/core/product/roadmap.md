# Product Roadmap

## Phase 1: Core Engine Foundation (M1-M2)

**Goal:** Build the foundational core engine with GameDefinition, move system, and delta synchronization
**Success Criteria:** Core engine works with simple games, full test coverage, delta patching functional
**Status:** 🔵 Planned

### M1: Core Engine with GameDefinition, Moves, and Basic Flow

- [ ] **GameDefinition Type System** - Define TypeScript types for declarative game configuration `S`
- [ ] **Game Engine Core** - Main engine class that processes moves and manages state `M`
- [ ] **State Manager** - Immer-based state management with immutable updates `M`
- [ ] **Move System** - Type-safe move definitions with validation and execution `L`
- [ ] **Move Validator** - Validate moves against conditions before execution `M`
- [ ] **Flow Manager** - Turn/phase/step orchestration with lifecycle hooks `L`
- [ ] **Basic Flow Configuration** - Support for phases and steps with auto-advance `M`
- [ ] **Test Infrastructure** - Testing utilities and factory functions for game testing `S`

### M2: Delta Patching + Immer Integration

- [ ] **Immer Patch Generation** - Automatic patch generation for state changes `M`
- [ ] **Delta Utilities** - Helper functions for working with patches (apply, reverse) `S`
- [ ] **State History** - Track state changes for undo/redo support `M`
- [ ] **Player View Filtering** - Generate player-specific views hiding private info `L`
- [ ] **Replay System** - Replay games from initial state + action log `M`
- [ ] **Serialization** - Serialize/deserialize game state for network transmission `S`

### Documentation

- [ ] **API Documentation** - Complete TypeDoc-generated API reference `M`
- [ ] **Core Concepts Guide** - Explain GameDefinition, moves, flow, deltas `M`
- [ ] **Quick Start Tutorial** - Simple example game from scratch `S`
- [ ] **Migration Guide** - Guide for extracting patterns from existing core-engine `S`

### Dependencies

- None (greenfield project)

---

## Phase 2: Reference Implementation (M3)

**Goal:** Validate framework with a real game implementation
**Success Criteria:** Complete reference game works end-to-end with all core features
**Status:** 🔵 Planned

### M3: Magic-like Engine (`@tcg/engine-magic`)

- [ ] **Game Setup** - Initial state, deck shuffling, starting hands `S`
- [ ] **Core Moves** - Draw, play card, attack, block, end turn `M`
- [ ] **Combat System** - Attack/block mechanics with damage resolution `M`
- [ ] **Mana System** - Land playing, tapping, mana generation `S`
- [ ] **Phase System** - Magic's phase structure (draw, main1, combat, main2, end) `M`
- [ ] **Win Conditions** - Life total tracking, game end detection `S`
- [ ] **Card Types** - Creatures, spells, lands with basic abilities `L`

### Documentation

- [ ] **Reference Game Guide** - Complete walkthrough of Magic implementation `M`
- [ ] **Best Practices** - Patterns learned from building reference game `S`

### Dependencies

- Phase 1 (M1-M2) must be complete

---

## Phase 3: Developer Experience (M4)

**Goal:** Make framework easy to adopt and iterate on
**Success Criteria:** Demo app works, developers can build games in <2 hours
**Status:** 🔵 Planned

### M4: Demo App with Local Multiplayer

- [ ] **React Demo App** - Simple UI showing framework integration `L`
- [ ] **Local Multiplayer** - Two-player mode with separate views `M`
- [ ] **Move UI** - Interactive UI for executing moves `M`
- [ ] **State Visualization** - Display game state and history `S`
- [ ] **Undo/Redo UI** - Buttons for time-travel debugging `S`

### Developer Tools

- [ ] **Game State Debugger** - Console tool for inspecting state `M`
- [ ] **Move Enumeration Visualizer** - See all valid moves at any state `S`
- [ ] **Type-Safe Move Builder** - IDE autocomplete for move definitions `S`

### Documentation

- [ ] **Integration Guide** - How to integrate with React/Vue/other UIs `M`
- [ ] **Multiplayer Guide** - Patterns for client-server synchronization `M`
- [ ] **Troubleshooting Guide** - Common errors and solutions `S`

### Dependencies

- Phase 2 (M3) must be complete for demo app

---

## Phase 4: Open Source Release (M5)

**Goal:** Publish to npm and build community
**Success Criteria:** Packages published, documentation live, first external contributors
**Status:** 🔵 Planned

### M5: npm Publishing

- [ ] **Package Configuration** - Configure for npm publishing under `@tcg/` scope `S`
- [ ] **Semantic Versioning** - Set up conventional commits and auto-versioning `S`
- [ ] **Publish Workflow** - CI/CD for automated publishing `M`
- [ ] **npm README** - Clear README with badges, examples, links `S`

### Community

- [ ] **GitHub Repository** - Public repo with issue templates, PR guidelines `S`
- [ ] **Contributing Guide** - Guidelines for external contributors `S`
- [ ] **Code of Conduct** - Community standards `S`
- [ ] **Examples Collection** - Multiple example games for reference `M`

### Documentation

- [ ] **Documentation Site** - Hosted docs with search and navigation `L`
- [ ] **Video Walkthrough** - Screen recording showing framework usage `M`
- [ ] **Blog Post** - Launch announcement with technical deep-dive `S`

### Dependencies

- Phases 1-3 must be complete and stable

---

## Phase 5: Advanced Features

**Goal:** Support production-scale TCGs with advanced features
**Success Criteria:** Framework handles complex games, performance optimized
**Status:** 🔵 Future

### Advanced Gameplay

- [ ] **Priority System** - Fine-grained turn control (like Magic's priority) `L`
- [ ] **Stack System** - Priority-based stack for resolving effects `L`
- [ ] **Trigger System** - Event-driven triggers for card abilities `XL`
- [ ] **Continuous Effects** - Persistent effects that modify game rules `L`
- [ ] **Replacement Effects** - Effects that replace game events `M`

### Performance & Scale

- [ ] **State Compression** - Optimize state storage for large games `M`
- [ ] **Lazy Loading** - Load game data on-demand `S`
- [ ] **Performance Profiling** - Built-in telemetry hooks `M`
- [ ] **Benchmark Suite** - Performance testing across game types `M`

### Developer Experience

- [ ] **CLI Tool** - Scaffold new games with templates `M`
- [ ] **Hot Reload** - Live game development with state preservation `L`
- [ ] **Visual Flow Editor** - GUI for designing turn structures `XL`
- [ ] **Card Definition DSL** - Domain-specific language for card effects `L`

### Dependencies

- Requires stable v1.0 release from Phases 1-4

---

## Versioning Strategy

- **v0.1**: M1 complete - Core engine with moves and flow
- **v0.2**: M2 complete - Delta patching and player views
- **v0.5**: M3 complete - Reference game implementation
- **v0.8**: M4 complete - Demo app and tooling
- **v1.0**: M5 complete - Public release with documentation
- **v2.0**: Phase 5 complete - Advanced features

---

## Success Metrics

### Adoption
- 10+ production TCG implementations using the framework
- 100+ GitHub stars in first 6 months
- 10+ external contributors

### Performance
- Support 10,000+ concurrent games with <100ms move latency
- <50KB core bundle size (gzipped)
- <10ms state update time for typical moves

### Developer Experience
- <2 hour onboarding time for new developers
- <1 day to build simple TCG prototype
- 95%+ developer satisfaction in surveys

### Code Quality
- 95%+ test coverage across all core modules
- 0 critical bugs in production
- <2 day average time to resolve issues

---

## Migration from Existing Core Engine

### Extraction Strategy

The existing `packages/engines/core-engine` will be **replaced** by `@tcg/core`, but we'll extract valuable patterns:

#### What to Extract
- ✅ Card abstraction patterns (zones, instances, metadata)
- ✅ Move validation patterns (conditions, execution)
- ✅ Flow management patterns (segments, phases, steps)
- ✅ Error handling patterns (Result types, domain errors)
- ✅ Testing patterns (factory functions, behavior tests)

#### What to Simplify
- 🔄 State management: Replace complex Redux/TanStack with simple Immer
- 🔄 Delta sync: Use built-in Immer patches instead of custom rfc6902
- 🔄 Type system: Simplify to generic types, remove Lorcana-specific types
- 🔄 Dependencies: Minimize external dependencies

#### Migration Path
1. **Phase 1**: Build new core with extracted patterns
2. **Phase 2**: Validate with reference implementation
3. **Phase 3**: Migrate Lorcana to new framework
4. **Phase 4**: Deprecate old core-engine

---

## Non-Goals (Out of Scope)

### Not Included in Core Framework
- ❌ **Rendering/UI**: This is a **logic-only** framework
- ❌ **Networking layer**: No WebSockets, HTTP, or matchmaking
- ❌ **AI opponents**: Architecture supports it, but not included
- ❌ **Asset management**: Cards, images, sounds handled by consumer
- ❌ **Authentication**: No user accounts or auth
- ❌ **Database**: No persistence layer (consumer's responsibility)

### Framework Boundaries
The framework provides:
- ✅ Game logic and state management
- ✅ Delta-ready state for network sync
- ✅ Type-safe APIs for UI integration
- ✅ Deterministic replay and undo

The consumer provides:
- ❌ UI rendering
- ❌ Network transport
- ❌ Persistence/database
- ❌ Authentication/authorization
- ❌ Asset loading and management

