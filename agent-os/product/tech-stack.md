# @tcg/core - Technical Stack

## Overview

This document outlines the complete technical stack used in the @tcg/core framework, including core dependencies, development tools, testing infrastructure, and architectural patterns.

---

## Core Technology Stack

### Primary Language
- **TypeScript 5.8.3**
  - Strict mode enabled
  - Advanced type features (branded types, conditional types)
  - Full IntelliSense support
  - Type-driven development

### Runtime Environment
- **Bun 1.2.14+**
  - Fast JavaScript runtime
  - Built-in test runner
  - Native TypeScript support
  - Optimized performance
  - Alternative: Node.js 18+ (compatible)

---

## Core Dependencies

### State Management
**Immer 10.0.0+**
- Immutable state updates with mutable-style syntax
- Structural sharing for performance
- Automatic patch generation for network sync
- Time-travel debugging support
- Why: Enables elegant immutable patterns without boilerplate

```typescript
// Example usage in @tcg/core
import { produce } from 'immer';

const newState = produce(state, (draft) => {
  draft.players[playerId].hand.push(cardId);
});
```

### Validation & Schema
**Zod 3.22.0+**
- Runtime type validation
- Schema definition and validation
- Type inference from schemas
- Error reporting
- Why: Ensures data integrity at runtime, complements TypeScript

```typescript
// Example usage
import { z } from 'zod';

const PlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  deck: z.array(z.string()),
});
```

### Random Number Generation
**seedrandom 3.0.5+**
- Deterministic pseudo-random number generation
- Seeded RNG for replay capability
- Multiple PRNG algorithms
- Why: Critical for deterministic gameplay and testing

```typescript
// Example usage
import seedrandom from 'seedrandom';

const rng = seedrandom('fixed-seed');
const randomValue = rng(); // Deterministic output
```

### Unique Identifiers
**nanoid 5.0.0+**
- Fast, small unique ID generator
- URL-safe IDs
- Collision-resistant
- Why: Efficient ID generation for cards, games, players

```typescript
// Example usage
import { nanoid } from 'nanoid';

const cardId = nanoid(); // e.g., "V1StGXR8_Z5jdHi6B-myT"
```

---

## Development Dependencies

### Build & Compilation
**TypeScript Compiler (tsc) 5.8.3**
- Type checking
- Declaration file generation
- Source maps
- Why: Core TypeScript compilation

### Code Quality

**oxlint 1.46.0 + oxfmt**
- Fast linting via oxlint (10-100x faster than ESLint)
- Formatting via oxfmt (Prettier-compatible)
- Replaces ESLint + Biome + Prettier
- Consistent code style
- Import sorting
- Why: Modern, fast, zero-config code quality tool

```json
// .oxlintrc.json configuration
{
  "categories": {
    "correctness": "warn",
    "suspicious": "warn",
    "perf": "warn",
    "style": "warn"
  },
  "plugins": ["typescript", "react", "unicorn", "jsx-a11y"]
}
```

```json
// .oxfmt.json configuration
{
  "plugins": ["prettier"],
  "prettier": {
    "quoteProps": "preserve",
    "singleQuote": false,
    "trailingComma": "es5",
    "semi": true,
    "tabWidth": 2,
    "useTabs": false
  }
}
```

### Testing

**Bun Test**
- Built-in test runner
- Fast execution
- Jest-compatible API
- Native TypeScript support
- Coverage reporting
- Why: Integrated with runtime, extremely fast

```typescript
// Example test
import { describe, it, expect } from 'bun:test';

describe('RuleEngine', () => {
  it('executes valid moves', () => {
    expect(result.success).toBe(true);
  });
});
```

---

## Architectural Patterns

### Design Patterns

**1. Immutable State Pattern**
- All state updates create new state objects
- Powered by Immer for performance
- Enables time-travel and undo/redo

**2. Command Pattern (Moves)**
- Moves encapsulate state changes
- Validation and execution separation
- Replayable and testable

