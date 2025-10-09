# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/core/specs/2025-10-09-core-reuse-consolidation/spec.md

## Technical Requirements

### 1. Zone Operations Consolidation

**Current State Analysis:**
- **Core** (`packages/core/src/zones/zone-operations.ts`): Uses Zone objects with config, implements operations like `addCard`, `removeCard`, `moveCard`, `shuffle`, `draw`, `mill`, `search`, `peek`
- **Lorcana** (`packages/lorcana-engine/src/game-definition/zone-operations.ts`): Uses simple `Record<PlayerId, CardId[]>` structure, implements `createZoneState`, `addCardToZone`, `removeCardFromZone`, `moveCardBetweenZones`, `isCardInZone`, `getCardsInZone`, `getZoneSize`, `getTopCard`, `clearZone`, `addCardToTop`, `addCardToBottom`
- **Gundam**: Currently minimal, will need zone operations

**Problem:** Two different APIs for same functionality. Core's Zone object approach is more sophisticated but lorcana's flat structure is simpler. Need to unify.

**Solution:**
1. Keep core's Zone-based API as primary (more flexible, supports zone configuration)
2. Provide convenience functions for simple use cases (flat state structure)
3. Add missing operations to core that lorcana has (addCardToTop, addCardToBottom, clearZone, isCardInZone)
4. Migrate lorcana to use core zone operations
5. Document when to use Zone objects vs flat structures

**Implementation:**
- Extend `packages/core/src/zones/zone-operations.ts` with:
  - `isCardInZone(zone: Zone, cardId: CardId): boolean`
  - `addCardToTop(zone: Zone, cardId: CardId): Zone`
  - `addCardToBottom(zone: Zone, cardId: CardId): Zone`
  - `clearZone(zone: Zone): Zone`
  - `findCardInZones(cardId: CardId, zones: Zone[]): Zone | undefined`
  
- Create `packages/core/src/zones/zone-state-helpers.ts` for flat state patterns:
  - `createZoneState(players: PlayerId[]): Record<PlayerId, CardId[]>`
  - `moveCardInState(state: Record<PlayerId, CardId[]>, playerId: PlayerId, cardId: CardId, fromZone: string, toZone: string)`
  
- Add comprehensive tests for all operations
- Create migration guide for lorcana-engine

**Success Criteria:**
- Core zone operations cover 100% of lorcana's use cases
- Lorcana migrated to use core zone operations exclusively
- Gundam uses core zone operations from the start
- All operations have >95% test coverage

---

### 2. Testing Utilities Package

**Current State Analysis:**
- Core has excellent integration tests with reusable patterns:
  - `coin-flip-game.test.ts`: Simple game with flow, moves, win conditions
  - `integration-complete-game.test.ts`: Complex game with phases, card management
  - `integration-network-sync.test.ts`: Multiplayer sync patterns
- Pattern analysis shows common test setup code:
  - Creating test game state
  - Creating test game definitions
  - Creating test players
  - Executing moves and asserting outcomes
  - Testing flow transitions
- Neither gundam nor lorcana can reuse these patterns

**Problem:** Each game engine must write test boilerplate from scratch. Core's excellent test patterns are buried in test files.

**Solution:**
Create `@tcg/core/testing` export with reusable test utilities extracted from integration tests.

**Implementation:**

Create `packages/core/src/testing/index.ts`:
```typescript
// Test Game Builders
export { createTestEngine } from "./test-engine-builder";
export { createTestGameDefinition } from "./test-game-builder";
export { createTestPlayers } from "./test-player-builder";
export { createTestState } from "./test-state-builder";

// Test Execution Helpers
export { executeTestMove } from "./test-move-executor";
export { expectMoveSuccess, expectMoveFailure } from "./test-assertions";
export { expectPhaseTransition } from "./test-flow-assertions";
export { expectGameEnd } from "./test-end-assertions";

// Test Data Factories
export { createTestCard } from "./test-card-factory";
export { createTestZone } from "./test-zone-factory";
export { createTestPlayer } from "./test-player-factory";

// Snapshot Helpers
export { captureGameState } from "./test-snapshot";
export { assertStateUnchanged } from "./test-snapshot-assertions";

// Deterministic Testing
export { withSeed } from "./test-rng-helpers";
export { expectDeterministicReplay } from "./test-replay-assertions";
```

