# Technical Stack

## Core Technologies

### Runtime & Package Management
- **Runtime:** Bun (Node 22+ compatible)
- **Package Manager:** Bun workspaces
- **Module System:** ESNext with bundler module resolution
- **Monorepo Orchestration:** Turbo Repo

### Language & Type System
- **Language:** TypeScript 5.5+
- **Target:** ES2022
- **Type Checking:** Strict mode enabled
- **Type Strategy:** Schema-first with branded types for domain safety

## Development Tools

### Code Quality
- **Formatter:** Biome 2.0.4
- **Linter:** Biome 2.0.4
- **Type Checker:** TypeScript compiler
- **Build Tool:** Turbo + `bun build`

### Testing
- **Test Runner:** Bun test
- **Test Approach:** Behavior-driven testing (TDD mandatory)
- **Coverage:** Bun test coverage
- **Test Philosophy:** Tests as specifications, no mocking/stubbing

## Core Dependencies

### State Management
- **Immutability:** Immer (core dependency - provides immutable updates and patch generation)
- **Delta Synchronization:** Immer patches (built-in to Immer)

### Type Utilities
- **Type-Level Utilities:** TypeScript utility types (built-in)
- **Runtime Validation:** (TBD - consider Zod or similar for GameDefinition validation)

### Utilities
- **IDs:** nanoid (for unique game/player IDs)
- **Scheduling:** (TBD - may use native Promises or async utilities)

## Project Structure

### Package Layout
```
packages/engine-core/
├── src/
│   ├── core/                     # Core engine implementation
│   │   ├── game-definition.ts    # GameDefinition types
│   │   ├── game-engine.ts        # Main engine class
│   │   ├── state-manager.ts      # State + Immer integration
│   │   ├── move-validator.ts     # Move validation logic
│   │   ├── flow-manager.ts       # Turn/phase/step orchestration
│   │   └── player-view.ts        # Player view filtering
│   ├── types/                    # Type definitions
│   │   ├── game-state.ts         # Base game state types
│   │   ├── move.ts               # Move types
│   │   ├── flow.ts               # Flow types (phase/step)
│   │   └── index.ts              # Exports
│   ├── utils/                    # Utility functions
│   │   ├── delta.ts              # Delta patching utilities
│   │   ├── validation.ts         # Validation helpers
│   │   └── index.ts              # Exports
│   └── index.ts                  # Main entry point
├── __tests__/                    # Test files (co-located)
│   ├── game-engine.test.ts
│   ├── flow-manager.test.ts
│   └── ...
├── package.json
├── tsconfig.json
├── biome.json
└── README.md
```

## Architecture Patterns

### Design Patterns
- **Immutable State:** All state changes create new objects via Immer
- **Action-Based State Transitions:** All changes through typed moves/actions
- **Delta Synchronization:** Immer patches for efficient state updates
- **Repository Pattern:** GameDefinition as declarative config
- **Pure Functions:** Functional programming preferred
- **Type Safety:** Strict TypeScript with branded types

### Core Principles
- **Immutable Data:** All state changes create new objects
- **Deterministic Logic:** Same inputs always produce same outputs
- **Type Safety:** Strict TypeScript with no `any` types
- **Separation of Concerns:** Core logic separated from game implementations
- **Testability:** Every feature covered by behavior tests

## Build & Deployment

### Build Configuration
- **Build Command:** `bun build`
- **Type Check:** `tsc --noEmit`
- **Output Directory:** `./dist`
- **Source Maps:** Enabled
- **Declaration Maps:** Enabled

### Quality Checks
- **Check Command:** `turbo format lint check-types test`
- **Format:** Biome check with auto-fix
- **Lint:** Biome lint with auto-fix
- **Test:** Bun test in silent mode

## Infrastructure

### Package Distribution
- **Type:** TypeScript library
- **Usage:** Imported as npm package by game implementations
- **Deployment:** Published to npm registry as `@tcg/core`
- **License:** MIT

### Code Repository
- **Monorepo:** Bun workspaces with Turbo
- **Version Control:** Git
- **Package Scope:** `@tcg/*`

## Dependencies Philosophy

### Minimal Dependencies
- Keep core dependencies to a minimum
- Prefer built-in TypeScript/JavaScript features
- Only add dependencies that provide significant value
- Immer is the foundational dependency (non-negotiable)

### No UI Dependencies
- This is a **logic-only** framework
- No React, Vue, or other UI framework dependencies
- UI layer is consumer's responsibility

### No Network Dependencies
- No WebSocket libraries
- No HTTP client libraries
- Framework provides delta-ready state; networking is consumer's responsibility

## Future Considerations

### Potential Additions
- **Runtime Validation:** Zod or similar for GameDefinition validation
- **Performance Monitoring:** Lightweight telemetry hooks
- **Documentation Generation:** TypeDoc for API documentation
- **Plugin System:** Extension points for custom functionality

