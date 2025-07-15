# Project Structure

## Monorepo Organization

```
TheCardGoat/
├── packages/
│   ├── engines/
│   │   └── core-engine/          # Main TCG framework (active development)
│   ├── lorcana-engine/            # Legacy Lorcana implementation (deprecated)
│   ├── shared/                    # Common utilities and types
│   └── typescript-config/         # Shared TypeScript configurations
├── .kiro/                         # Kiro AI assistant configuration
└── [root config files]
```

## Package Conventions

### Naming
- Scoped packages: `@lorcanito/package-name`
- Private packages marked with `"private": true`
- Workspace dependencies use `workspace:*` protocol

### Structure Standards
```
package/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── types/             # Type definitions
│   ├── lib/               # Core library code
│   └── [feature-folders]/ # Feature-specific modules
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
└── biome.json             # Code quality configuration
```

### Export Patterns
- Main export: `"."` points to `./src/index.ts`
- Subpath exports for internal modules (e.g., `"./abilities"`, `"./types"`)
- TypeScript source files exported directly (no build step for internal packages)

## Key Directories

### `/packages/engines/core-engine/`
- **Purpose**: Framework-agnostic TCG engine
- **Status**: Active development
- **Architecture**: Immutable state, event-driven, server-authoritative
- **Key Files**: 
  - `src/index.ts` - Main engine exports
  - `src/lobby.ts` - Multiplayer lobby system
  - `ARCHITECTURE.md` - Detailed technical documentation

### `/packages/lorcana-engine/` 
- **Purpose**: Legacy Disney Lorcana implementation
- **Status**: Deprecated - do not use for new projects
- **Migration**: Use core-engine for new Lorcana features

### `/packages/shared/`
- **Purpose**: Common utilities, types, and logging
- **Exports**: Utilities, type definitions, logging infrastructure
- **Dependencies**: Minimal - only essential shared code

### `/packages/typescript-config/`
- **Purpose**: Shared TypeScript configurations
- **Configs**: `base.json`, `library.json`, `nextjs.json`, `node.json`, `react.json`, `strict.json`

## AI Assistant Configuration

### `.cursor/` Directory
- **Prompts**: Specialized workflows for card implementation, testing, and error fixing
- **Rules**: Code quality standards for TypeScript, React, Next.js, Tailwind, and clean code
- **Integration**: Automated card ability generation and test case creation

### AI-Specific Files
- `packages/engines/core-engine/CLAUDE.md` - Comprehensive development guidelines for Claude AI
- `packages/engines/core-engine/IMPLEMENTATION-LOGS.md` - Task progress tracking
- Various `llm-full.txt` files - Library-specific documentation for AI reference

## Development Guidelines

- New TCG implementations should extend `/packages/engines/core-engine/`
- Avoid adding dependencies to `/packages/lorcana-engine/` (legacy)
- Shared utilities go in `/packages/shared/`
- Each package maintains its own `biome.json` for code quality rules
- Use workspace references for internal dependencies
- Follow TDD methodology - no production code without failing tests
- Update implementation logs for significant changes
- Run `bun run check` before considering tasks complete