**Test Builder Pattern:**
```typescript
// Example usage in game engine tests
import { createTestEngine, createTestPlayers, expectMoveSuccess } from "@tcg/core/testing";

describe("Quest Move", () => {
  it("gains lore equal to card's lore value", () => {
    const players = createTestPlayers(2);
    const engine = createTestEngine(lorcanaGameDefinition, players, {
      seed: "test-quest-1"
    });
    
    // Setup
    const characterId = addCharacterToPlay(engine, players[0], { lore: 2 });
    
    // Execute
    const result = engine.executeMove("quest", {
      playerId: players[0].id,
      data: { characterId }
    });
    
    // Assert
    expectMoveSuccess(result);
    expect(engine.getState().lorcana.lore[players[0].id]).toBe(2);
  });
});
```

**Files to Create:**
- `packages/core/src/testing/test-engine-builder.ts`
- `packages/core/src/testing/test-game-builder.ts`
- `packages/core/src/testing/test-player-builder.ts`
- `packages/core/src/testing/test-state-builder.ts`
- `packages/core/src/testing/test-move-executor.ts`
- `packages/core/src/testing/test-assertions.ts`
- `packages/core/src/testing/test-flow-assertions.ts`
- `packages/core/src/testing/test-card-factory.ts`
- `packages/core/src/testing/test-rng-helpers.ts`
- `packages/core/src/testing/index.ts`

**Export Configuration:**
Update `packages/core/package.json`:
```json
{
  "exports": {
    ".": "./src/index.ts",
    "./testing": "./src/testing/index.ts"
  }
}
```

**Success Criteria:**
- Testing utilities reduce game engine test boilerplate by >60%
- Both gundam and lorcana use testing utilities
- Testing utilities have their own comprehensive test suite
- Documentation includes testing best practices guide

---

### 3. Card Tooling Foundation

**Current State Analysis:**
- Gundam has sophisticated card management tools:
  - `tools/scraper/card-scraper.ts`: Web scraping from official card database
  - `tools/parser/text-parser.ts`: Parses card text into structured abilities (keywords, triggers, effects)
  - `tools/generator/card-generator.ts`: Generates TypeScript card definition files
  - `tools/generator/file-writer.ts`: Manages file creation with proper formatting
- These are game-specific but have reusable infrastructure patterns
- Lorcana will need similar tooling but would duplicate work

**Problem:** Card management infrastructure (file generation, code formatting, directory management) is game-specific when it should be reusable.

**Solution:**
Create `@tcg/core/tooling` package with base infrastructure that games extend with their specific parsers.

**Implementation:**

Create `packages/core/src/tooling/index.ts`:
```typescript
// Base Classes
export { CardParser } from "./card-parser";
export { CardGenerator } from "./card-generator";
export { FileWriter } from "./file-writer";
export { CardValidator } from "./card-validator";

// Utilities
export { formatTypeScript } from "./format-utils";
export { createDirectory, ensureDirectory } from "./file-utils";
export { generateVariableName, toKebabCase, toPascalCase } from "./naming-utils";

// Types
export type { ParserResult, ParserWarning } from "./types";
export type { GeneratorOptions, FileTemplate } from "./types";
```

**Base Card Parser Pattern:**
```typescript
// In core
export abstract class CardParser<TInput, TOutput> {
  abstract parse(input: TInput): ParserResult<TOutput>;
  
  protected addWarning(warning: string): void {
    this.warnings.push(warning);
  }
  
  protected createResult(data: TOutput): ParserResult<TOutput> {
    return {
      data,
      warnings: this.warnings,
      success: this.warnings.length === 0
    };
  }
}

// In gundam-engine
export class GundamCardTextParser extends CardParser<string, ParsedAbility[]> {
  parse(text: string): ParserResult<ParsedAbility[]> {
    // Gundam-specific parsing with 【Deploy】, <Repair>, etc.
    return this.createResult(abilities);
  }
}
```

