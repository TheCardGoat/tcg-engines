# Technical Stack

## Core Technologies

### Runtime & Package Management
- **Runtime:** Bun (latest)
- **Package Manager:** Bun workspaces
- **Module System:** ESNext with bundler module resolution

### Language & Type System
- **Language:** TypeScript 5.8.3
- **Target:** ES2022
- **Type Checking:** Strict mode (currently disabled, planned migration)
- **Type Strategy:** Schema-first with branded types for domain safety

## Development Tools

### Code Quality
- **Formatter:** Biome 2.0.4
- **Linter:** Biome 2.0.4
- **Type Checker:** TypeScript compiler

### Testing
- **Test Runner:** Bun test
- **Test Approach:** Behavior-driven testing (TDD mandatory)
- **Coverage:** Bun test coverage
- **Test Philosophy:** Tests as specifications, no mocking/stubbing

## Core Dependencies

### State Management
- **Primary Store:** @tanstack/store 0.7.0
- **Immutability:** Immer ^9.0.5
- **State Patches:** rfc6902 ^5.0.0 (JSON patch for delta sync)
- **Serialization:** flatted ^3.2.1

### Type Utilities
- **Runtime Type Safety:** lodash.isplainobject ^4.0.6
- **Type-Level Utilities:** ts-toolbelt ^6.3.6
- **Code Generation:** ts-morph ^26.0.0

### Utilities
- **IDs:** nanoid ^3.1.30
- **Async Queue:** p-queue ^6.6.2
- **Scheduling:** setimmediate ^1.0.5

### Legacy/Migration Dependencies
- **Redux:** ^4.1.0 (being phased out in favor of @tanstack/store)
- **React Utilities:** prop-types ^15.5.10, react-cookies ^0.1.0 (for React integrations)

## Project Structure

### Monorepo Layout
```
packages/engines/core-engine/
├── src/
│   ├── game-engine/
│   │   ├── core-engine/          # Framework code
│   │   │   ├── card/              # Card abstraction
│   │   │   ├── engine/            # Core engine
│   │   │   ├── flow/              # Game flow management
│   │   │   ├── game/              # Game structure & zones
│   │   │   ├── move/              # Move system
│   │   │   ├── state/             # State management
│   │   │   ├── types/             # Type definitions
│   │   │   └── utils/             # Utilities
│   │   └── engines/               # Game implementations
│   │       ├── lorcana/           # Disney Lorcana (primary)
│   │       ├── riftbound/
│   │       ├── one-piece/
│   │       ├── grand-archive/
│   │       ├── alpha-clash/
│   │       └── gundam/
│   └── lobby-engine/              # Lobby & connections
├── scripts/                       # Build & utility scripts
└── __tests__/                     # Test files (co-located)
```

## Architecture Patterns

### Design Patterns
- **Server-Authoritative:** Server holds definitive game state
- **Delta Synchronization:** JSON patches for efficient state updates
- **Repository Pattern:** Card definitions managed through repositories
- **Factory Pattern:** Card instance creation
- **Store Pattern:** State management with @tanstack/store

### Code Principles
- **Immutable Data:** All state changes create new objects
- **Pure Functions:** Functional programming preferred
- **Type Safety:** Strict TypeScript with branded types
- **Deterministic Logic:** Same inputs always produce same outputs
- **Separation of Concerns:** Logic/rules/UI/services strictly separated

## Build & Deployment

### Build Configuration
- **Build Command:** `tsc`
- **Type Check:** `tsc --noEmit`
- **Output Directory:** `./dist`
- **Source Maps:** Enabled
- **Declaration Maps:** Enabled

### Quality Checks
- **Check Command:** `turbo format lint check-types test`
- **Format:** Biome check with auto-fix
- **Lint:** Biome lint with auto-fix
- **Test:** Bun test in silent mode (AGENT=1)

## Infrastructure

### Application Hosting
- **Type:** Backend library/engine
- **Usage:** Imported as npm package by frontend applications
- **Deployment:** Published to npm registry or consumed via workspace

### Code Repository
- **URL:** (To be configured)
- **Monorepo Tool:** Bun workspaces with Turbo

### Asset Hosting
- **Type:** N/A (library package, no static assets)

## Configuration Files

### TypeScript Configuration
```json
{
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "strict": false,
  "noEmit": true
}
```

### Biome Configuration
```json
{
  "formatter": "biome",
  "linter": "biome"
}
```

### Turbo Configuration
- **Pipeline:** format → lint → check-types → test

## Future Considerations

### Planned Migrations
- **TypeScript Strict Mode:** Gradual migration from strict: false to strict: true
- **Redux Removal:** Complete migration to @tanstack/store
- **Generic Framework:** Port Lorcana-specific code to generic TCG abstractions

### Potential Additions
- **Performance Monitoring:** Telemetry and metrics collection
- **Documentation Generation:** TypeDoc or similar
- **E2E Testing:** Integration tests for full game scenarios