**3. Repository Pattern (Game Definition)**
- Central game configuration
- Separation of concerns
- Declarative over imperative

**4. Observer Pattern (Flow System)**
- Event-driven phase transitions
- Hook system for lifecycle events
- Reactive state updates

**5. Strategy Pattern (Move System)**
- Pluggable move implementations
- Runtime move registration
- Flexible validation strategies

**6. Builder Pattern (Card Queries)**
- Fluent API for queries
- Composable filter conditions
- Type-safe construction

---

## Type System Patterns

### Branded Types
Enhanced type safety using branded types:

```typescript
type PlayerId = string & { readonly __brand: 'PlayerId' };
type CardId = string & { readonly __brand: 'CardId' };
type ZoneId = string & { readonly __brand: 'ZoneId' };
type GameId = string & { readonly __brand: 'GameId' };

// Constructor functions ensure type safety
export const createPlayerId = (id: string): PlayerId => id as PlayerId;
```

### Discriminated Unions
Type-safe move and event handling:

```typescript
type Move =
  | { type: 'playCard'; cardId: CardId }
  | { type: 'attack'; attackerId: CardId; targetId: CardId }
  | { type: 'endTurn' };
```

### Conditional Types
Advanced type inference:

```typescript
type MoveParams<T extends Move> = T extends { type: infer U }
  ? Extract<Move, { type: U }>
  : never;
```

---

## Infrastructure

### Monorepo Management
**Turborepo**
- Task orchestration
- Caching and parallelization
- Dependency graph management
- Why: Efficient monorepo builds

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "cache": false
    }
  }
}
```

### Package Manager
**Bun Package Manager**
- Fast dependency installation
- Workspace support
- Lockfile for reproducibility
- Alternative: pnpm (workspace-aware)

### Version Control
**Git**
- Conventional commits
- Semantic versioning
- Protected main branch

---

## Network & Synchronization

### State Synchronization
**Immer Patches**
- Delta-based state sync
- Efficient network transmission
- Bidirectional patching
- Why: Minimal data over the wire

```typescript
// Generate patches
const [newState, patches, inversePatches] = produceWithPatches(
  state,
  (draft) => {
    // mutations
  }
);

// Apply patches
const updatedState = applyPatches(state, patches);
```

### Serialization
**Native JSON**
- Game state serialization
- Patch serialization
- Move history serialization
- Why: Universal format, no dependencies

---

## Testing Stack

### Test Framework
- **Bun Test** - Primary test runner
- **Jest-compatible API** - Familiar syntax
- **Coverage** - Built-in coverage reports

### Testing Patterns
- **Behavior-Driven Testing** - Test observable behavior
- **Test-Driven Development** - Write tests first
- **Real Engine Instances** - Integration tests with actual engine
- **Property-Based Testing** - Fuzzing move validation (future)

### Test Utilities
```typescript
// Custom test helpers
export const createTestEngine = (options?: Partial<EngineOptions>) => {
  return new RuleEngine(gameDefinition, players, {
    seed: 'test-seed',
    ...options,
  });
};
```

---

## Documentation Stack

### Documentation Format
- **Markdown** - All documentation
- **JSDoc** - Inline code documentation
- **TypeScript Declarations** - Type documentation

### Documentation Tools
- **GitHub Pages** (planned) - Hosted documentation
- **Docusaurus** (future) - Documentation site
- **TypeDoc** (future) - API reference generation

---

## Deployment & Distribution

### Package Distribution
- **NPM Registry** - Package distribution
- **Workspace Protocol** - Internal dependencies
- **Semantic Versioning** - Version management

### Build Outputs
- **ESM** - Modern module format
- **Type Declarations** - `.d.ts` files
- **Source Maps** - Debugging support

### Bundle Strategy
- Tree-shakeable exports
- Minimal bundle size
- No bundled dependencies
- Type-only imports separated

---

## Development Environment

### Recommended IDE
**Visual Studio Code**
- TypeScript language service
- oxlint extension
- Git integration
- Terminal integration

### VSCode Extensions (Recommended)
- oxlint (code quality)
- Prettier - Code formatter (oxfmt uses Prettier plugin)
- TypeScript and JavaScript Language Features
- GitLens (Git integration)
- Better Comments
- Error Lens

### VSCode Settings
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.esbenp.prettier-vscode": "explicit",
    "source.organizeImports": "explicit"
  }
}
```