**Base Card Generator Pattern:**
```typescript
// In core
export abstract class CardGenerator<TCard> {
  abstract generateFile(card: TCard): string;
  
  protected formatObject(obj: unknown, indent: number): string {
    // Shared TypeScript object formatting logic
  }
  
  protected generateImports(types: string[]): string {
    // Shared import generation
  }
}

// In gundam-engine
export class GundamCardGenerator extends CardGenerator<CardDefinition> {
  generateFile(card: CardDefinition): string {
    const variableName = this.generateVariableName(card.name);
    const imports = this.generateImports([this.getTypeImportName(card.cardType)]);
    const definition = this.formatObject(card, 0);
    return `${imports}\nexport const ${variableName} = ${definition};\n`;
  }
}
```

**File Writer Utilities:**
```typescript
// In core - completely reusable
export class FileWriter {
  constructor(private baseDir: string) {}
  
  async write(filepath: string, content: string): Promise<void> {
    await ensureDirectory(dirname(filepath));
    await writeFile(filepath, content, "utf-8");
  }
  
  async writeFormatted(filepath: string, content: string): Promise<void> {
    const formatted = await formatTypeScript(content);
    await this.write(filepath, formatted);
  }
}
```

**Validation Infrastructure:**
```typescript
// In core
export abstract class CardValidator<TCard> {
  abstract validate(card: TCard): ValidationResult;
  
  protected validateRequired(field: string, value: unknown): void {
    if (!value) {
      this.errors.push(`Missing required field: ${field}`);
    }
  }
  
  protected validateType(field: string, value: unknown, expectedType: string): void {
    if (typeof value !== expectedType) {
      this.errors.push(`Invalid type for ${field}: expected ${expectedType}`);
    }
  }
}
```

**Files to Create:**
- `packages/core/src/tooling/card-parser.ts`
- `packages/core/src/tooling/card-generator.ts`
- `packages/core/src/tooling/file-writer.ts`
- `packages/core/src/tooling/card-validator.ts`
- `packages/core/src/tooling/format-utils.ts`
- `packages/core/src/tooling/file-utils.ts`
- `packages/core/src/tooling/naming-utils.ts`
- `packages/core/src/tooling/types.ts`
- `packages/core/src/tooling/index.ts`

**Migration Path:**
1. Extract infrastructure from gundam tools into core
2. Refactor gundam tools to extend core base classes
3. Document how to create game-specific card tools
4. Lorcana can use same infrastructure when adding card management

**Success Criteria:**
- Gundam tools use core tooling infrastructure (FileWriter, naming utils, formatting)
- Gundam-specific logic clearly separated into parser extensions
- Core tooling has >90% test coverage
- Documentation shows how to build game-specific card tools

---

### 4. Common Type Guards & Validators

**Current State Analysis:**
- Core has `validateGameDefinition` in `packages/core/src/game-definition/validation.ts`
- Uses Zod for schema validation
- Gundam has type guards for card types (`isUnitCard`, `isPilotCard`, etc.)
- These patterns should be reusable across games

**Problem:** Type guards and validators are ad-hoc, not following consistent patterns.

**Solution:**
Provide validator builders and type guard utilities in core.

**Implementation:**

Create `packages/core/src/validation/index.ts`:
```typescript
// Validator Builders
export { createCardValidator } from "./card-validator-builder";
export { createMoveValidator } from "./move-validator-builder";
export { createStateValidator } from "./state-validator-builder";

// Type Guard Utilities
export { createTypeGuard } from "./type-guard-builder";
export { isCardOfType } from "./card-type-guards";

// Schema Builders
export { buildCardSchema } from "./schema-builders";
export { buildMoveSchema } from "./schema-builders";
```

**Type Guard Builder Pattern:**
```typescript
// In core
export function createTypeGuard<T, K extends keyof T>(
  typeField: K,
  expectedValue: T[K]
): (obj: T) => boolean {
  return (obj: T): boolean => obj[typeField] === expectedValue;
}

// In gundam
export const isUnitCard = createTypeGuard<CardDefinition, "cardType">(
  "cardType",
  "UNIT"
);
```

