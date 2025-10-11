# @tcg/core Type System Documentation

**Version:** 2.0.0 (Breaking Changes)  
**Date:** 2025-10-09  
**Status:** Design Phase - Ready for Review

## Overview

This directory contains comprehensive documentation for the `@tcg/core` type system redesign. The redesign consolidates types across the framework to eliminate duplication, improve type safety, and provide clear extension patterns for game engines.

## Documentation Structure

### 1. [type-analysis.md](./type-analysis.md)
**Complete type inventory and analysis**

- Comprehensive inventory of all types across core, lorcana-engine, and gundam-engine
- Side-by-side comparison matrix
- Identification of conflicts, duplications, and missing abstractions
- Detailed analysis of each system (zones, cards, moves, state, flow, targeting)
- Priority recommendations

**Read this first** to understand the current state and identified issues.

### 2. [type-specification.md](./type-specification.md)
**New core type system design**

- Complete type specifications designed from first principles
- Rationale for each design decision
- Breaking changes documentation
- Extension patterns and examples
- Validation against Lorcana and Gundam requirements

**Read this second** to understand the new type system design.

### 3. [migration-guide.md](./migration-guide.md)
**Step-by-step migration instructions**

- Breaking changes summary
- Detailed migration steps for lorcana-engine
- Integration patterns for gundam-engine
- Common issues and solutions
- Testing strategy
- Rollback plan

**Read this third** when ready to implement the migration.

### 4. [examples/](./examples/)
**Integration examples**

- `lorcana-integration.ts` - Complete Lorcana engine example
- Shows proper extension patterns
- Demonstrates all key concepts
- Production-ready code patterns

**Read these** for practical implementation examples.

## Quick Start

### For Framework Developers

1. Read **type-analysis.md** to understand issues
2. Review **type-specification.md** for design decisions
3. Implement breaking changes in core
4. Update tests and documentation

### For Game Engine Developers

1. Read **type-specification.md** (sections relevant to your needs)
2. Read **migration-guide.md** for your engine
3. Review **examples/** for patterns
4. Execute migration steps
5. Run tests and validate

## Key Changes Summary

### Additions to Core

1. ✅ **AbilityId** branded type
2. ✅ **ZoneState** utility type  
3. ✅ **GameState** base type
4. ✅ **Zone state operations** (addCardToTop, addCardToBottom, createZoneState)
5. ✅ **Optional metadata fields** in CardDefinition

### No Changes Needed

- ✅ Move system (already excellent)
- ✅ Flow system (already comprehensive)
- ✅ Targeting system (already complete)
- ✅ Game definition (already solid)

### Required Migrations

- ❌ Lorcana must remove branded type duplications
- ❌ Lorcana must adopt 3-tier zone visibility
- ⚠️ Gundam should follow patterns from start

## Design Principles

The type system follows these core tenets:

1. **First Principles** - Types designed for universal TCG concepts
2. **Type Safety** - Strict TypeScript, no `any` types
3. **Extensibility** - Games extend via intersection, not redefinition
4. **Simplicity** - Core provides minimal foundation
5. **Consistency** - Similar concepts use similar patterns

## Extension Patterns

### Pattern 1: Extending Card Definitions

```typescript
import type { CardDefinition } from "@tcg/core";

export type LorcanaCard = CardDefinition & {
  inkwell: boolean;
  cost: number;
  lore?: number;
};
```

### Pattern 2: Extending Game State

```typescript
import type { GameState } from "@tcg/core";

export type LorcanaState = GameState & {
  phase: LorcanaPhase;  // Override
  lorcana: { ... };     // Extend
};
```

### Pattern 3: Using Zone System

```typescript
import type { ZoneConfig, ZoneState } from "@tcg/core";
import { createZoneState } from "@tcg/core";

const zones = {
  deck: createZoneState(players),
  hand: createZoneState(players),
};
```

## Validation

### ✅ Lorcana Requirements Met

- 5 zones ✅
- Character drying ✅
- Ink management ✅
- Lore tracking ✅
- Challenges ✅

### ✅ Gundam Requirements Met

- 7 zones ✅
- Shield area ✅
- Battle positions ✅
- Bases ✅
- Resources ✅
- Pilot pairing ✅

## Success Criteria

- [x] Complete type analysis
- [x] Design from first principles
- [x] Validate against both engines
- [x] Document migration path
- [x] Create integration examples
- [ ] Implement core changes
- [ ] Migrate lorcana-engine
- [ ] Test and validate

## Timeline

### Analysis Phase ✅ Complete
- Type inventory
- Comparison matrix
- Issue identification

### Design Phase ✅ Complete
- Type specification
- Extension patterns
- Validation

### Implementation Phase (Next)
- Update core types
- Migrate lorcana-engine
- Add integration tests

### Validation Phase (Final)
- Run all tests
- Verify type compatibility
- Update documentation

## Support & Issues

For questions or issues:

1. Check documentation in this directory
2. Review examples for patterns
3. File issue with context and code samples

## Contributing

When contributing to the type system:

1. Follow design principles
2. Validate against both engines
3. Update documentation
4. Add examples
5. Test thoroughly

## Related Documentation

- [packages/core/README.md](../../README.md) - Core framework overview
- [packages/core/ENGINE_INTEGRATION.md](ENGINE_INTEGRATION.md) - Integration guide
- [packages/lorcana-engine/](../../lorcana-engine/) - Lorcana implementation
- [packages/gundam-engine/](../../gundam-engine/) - Gundam implementation

---

**Questions?** Review the documentation in order (analysis → specification → migration → examples) for comprehensive understanding.