---

## Performance Optimization

### Strategies
1. **Structural Sharing** - Immer reuses unchanged objects
2. **Lazy Evaluation** - Compute on demand
3. **Memoization** - Cache expensive computations
4. **Tree Shaking** - Remove unused code
5. **Code Splitting** - Separate optional features

### Monitoring
- Bundle size tracking
- Performance benchmarks
- Memory profiling (planned)

---

## Security Considerations

### Current Security Measures
- No eval() or dynamic code execution
- Validated input via Zod schemas
- Immutable state prevents tampering
- Branded types prevent ID confusion

### Planned Security Features
- Move validation on server
- Cryptographic state signing
- Replay verification
- Rate limiting primitives

---

## Future Technology Additions

### Planned Additions (Phase 2+)
- **XState** - State machine for complex flows
- **Socket.io** - WebSocket transport
- **Redis** - Distributed state storage
- **PostgreSQL** - Persistence layer
- **React** - UI integration library
- **Vue** - Alternative UI integration

### Under Consideration
- **GraphQL** - API layer
- **Protobuf** - Binary serialization
- **WASM** - Performance-critical paths
- **Web Workers** - Parallel computation

---

## Technology Decision Criteria

When evaluating new dependencies:

### Must Have
- ✅ TypeScript support (or types available)
- ✅ Active maintenance
- ✅ Stable API
- ✅ Small bundle size
- ✅ Zero or minimal dependencies

### Nice to Have
- Tree-shakeable
- Well documented
- Large community
- Battle-tested
- Performance focused

### Deal Breakers
- ❌ Frequent breaking changes
- ❌ Abandoned projects
- ❌ Large bundle size without justification
- ❌ Poor TypeScript support
- ❌ Security vulnerabilities

---

## Migration & Compatibility

### Supported Environments
- **Browser**: All modern browsers (ES2020+)
- **Node.js**: 18+ (with ESM support)
- **Bun**: 1.2.14+
- **Deno**: Compatible (experimental)

### Polyfills
None required for target environments

### Backward Compatibility
- Semantic versioning
- Deprecation warnings
- Migration guides
- Codemods (planned)

---

## Contribution Tech Requirements

To contribute to @tcg/core:

### Required
- Bun 1.2.14+ (or Node.js 18+)
- TypeScript 5.8.3
- Git
- Text editor (VSCode recommended)

### Optional
- oxlint extension (VS Code)
- GitHub CLI (`gh`)
- Turbo CLI (global install)

---

## Tech Stack Evolution

### Historical Changes
- **v0.1.0**: Initial stack establishment

### Planned Changes
- **v0.2.0**: Add XState for flow management
- **v0.3.0**: Add React integration
- **v1.0.0**: Stabilize core tech stack
- **v2.0.0**: Consider new serialization formats

---

## References

### Official Documentation
- [TypeScript](https://www.typescriptlang.org/)
- [Immer](https://immerjs.github.io/immer/)
- [Bun](https://bun.sh/)
- [Zod](https://zod.dev/)
- [oxlint](https://oxc.rs/)
- [oxfmt](https://oxc.rs/)

### Community Resources
- GitHub Repository: [tcg-engines](https://github.com/the-card-goat/tcg-engines)
- Discord: (planned)
- Twitter: (planned)

---

**Last Updated**: 2025-10-09
**Tech Stack Version**: 1.0
**Framework Version**: 0.1.0