**Validator Builder Pattern:**
```typescript
// In core
export class ValidatorBuilder<T> {
  private rules: Array<(obj: T) => ValidationError | null> = [];
  
  required(field: keyof T): this {
    this.rules.push((obj) => 
      obj[field] ? null : { field, message: "Required field missing" }
    );
    return this;
  }
  
  type(field: keyof T, expectedType: string): this {
    this.rules.push((obj) => 
      typeof obj[field] === expectedType 
        ? null 
        : { field, message: `Expected ${expectedType}` }
    );
    return this;
  }
  
  build(): (obj: T) => ValidationResult {
    return (obj: T) => {
      const errors = this.rules
        .map(rule => rule(obj))
        .filter((e): e is ValidationError => e !== null);
      return { valid: errors.length === 0, errors };
    };
  }
}

// In gundam
const validateUnitCard = new ValidatorBuilder<UnitCardDefinition>()
  .required("id")
  .required("name")
  .required("ap")
  .required("hp")
  .type("ap", "number")
  .type("hp", "number")
  .build();
```

**Files to Create:**
- `packages/core/src/validation/type-guard-builder.ts`
- `packages/core/src/validation/card-type-guards.ts`
- `packages/core/src/validation/validator-builder.ts`
- `packages/core/src/validation/schema-builders.ts`
- `packages/core/src/validation/index.ts`

**Success Criteria:**
- Game engines use core validator builders consistently
- Type guards follow single pattern
- Runtime validation reduces bugs
- Performance impact <5% for validator checks

---

### 5. Documentation & Examples

**Implementation:**

Create documentation structure:
- `packages/core/docs/guides/zone-operations.md` - Comprehensive zone API guide
- `packages/core/docs/guides/testing-utilities.md` - Testing patterns and best practices
- `packages/core/docs/guides/card-tooling.md` - Building card management tools
- `packages/core/docs/guides/validation.md` - Type guards and validators guide
- `packages/core/docs/examples/zone-management.ts` - Zone operation examples
- `packages/core/docs/examples/test-patterns.ts` - Testing pattern examples
- `packages/core/docs/examples/card-parser-extension.ts` - Custom parser example

Update `packages/core/README.md`:
- Add sections for each new utility package
- Link to detailed guides
- Show before/after code examples

Create migration guides:
- `packages/lorcana-engine/docs/migration-to-core-zones.md`
- `packages/gundam-engine/docs/migration-to-core-tooling.md`

**Success Criteria:**
- Every exported utility has TypeDoc comments
- Guides include runnable code examples
- Migration guides tested on actual migration
- README updated with new capabilities

---

## Architecture Decisions

### Decision 1: Zone API - Objects vs Flat State

**Options:**
1. Core provides Zone objects only (current core approach)
2. Core provides flat state only (current lorcana approach)
3. Core provides both with adapters

**Decision:** Option 3 - Provide both patterns

**Rationale:**
- Zone objects provide configuration, validation, and rich API
- Flat state (`Record<PlayerId, CardId[]>`) is simpler for basic games
- Games should choose based on needs
- Adapter functions bridge the two approaches

**Implementation:**
- Primary API uses Zone objects (more powerful)
- Convenience helpers work with flat state
- Documentation explains when to use each

### Decision 2: Testing Utilities - Separate Package or Export

**Options:**
1. Separate npm package `@tcg/testing`
2. Export path `@tcg/core/testing`
3. Dev dependency only (not exported)

**Decision:** Option 2 - Export path `@tcg/core/testing`

