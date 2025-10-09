# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/lorcana-engine/specs/2025-10-08-lorcana-engine-setup/spec.md

## Technical Requirements

### Package Configuration

**package.json**:
- Name: `@tcg/lorcana`
- Version: `0.1.0`
- Main exports: `./src/index.ts`
- Dependencies: `@tcg/core` (workspace dependency)
- Dev dependencies: `@biomejs/biome`, `@types/bun`, `typescript`
- Scripts: `build`, `typecheck`, `format`, `lint`, `test`, `check`

**tsconfig.json**:
- Extend: `../typescript-config/base.json`
- Strict mode: enabled
- Target: ES2022
- Module resolution: bundler
- Output: `./dist`
- Source maps: enabled
- Declaration maps: enabled

**biome.json**:
- Formatter: Biome with 2-space indentation
- Linter: Biome with recommended rules
- Quote style: double quotes
- VCS integration: Git

**turbo.json**:
- Extends: Root turbo config
- Tags: `game-engine`
- Boundaries: Allow only `@tcg/core` dependency

### Folder Structure

**Required directories** (all under `src/`):
- `game-definition/` - Game definition, state shape, zones, flow, setup
- `moves/` - Move handlers and validators
- `cards/` - Card definitions, abilities, card types
- `types/` - TypeScript type definitions
- `queries/` - State query functions
- `rules/` - Rule implementations (validators, costs, effects)

**Documentation requirements**:
- Each directory contains `README.md` explaining:
  - Purpose and responsibility
  - File organization
  - Integration patterns with `@tcg/core`
  - Code examples
  - References to related documentation

### Core Framework Documentation

**ENGINE_INTEGRATION.md** (in `@tcg/core` package):

Required sections:
1. **Overview** - Framework capabilities and extension points
2. **Package Setup** - Directory structure, configuration, boundaries
3. **Game Definition** - Creating GameDefinition, registering components
4. **State Shape Design** - Extending GameState with game-specific data
5. **Zone Configuration** - Defining zones and their properties
6. **Move System** - Move structure, validation, execution patterns
7. **Flow Definition** - Turn/phase/step orchestration with XState
8. **Card System** - Card definitions vs instances, card types
9. **Ability System** - Keyword, triggered, activated, static abilities
10. **Testing Strategy** - Behavior-driven testing patterns
11. **Best Practices** - Type safety, pure functions, queries, determinism

Each section includes:
- Conceptual explanation
- Code examples from `@tcg/lorcana`
- Type definitions
- Common patterns
- Anti-patterns to avoid

### Agent OS Documentation

**.agent-os/packages/lorcana-engine/product/**:

**mission-lite.md**:
- Single paragraph summary
- Package purpose as reference implementation
- Dual role: production engine + framework validator

**mission.md**:
- Comprehensive package mission
- Primary goals: validate framework, implement Lorcana rules, type-safe definition, card library
- Secondary goals: documentation by example, performance benchmarking, AI integration
- Success criteria and non-goals
- Target users

**tech-stack.md**:
- Runtime: Bun
- Language: TypeScript 5.5+ strict mode
- Development tools: Biome, Bun test
- Dependencies: `@tcg/core` only
- Project structure with detailed folder layout
- Architecture patterns
- Integration patterns with core framework
- Build and deployment configuration
- Boundaries enforcement strategy
- Testing approach

**roadmap.md**:
- Phase 1: Foundation (current) - scaffolding
- Phase 2: Core Game Mechanics - turn cycle, basic moves
- Phase 3: Card System - card types, properties, basic abilities
- Phase 4: Advanced Abilities - triggered, activated, static
- Phase 5: Complete Card Sets - all released sets
- Phase 6: Advanced Features - locations, shift, complex interactions
- Phase 7: Optimization & Polish - production readiness

### Entry Point

**src/index.ts**:
- Re-export core framework types for convenience
- Export game definition (commented out initially)
- Export moves (commented out initially)
- Export cards (commented out initially)
- Export types (commented out initially)
- Export queries (commented out initially)
- JSDoc documentation

**src/index.d.ts**:
- Type declarations
- Re-export from `./index`

### README.md

**Package README** (in `packages/lorcana-engine/`):
- Overview and purpose
- Status badge (work in progress)
- Installation instructions
- Development scripts
- Project structure overview
- Architecture integration points
- Usage example (basic engine setup)
- Dependencies list
- Boundaries explanation
- Testing approach
- Links to documentation
- Contributing guidelines
- License

### Build Validation

**Type checking**:
- All TypeScript compiles without errors
- Strict mode violations caught
- No `any` types in production code

**Linting**:
- Biome rules pass
- No unused imports or variables
- Code style consistent

**Boundaries**:
- Turbo boundaries command succeeds
- Only `@tcg/core` in dependencies
- No cross-engine imports

## External Dependencies

None beyond what's provided by `@tcg/core`.

**Justification**: The `@tcg/core` framework includes all necessary dependencies (Immer, Zod, nanoid, seedrandom, XState). Adding external dependencies at this stage would be premature before implementing actual game logic.

## Architecture Decisions

**1. Boundaries Enforcement**:
- Use Turborepo boundaries to prevent coupling
- Ensures `@tcg/lorcana` remains isolated
- Validates framework provides sufficient APIs
- Catches dependency violations at build time

**2. Documentation-First Approach**:
- Create comprehensive integration guide before implementation
- Forces clear thinking about framework APIs
- Serves as contract for what framework must provide
- Reduces implementation friction later

**3. Folder Structure Mirrors Concerns**:
- Separate game-definition, moves, cards, types, queries, rules
- Each directory has single clear responsibility
- Follows framework's separation of concerns
- Makes codebase navigable for new developers

**4. README in Every Directory**:
- Explains purpose and patterns
- Reduces cognitive load
- Serves as inline documentation
- Examples show best practices

**5. No Implementation Yet**:
- Validate structure before coding
- Ensure framework is suitable
- Get feedback on organization
- Avoid premature implementation decisions

**6. Reference Implementation Role**:
- Dual purpose: production + reference
- Validates framework design
- Guides future implementations
- Identifies framework gaps early

## Implementation Notes

### Package Creation Order

1. Create Agent OS structure first (mission, tech-stack, roadmap)
2. Create package configuration files (package.json, tsconfig, biome, turbo)
3. Create folder structure with READMEs
4. Create ENGINE_INTEGRATION.md in core package
5. Create formal spec documents
6. Validate all configurations work

### Verification Steps

After implementation:
1. Run `bun install` from root
2. Run `cd packages/lorcana-engine && bun run check-types`
3. Run `turbo boundaries` from root
4. Verify all README files are informative
5. Verify ENGINE_INTEGRATION.md is comprehensive
6. Check that package follows monorepo conventions

### Success Criteria

- Package appears in workspace packages
- TypeScript compilation succeeds
- Boundaries validation passes
- All documentation is complete and clear
- Structure is ready for game logic implementation

## References

- Turborepo Boundaries: https://turborepo.com/docs/reference/boundaries
- `@tcg/core` package structure
- `packages/engines/core-engine` for Lorcana rules reference (legacy implementation)
- TypeScript strict mode documentation
- Biome configuration guide

