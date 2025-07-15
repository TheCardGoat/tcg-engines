# Technology Stack

## Build System & Package Management

- **Monorepo**: Turborepo for build orchestration and caching
- **Package Manager**: Bun 1.2.18 (primary), with Node.js 22.17.0 support
- **Workspaces**: Yarn/npm workspaces for dependency management

## Core Technologies

- **Language**: TypeScript 5.8.3 with strict configuration (no `any`, no type assertions)
- **Runtime**: Bun for development and testing
- **State Management**: 
  - MobX 6.12.0 (legacy lorcana-engine)
  - @tanstack/store 0.7.0 (core-engine)
  - XState 5.19.2 for state machines
- **Testing**: Bun test runner, Jest for legacy packages

## Code Quality & Formatting

- **Linter/Formatter**: Biome 2.0.4 (replaces ESLint/Prettier)
- **Git Hooks**: Lefthook for pre-commit formatting
- **Configuration**: Shared TypeScript configs via workspace packages

## AI Assistant Integration

- **Cursor IDE**: Configured with specialized prompts for Lorcana card testing and implementation
- **Claude AI**: Specific development guidelines in `CLAUDE.md` for core-engine package
- **Automated Workflows**: 
  - Card ability implementation with semantic similarity matching
  - Test case generation for Lorcana cards
  - Lint and type error resolution

## Common Commands

```bash
# Development
bun install              # Install dependencies
bun run dev             # Run individual projects
bun run build           # Build all packages
bun run test            # Run all tests
bun run ci-check        # Full CI pipeline

# Code Quality
bun run format          # Format code with Biome
bun run lint            # Lint code with Biome  
bun run check-types     # TypeScript type checking

# Turbo Commands
turbo run build         # Cached parallel builds
turbo run test --filter=@lorcanito/core-engine  # Run specific package tests
```

## Development Workflow

- Pre-commit hooks automatically format staged files
- Turbo caching for faster builds and tests
- Workspace dependencies use `workspace:*` protocol
- All packages follow consistent script naming conventions