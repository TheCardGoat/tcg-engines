# Technical Stack

## Core Technologies

### Runtime & Package Management
- **Runtime:** Bun (Node 22+ compatible)
- **Package Manager:** Bun workspaces
- **Module System:** ESNext with bundler module resolution
- **Monorepo Orchestration:** Turbo Repo with boundaries enforcement

### Language & Type System
- **Language:** TypeScript 5.8+
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
packages/gundam-engine/
├── src/
│   ├── game-definition.ts        # Main GameDefinition
│   ├── types.ts                  # Gundam-specific state types
│   ├── index.ts                  # Main entry point
│   ├── moves/
│   │   ├── play-resource.ts      # Resource placement move handler
│   │   ├── deploy-unit.ts        # Unit deployment move handler
│   │   ├── pair-pilot.ts         # Pilot pairing move handler
│   │   ├── attack.ts             # Attack sequence move handler
│   │   ├── activate-ability.ts   # Activate ability move handler
│   │   └── index.ts              # Move registry
│   ├── phases/
│   │   ├── start-phase.ts        # Start phase logic
│   │   ├── draw-phase.ts         # Draw phase logic
│   │   ├── resource-phase.ts     # Resource phase logic
│   │   ├── main-phase.ts         # Main phase logic
│   │   ├── end-phase.ts          # End phase logic
│   │   └── index.ts              # Phase registry
│   ├── zones/
│   │   ├── deck-zone.ts          # Deck zone config
│   │   ├── hand-zone.ts          # Hand zone config
│   │   ├── battle-area-zone.ts   # Battle area config
│   │   ├── shield-zone.ts        # Shield area config
│   │   ├── resource-zone.ts      # Resource area config
│   │   ├── trash-zone.ts         # Trash zone config
│   │   └── index.ts              # Zone registry
│   ├── cards/
│   │   ├── card-types.ts         # Card type definitions
│   │   ├── sets/                 # Organized by set
│   │   │   ├── st01/             # Starter Set 01
│   │   │   ├── st02/             # Starter Set 02
│   │   │   └── gd01/             # Booster Set GD01
│   │   ├── tokens/               # Token cards
│   │   │   └── ex-base.ts
│   │   └── index.ts              # Card registry
│   └── __tests__/
│       ├── game-definition.test.ts
│       ├── integration/          # Full game scenarios
│       └── moves/                # Move-specific tests
├── package.json
├── tsconfig.json
├── biome.json
├── turbo.json                    # Boundaries configuration
├── README.md
└── ARCHITECTURE.md
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
type GundamState = GameState & {
  gundam: {
    shields: Record<PlayerId, CardId[]>;
    bases: Record<PlayerId, CardId | null>;
    battlePositions: Record<PlayerId, BattlePosition[]>;
    activeResources: Record<PlayerId, number>;
  };
};

// 2. Create GameDefinition
const gundamGame = createGameDefinition<GundamState>({
  id: "gundam-card-game",
  name: "Gundam Card Game",
  players: { min: 2, max: 2 },
  
  // Register moves
  moves: {
    playResource: playResourceMove,
    deployUnit: deployUnitMove,
    pairPilot: pairPilotMove,
    attack: attackMove,
    activateAbility: activateAbilityMove,
  },
  
  // Configure zones
  zones: gundamZones,
  
  // Define flow
  flow: gundamFlow,
  
  // Setup function
  setup: setupGundamGame,
});

// 3. Use with RuleEngine
const engine = new RuleEngine(gundamGame, {
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

This ensures `@tcg/gundam` only depends on `@tcg/core`, preventing:
- Cross-engine dependencies
- Importing from other game implementations
- Coupling to non-framework packages

## Dependencies Philosophy

### Minimal Game-Specific Dependencies
- Rely on framework's included dependencies (Immer, Zod, etc.)
- Only add dependencies for Gundam-specific needs
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
│   │   ├── combat-scenarios.test.ts
│   │   └── pilot-pairing.test.ts
│   └── moves/                        # Specific move tests
│       ├── deploy-unit.test.ts
│       ├── attack.test.ts
│       └── play-resource.test.ts
```

### Test Approach
- **Behavior-Driven:** Test through public engine API
- **Scenario-Based:** Test complete game scenarios
- **No Mocking:** Use real engine instances
- **Comprehensive:** Cover all official Gundam rules
- **Deterministic:** Use seeded RNG for reproducibility

## Future Considerations

### Potential Additions
- **Performance Profiling:** Benchmarking tools for move execution
- **Rule Engine Debugger:** Visual tool for debugging game state
- **Card Definition DSL:** Higher-level abstraction for card abilities
- **AI Support Library:** Helper functions for AI development