**Rationale:**
- Keeps testing utilities with core (single version)
- Tree-shakeable (won't bloat production builds)
- Easier to maintain consistency
- Simpler for game developers (one dependency)

**Implementation:**
- `packages/core/src/testing/` directory
- Export via `package.json` exports map
- Only imported in test files

### Decision 3: Card Tooling - Core vs Separate Package

**Options:**
1. Keep card tooling game-specific (current)
2. Core provides base classes (proposed)
3. Separate `@tcg/card-tooling` package

**Decision:** Option 2 - Core provides base classes

**Rationale:**
- Card tooling is optional (not needed at runtime)
- Base infrastructure (file writing, formatting) is reusable
- Game-specific parsers extend base classes
- Avoids proliferation of packages

**Implementation:**
- `packages/core/src/tooling/` directory
- Export via `@tcg/core/tooling`
- Games extend base classes with specific logic

### Decision 4: Validation Approach - Runtime vs Compile-time

**Options:**
1. Runtime validation only (Zod schemas)
2. TypeScript types only (compile-time)
3. Hybrid approach (both)

**Decision:** Option 3 - Hybrid approach

**Rationale:**
- TypeScript provides type safety during development
- Runtime validation catches errors from external data (card scrapers, network)
- Performance impact minimal with proper use
- Zod schemas double as type definitions

**Implementation:**
- Export Zod schemas for runtime validation
- TypeScript types for compile-time safety
- Documentation shows when to use each

---

## Performance Considerations

### Zone Operations Performance

**Current Performance:**
- Core's Immer-based zone operations: ~0.1ms per operation
- Lorcana's flat state operations: ~0.05ms per operation

**Impact:**
- Typical game has ~100 zone operations per turn
- Total impact: ~10ms vs ~5ms per turn
- Not significant for turn-based games

**Optimization Strategy:**
- Use flat state for simple games (lower overhead)
- Use Zone objects when need validation/config
- Profile and optimize hot paths if needed

### Testing Utilities Performance

**Goal:** Test suite execution time should not increase

**Strategy:**
- Test builders use efficient state factories
- Minimize object cloning in test helpers
- Lazy initialization where possible

### Validation Performance

**Goal:** Runtime validation <5% overhead

**Strategy:**
- Validate only at boundaries (external data, move execution)
- Skip validation for trusted internal operations
- Use fast-fail validation (stop at first error)
- Cache validation results where appropriate

---

## Migration Strategy

### Phase 1: Core Enhancements (Week 1-2)
1. Add missing zone operations to core
2. Create testing utilities
3. Create card tooling base classes
4. Add validator builders
5. Comprehensive testing of new features

### Phase 2: Documentation (Week 2-3)
1. Write zone operations guide
2. Write testing utilities guide
3. Write card tooling guide
4. Update core README
5. Create migration guides

### Phase 3: Lorcana Migration (Week 3-4)
1. Migrate lorcana zone operations to use core
2. Adopt testing utilities in lorcana tests
3. Verify no functionality lost
4. Remove duplicate code
5. Update lorcana documentation

### Phase 4: Gundam Migration (Week 4-5)
1. Migrate gundam card tools to extend core
2. Add zone operations to gundam (using core)
3. Adopt testing utilities in gundam tests
4. Remove duplicate code
5. Update gundam documentation

### Phase 5: Validation & Polish (Week 5-6)
1. Run static analysis for duplication
2. Performance benchmarking
3. Documentation review
4. Create examples for each pattern
5. Final integration testing

---

## Success Metrics

### Code Duplication Metrics
- **Target:** Zero duplicated zone operations across packages
- **Measurement:** Run `bun run check-duplication` (custom script using jscpd)

### Testing Coverage
- **Target:** >95% test coverage for all new core utilities
- **Measurement:** `bun test --coverage`

### Documentation Quality
- **Target:** 100% of exported functions have TypeDoc comments
- **Measurement:** TypeDoc validation in CI

### Migration Success
- **Target:** Both gundam and lorcana use core utilities for overlapping concerns
- **Measurement:** Code review + grep for duplicate patterns

### Performance
- **Target:** <5% performance regression in game engine test suites
- **Measurement:** Before/after benchmarks using `bun bench`

### Developer Experience
- **Target:** >60% reduction in test boilerplate in game engines
- **Measurement:** Line count comparison before/after migration

---

## Risk Mitigation

### Risk 1: Breaking Changes to Existing Games

**Mitigation:**
- Maintain backward compatibility during migration
- Add new APIs alongside old ones initially
- Deprecation warnings before removal
- Comprehensive migration testing

### Risk 2: Over-Abstraction

**Mitigation:**
- Only abstract patterns used by 2+ games
- Prefer simple utilities over complex frameworks
- Document when NOT to use abstractions
- Regular review with game developers

### Risk 3: Performance Regression

**Mitigation:**
- Benchmark before and after changes
- Profile hot paths
- Optimize critical operations
- Document performance characteristics

### Risk 4: Maintenance Burden

**Mitigation:**
- Comprehensive test coverage
- Clear documentation
- Simple, focused APIs
- Regular refactoring to prevent complexity growth

---

## External Dependencies

No new external dependencies required. All implementations use existing dependencies:
- `immer` (already in core)
- `zod` (already in core)
- `seedrandom` (already in core)
- TypeScript standard library

