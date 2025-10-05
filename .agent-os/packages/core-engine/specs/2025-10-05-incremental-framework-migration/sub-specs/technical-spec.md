# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/core-engine/specs/2025-10-05-incremental-framework-migration/spec.md

> Created: 2025-10-05
> Version: 2.0.0

## Technical Requirements

### Project Structure

**Old Project (Source):**
- Location: `packages/lorcana-engine/src/cards/`
- Set 007 actions: `packages/lorcana-engine/src/cards/007/actions/[color]/[number]-[name].ts`
- Set 007 tests: `packages/lorcana-engine/src/cards/007/actions/[color]/[number]-[name].test.ts`
- Card definitions: Full definitions with abilities imported from centralized helpers

**New Project (Target):**
- Location: `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/`
- Set 007 actions: `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/[number]-[name].ts`
- Set 007 tests: `packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/[number]-[name].test.ts`
- Card definitions: Each card in its own file, importing ability/effect helpers from central locations

### Card Migration Strategy

**NOT Minimal Stubs (Proven Ineffective):**
The set 008 migration proved that minimal card stubs fail because tests require real card behavior. The new approach copies full card definitions.

**Full Card Copy and Migration:**

1. **Locate Source Card** - Find card in old project (`packages/lorcana-engine/src/cards/`)
2. **Copy Full Definition** - Copy entire card definition including all abilities and effects
3. **Migrate to New Format** - Adapt card structure to new framework format while preserving behavior
4. **Translate Ability References** - Update ability/effect imports to use new framework helpers
5. **Maintain Original Behavior** - Ensure migrated card behaves identically to original

**Example:**

```typescript
// Old project format (007/actions/amber/038-so-much-to-give.ts)
import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { soMuchToGiveAbility } from "../../abilities";

export const soMuchToGive: LorcanitoActionCard = {
  id: "qi0",
  name: "So Much To Give",
  characteristics: ["song", "action"],
  text: "...",
  type: "action",
  abilities: [soMuchToGiveAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  // ... other properties
};

// New project format (007/actions/038-so-much-to-give.ts)
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { soMuchToGiveAbility } from "~/game-engine/engines/lorcana/src/abilities/";

export const soMuchToGive: LorcanaActionCardDefinition = {
  id: "qi0",
  name: "So Much To Give",
  characteristics: ["song", "action"],
  text: "...",
  type: "action",
  abilities: [soMuchToGiveAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  // ... other properties
};
```

### Dependency Card Migration

When test files reference character/item cards from other sets:

1. **Extract Dependencies** - Parse test imports to find all referenced cards
2. **Locate Source Cards** - Find each card in old project
3. **Copy Full Definitions** - Copy complete card definitions with all abilities
4. **Migrate to New Format** - Adapt to new framework types and imports
5. **Place in Correct Set** - Add to appropriate set folder (002, 005, 007, etc.)

**NO minimal stubs - only full card definitions with complete abilities**

### Framework Implementation Strategy

**Production-Ready Only:**
- No temporary workarounds or simplified versions
- Implement complete features when discovered as missing
- Follow strict TDD: Red-Green-Refactor
- Use test expectations as the specification

**Implementation Process:**

1. **Run Test** - Execute test to see what framework features are missing
2. **Identify Gap** - Analyze error messages to understand what's needed
3. **Implement Feature** - Write production-ready code to fill the gap
4. **Verify Test Passes** - Confirm test goes green
5. **Refactor if Needed** - Clean up implementation while keeping tests green

### Migration Process Per Card

**Autonomous Card-by-Card Workflow:**

1. **Select Next Card** - Choose next action card from set 007 to migrate
2. **Read Test File** - Analyze test to understand expectations and dependencies
3. **Copy Action Card** - Migrate action card definition from old to new format
4. **Copy Dependency Cards** - Migrate any referenced character/item cards
5. **Run Test** - Execute test file to identify framework gaps
6. **Implement Framework Features** - Add missing capabilities production-ready
7. **Verify Test Passes** - Confirm single test file passes
8. **Verify Type Checking** - Ensure TypeScript types are correct
9. **Move to Next Card** - Proceed automatically to next card

**Success Criteria Per Card:**
- Test file passes (green status)
- Type checking passes for card files
- All abilities/effects properly imported
- Card behavior matches original implementation
- No mocks used (real card definitions only)

**Only Stop for Human Help If:**
- Genuinely stuck on very complex issue
- Multiple approaches tried without success
- Architectural decision needed beyond current scope

### Test Execution Strategy

**Card-by-Card Validation:**
```bash
# Run single card test
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/[number]-[name].test.ts
```

**Final Validation (After All Cards):**
```bash
# Run all set 007 action tests
bun test packages/engines/core-engine/src/game-engine/engines/lorcana/src/cards/definitions/007/actions/
```

**Note:** Other test failures can be ignored - focus only on set 007 action cards being migrated.

### File Structure Requirements

**Each Action Card:**
- Own file: `007/actions/[number]-[name].ts`
- Own test: `007/actions/[number]-[name].test.ts`
- Exports named constant matching card name in camelCase
- Imports ability/effect helpers from central locations

**Character/Item Cards:**
- Own file: `[set]/characters/[number]-[name].ts` or `[set]/items/[number]-[name].ts`
- Own test: `[set]/characters/[number]-[name].test.ts` (if exists in old project)
- Exports named constant matching card name in camelCase
- Imports ability/effect helpers from central locations

### Quality Standards

**Code Quality:**
- Follow TypeScript strict mode requirements
- No `any` types or type assertions
- Immutable data patterns
- Pure functions where possible
- Clear, self-documenting naming

**Test Quality:**
- Test behavior through public API (black box)
- Use real card definitions (no mocks)
- Test expectations define framework requirements
- 100% coverage through business behavior

**Documentation:**
- Code should be self-documenting through clear naming
- Complex logic should be extracted to well-named functions
- Track migration patterns for future sets

## External Dependencies

- Old project card definitions (source of truth for card behavior)
- Old project test files (source of truth for expectations)
- Test runner (bun test) for executing tests
- TypeScript compiler for type checking
- Core Engine framework (to be extended as needed)
