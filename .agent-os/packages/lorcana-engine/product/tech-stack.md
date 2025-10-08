# Technical Stack

## Core Technologies

### Runtime & Package Management
- **Runtime:** Bun (Node 22+ compatible)
- **Package Manager:** Bun workspaces
- **Module System:** ESNext with bundler module resolution
- **Monorepo Orchestration:** Turbo Repo with boundaries enforcement

### Language & Type System
- **Language:** TypeScript 5.5+
- **Target:** ES2022
- **Type Checking:** Strict mode enabled
- **Type Strategy:** Branded types for domain IDs (CardId, PlayerId, ZoneId)

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
- **Test Philosophy:** Tests as specifications, no mocking. Instantiate real engine with test data.

## Core Dependencies

### Framework Dependencies
- **`@tcg/core`**: Core TCG engine framework (workspace dependency)
  - Provides: RuleEngine, GameDefinition, move system, zones, cards, flow management
  - Includes: Immer, XState, Zod, nanoid, seedrandom

### Game-Specific Dependencies
- **Minimal Additional Dependencies**: Leverage framework's included libraries
- **Card Data**: Structured TypeScript definitions (no runtime database required for engine)

## Project Structure

### Package Layout
```
packages/lorcana-engine/
├── src/
│   ├── game-definition/
│   │   ├── lorcana-game-definition.ts    # Main GameDefinition
│   │   ├── state-shape.ts                # Lorcana-specific state types
│   │   ├── zones.ts                      # Zone configurations
│   │   ├── flow.ts                       # Turn/phase/step flow
│   │   └── index.ts                      # Exports
│   ├── moves/
│   │   ├── play-card.ts                  # Play card move handler
│   │   ├── quest.ts                      # Quest move handler
│   │   ├── challenge.ts                  # Challenge move handler
│   │   ├── ink-card.ts                   # Ink card move handler
│   │   ├── pass-turn.ts                  # Pass turn move handler
│   │   ├── activate-ability.ts           # Activate ability move handler
│   │   └── index.ts                      # Move registry
│   ├── cards/
│   │   ├── card-definitions/             # Card data by set
│   │   │   ├── set-001/                  # The First Chapter
│   │   │   ├── set-002/                  # Rise of the Floodborn
│   │   │   └── index.ts                  # Card registry
│   │   ├── abilities/                    # Ability definitions
│   │   │   ├── keywords/                 # Keyword abilities
│   │   │   ├── triggered/                # Triggered abilities
│   │   │   ├── activated/                # Activated abilities
│   │   │   └── index.ts                  # Ability registry
│   │   ├── card-types.ts                 # Lorcana card type definitions
│   │   └── index.ts                      # Exports
│   ├── rules/
│   │   ├── validators/                   # Move validation rules
│   │   │   ├── play-card-validator.ts
│   │   │   ├── quest-validator.ts
│   │   │   ├── challenge-validator.ts
│   │   │   └── index.ts
│   │   ├── costs/                        # Cost calculation
│   │   │   ├── play-cost.ts
│   │   │   ├── shift-cost.ts
│   │   │   └── index.ts
│   │   └── effects/                      # Effect resolution
│   │       └── index.ts
│   ├── queries/                          # State queries
│   │   ├── card-queries.ts               # Query cards in zones
│   │   ├── game-queries.ts               # Query game state
│   │   └── index.ts                      # Exports
│   ├── types/                            # Type definitions
│   │   ├── lorcana-state.ts              # Game state types
│   │   ├── lorcana-moves.ts              # Move types
│   │   ├── lorcana-cards.ts              # Card types
│   │   └── index.ts                      # Exports
│   └── index.ts                          # Main entry point
├── package.json
├── tsconfig.json
├── biome.json
├── turbo.json                            # Boundaries configuration
└── README.md
```

## Architecture Patterns

### Design Patterns
- **Immutable State:** All state changes via Immer (inherited from `@tcg/core`)
- **Move-Based Actions:** All gameplay through typed move handlers
- **Declarative Configuration:** Game rules expressed in GameDefinition
- **Query-Based State Access:** Read state through query functions
- **Pure Functions:** Deterministic move handlers and validators
- **Type Safety:** Strict TypeScript with branded types for IDs

### Integration with @tcg/core

```typescript
// 1. Define game-specific state shape
type LorcanaState = GameState & {
  lorcana: {
    lore: Record<PlayerId, number>;
    challengeState?: {
      attacker: CardId;
      defender?: CardId;
    };
  };
};

// 2. Create GameDefinition
const lorcanaGame = createGameDefinition<LorcanaState>({
  id: "lorcana",
  name: "Disney Lorcana",
  players: { min: 2, max: 2 },
  
  // Register moves
  moves: {
    playCard: playCardMove,
    quest: questMove,
    challenge: challengeMove,
    inkCard: inkCardMove,
    passTurn: passTurnMove,
  },
  
  // Configure zones
  zones: lorcanaZones,
  
  // Define flow
  flow: lorcanaFlow,
  
  // Setup function
  setup: setupLorcanaGame,
});

// 3. Use with RuleEngine
const engine = new RuleEngine(lorcanaGame, {
  seed: "game-seed-123",
});
```

## Core Principles

- **Framework-First:** Leverage `@tcg/core` capabilities, don't reinvent
- **Immutable Data:** No state mutations, all changes through framework
- **Deterministic Logic:** Same inputs → same outputs
- **Type Safety:** Strict TypeScript, no `any` types
- **Separation of Concerns:** Game logic separate from presentation
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
- **Boundaries:** Turbo boundaries validation

## Boundaries Configuration

### Enforced Dependencies
```json
{
  "boundaries": {
    "tags": {
      "game-engine": {
        "dependencies": {
          "allow": ["@tcg/core"]
        }
      }
    }
  }
}
```

This ensures `@tcg/lorcana` only depends on `@tcg/core`, preventing:
- Cross-engine dependencies
- Importing from other game implementations
- Coupling to non-framework packages

## Dependencies Philosophy

### Minimal Game-Specific Dependencies
- Rely on framework's included dependencies (Immer, Zod, etc.)
- Only add dependencies for Lorcana-specific needs
- No UI, networking, or platform-specific libraries
- Card data as TypeScript (compile-time), not runtime database

### Framework Integration
- All core mechanics use `@tcg/core` APIs
- No circumventing framework abstractions
- Report gaps/issues to core framework team

## Testing Strategy

### Test Structure
```
src/
├── __tests__/
│   ├── integration/                  # Full game scenarios
│   │   ├── complete-game.test.ts
│   │   ├── challenge-scenarios.test.ts
│   │   └── shift-scenarios.test.ts
│   └── rules/                        # Specific rule tests
│       ├── play-card-rules.test.ts
│       ├── quest-rules.test.ts
│       └── challenge-rules.test.ts
```

### Test Approach
- **Behavior-Driven:** Test through public engine API
- **Scenario-Based:** Test complete game scenarios
- **No Mocking:** Use real engine instances
- **Comprehensive:** Cover all official Lorcana rules
- **Deterministic:** Use seeded RNG for reproducibility

## Future Considerations

### Potential Additions
- **Performance Profiling:** Benchmarking tools for move execution
- **Rule Engine Debugger:** Visual tool for debugging game state
- **Card Definition DSL:** Higher-level abstraction for card abilities
- **AI Support Library:** Helper functions for AI development

