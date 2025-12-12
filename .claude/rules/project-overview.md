# TCG Engines Project Overview

## Mission

TCG Engines is a production-ready, declarative TypeScript framework for building trading card games (TCGs) and turn-based strategy games. The mission is to become the definitive TypeScript framework for TCG development, empowering developers to focus on game-specific rules rather than infrastructure concerns.

## Target Audience

- **Indie Game Developers** - Building TCGs with focus on game design
- **TCG Platform Builders** - Creating multi-game platforms
- **Game Studio Engineers** - Building commercial TCGs
- **Open Source Contributors** - Interested in game engine architecture
- **Educational Users** - Learning game development or TCG mechanics

## Monorepo Architecture

This project uses **Turborepo** for efficient task orchestration with the following structure:

```
tcg-engines/
├── packages/
│   ├── core/                  # Core framework (@tcg/core)
│   ├── lorcana-engine/        # Disney Lorcana TCG implementation
│   ├── lorcana-cards/         # Lorcana card definitions
│   ├── gundam-engine/         # Gundam Card Game implementation
│   ├── template-engine/       # Template for new game engines
│   ├── component-library/     # Svelte 5 UI components
│   ├── shared/                # Shared utilities
│   └── typescript-config/     # Shared TypeScript configurations
└── agent-os/                  # Documentation and standards
    ├── product/               # Mission, roadmap, tech-stack
    └── standards/             # Coding standards
```

## Package Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    Game Engines                         │
│  (lorcana-engine, gundam-engine, template-engine)       │
└────────────────────┬────────────────────────────────────┘
                     │ depends on
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    @tcg/core                            │
│              (Core Framework)                           │
└────────────────────┬────────────────────────────────────┘
                     │ uses
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Shared & Config Packages                        │
│  (shared, typescript-config, component-library)         │
└─────────────────────────────────────────────────────────┘
```

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Bun** | 1.2.18 | Package manager and runtime |
| **TypeScript** | 5.9+ | Language (strict mode) |
| **Turborepo** | 2.6.3 | Monorepo orchestration |
| **Biome** | 2.0.4 | Linting and formatting |
| **Immer** | 10.0.0+ | Immutable state management |
| **Zod** | 3.22.0+ | Schema validation |
| **seedrandom** | 3.0.5+ | Deterministic RNG |

## Core Framework Features

The `@tcg/core` package provides:

- **Declarative Game Definitions** - Configure rules, zones, and cards
- **Immutable State** - Safe state updates via Immer
- **Deterministic Gameplay** - Seeded RNG for replays
- **Network Sync** - Delta-based state synchronization
- **Time-Travel Debugging** - Undo/redo and history replay
- **Player Views** - Automatic information hiding
- **Zone Management** - Comprehensive zone operations
- **Targeting System** - Complex targeting requirements
- **Testing Utilities** - Complete TDD toolkit

## Documentation References

- **README.md** - Project overview and setup
- **agents.md** - AI agent setup guide
- **agent-os/product/mission.md** - Full mission statement
- **agent-os/product/roadmap.md** - Development phases
- **agent-os/standards/** - Coding standards
- **packages/core/README.md** - Core framework documentation
