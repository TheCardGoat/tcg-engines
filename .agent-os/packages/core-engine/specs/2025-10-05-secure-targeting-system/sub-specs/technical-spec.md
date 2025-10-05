# Technical Specification - Secure Targeting System

This is the technical specification for @.agent-os/packages/core-engine/specs/2025-10-05-secure-targeting-system/spec.md

## Core Architecture Principle

**All target definitions MUST be serializable JSON.** The builder pattern is a convenience layer for programmatic construction, but the final result is always a strongly-typed JSON object that can be:
- Serialized/deserialized
- Stored in card definition files
- Transmitted over network  
- Validated at compile-time

## Existing Core-Engine Architecture

The core-engine already has foundational pieces we'll build upon:

### 1. `TargetSpec` Interface (in `move-types.ts`)

```typescript
export interface TargetSpec<Context, CardFilter> {
  readonly id: string;
  readonly parameterIndex: number;
  readonly required: boolean;
  readonly targetType: "card" | "player" | "zone" | "choice";
  readonly cardFilter?: CardFilter;           // For card targets
  readonly playerFilter?: (context: Context, playerId: PlayerID) => boolean;
  readonly zoneFilter?: (context: Context, zoneId: string, playerId?: PlayerID) => boolean;
  readonly choices?: readonly string[];        // For choice targets
  readonly description: string;
  readonly messageKey: string;
}
```

### 2. `CardFilterDSL` (in `card-filtering.ts`)

```typescript
export type CardFilterDSL<T extends GameSpecificCardFilter = BaseCoreCardFilter> = T;

export interface BaseCoreCardFilter {
  zone?: string | string[];
  owner?: string;
  publicId?: string;
  instanceId?: string;
  type?: string | string[];
}
```

### 3. Lorcana's Extended Types

```typescript
// CardTarget - Plain JSON interface
export interface CardTarget extends BaseTarget {
  type: "card";
  cardType?: LorcanaCardDefinition["type"] | Array<LorcanaCardDefinition["type"]>;
  zone?: LorcanaZone;
  owner?: "self" | "opponent" | "any" | "target" | "source";
  damaged?: boolean;
  ready?: boolean;
  exerted?: boolean;
  withKeyword?: Keyword;
  withoutKeyword?: Keyword;
  withClassification?: string;
  withName?: string;
  excludeSelf?: boolean;
  has?: "challenged";
  filter?: LorcanaCardFilter;
  min?: number;
  max?: number;
  count?: number | DynamicValue;
  random?: boolean;
}
```

## Proposed Enhancement: Rich, Extensible CardFilter

### Core-Engine Level: Enhanced BaseCoreCardFilter

**Location**: `packages/engines/core-engine/src/game-engine/core-engine/types/game-specific-types.ts`

```typescript
/**
 * Enhanced base card filter with rich filtering capabilities
 * All properties are optional and serializable to JSON
 */
export interface BaseCoreCardFilter {
  // Basic identification
  zone?: string | string[];
  owner?: string | "self" | "opponent";
  publicId?: string | string[];
  instanceId?: string | string[];
  type?: string | string[];
  
  // Status filters
  ready?: boolean;
  exerted?: boolean;
  damaged?: boolean;
  
  // Attribute comparisons (serializable)
  cost?: NumericComparison;
  strength?: NumericComparison;
  name?: StringComparison;
  
  // Keywords/Abilities
  withKeyword?: string | string[];
  withoutKeyword?: string | string[];
  
  // Characteristics
  withCharacteristics?: string[];
  characteristicsMode?: "all" | "any"; // AND vs OR
  
  // Quantity/Selection
  count?: number | "all";
  upTo?: boolean;
  random?: boolean;
  excludeSelf?: boolean;
  
  // Advanced filters (optional, game-specific)
  custom?: Record<string, any>;
}

/**
 * Serializable comparison types
 */
export type NumericComparison = {
  operator: "eq" | "gt" | "gte" | "lt" | "lte";
  value: number;
};

export type StringComparison = {
  operator: "eq" | "includes" | "startsWith" | "endsWith";
  value: string | string[];
  caseInsensitive?: boolean;
};
```

### Game-Specific Extension Example: LorcanaCardFilter

**Location**: `packages/engines/core-engine/src/game-engine/engines/lorcana/src/lorcana-engine-types.ts`

```typescript
/**
 * Lorcana-specific card filter extending the core filter
 * Still plain JSON, no functions
 */
export interface LorcanaCardFilter extends BaseCoreCardFilter {
  // Lorcana-specific card types
  type?: CardType | CardType[];
  
  // Lorcana-specific zones
  zone?: LorcanaZone | LorcanaZone[];
  
  // Lorcana-specific attributes
  inkwell?: boolean;
  willpower?: NumericComparison;
  loreValue?: NumericComparison;
  
  // Lorcana-specific statuses
  atLocation?: boolean;
  hasCardUnder?: boolean; // For Floodborn
  playedThisTurn?: boolean;
  
  // Lorcana-specific keywords
  withKeyword?: LorcanaKeyword | LorcanaKeyword[];
  withoutKeyword?: LorcanaKeyword | LorcanaKeyword[];
  
  // Lorcana-specific classifications
  withClassification?: LorcanaClassification | LorcanaClassification[];
  
  // Named card reference (for effects like "name a card")
  namedCard?: string;
}

export type LorcanaKeyword = 
  | "bodyguard" 
  | "challenger" 
  | "evasive" 
  | "reckless" 
  | "resist" 
  | "rush" 
  | "shift" 
  | "singer" 
  | "support" 
  | "vanish" 
  | "voiceless" 
  | "ward";

export type LorcanaZone = "deck" | "hand" | "play" | "discard" | "inkwell";
export type CardType = "character" | "action" | "item" | "location";
export type LorcanaClassification = "hero" | "villain" | "floodborn" | "dreamborn" | "storyborn";
```

## Builder Pattern (Optional Convenience Layer)

The builder is purely for **developer convenience** when writing card definitions programmatically. The `.build()` method returns a plain JSON object.

```typescript
/**
 * Optional builder for programmatic card filter creation
 * Returns plain JSON objects
 */
export class CardFilterBuilder<T extends BaseCoreCardFilter = BaseCoreCardFilter> {
  private filter: Partial<T> = {};
  
  inZone(zone: string | string[]): this {
    this.filter.zone = zone;
    return this;
  }
  
  ofType(type: string | string[]): this {
    this.filter.type = type;
    return this;
  }
  
  controlledBy(owner: "self" | "opponent"): this {
    this.filter.owner = owner;
    return this;
  }
  
  ready(): this {
    this.filter.ready = true;
    return this;
  }
  
  damaged(): this {
    this.filter.damaged = true;
    return this;
  }
  
  withCost(comparison: NumericComparison): this {
    this.filter.cost = comparison;
    return this;
  }
  
  count(n: number): this {
    this.filter.count = n;
    return this;
  }
  
  all(): this {
    this.filter.count = "all";
    return this;
  }
  
  upTo(n: number): this {
    this.filter.count = n;
    this.filter.upTo = true;
    return this;
  }
  
  random(): this {
    this.filter.random = true;
    return this;
  }
  
  excludeSelf(): this {
    this.filter.excludeSelf = true;
    return this;
  }
  
  /**
   * Returns plain JSON object
   */
  build(): T {
    return { ...this.filter } as T;
  }
}

// Usage example - produces JSON
const filter = new CardFilterBuilder<LorcanaCardFilter>()
  .ofType("character")
  .inZone("play")
  .controlledBy("opponent")
  .withCost({ operator: "lte", value: 3 })
  .count(1)
  .build();

// Result is plain JSON:
// {
//   type: "character",
//   zone: "play",
//   owner: "opponent",
//   cost: { operator: "lte", value: 3 },
//   count: 1
// }
```

## Card Definition Examples

### Direct JSON Definition (Preferred for Card Files)

```typescript
// In card definition file - plain JSON
export const fireTheCannons: LorcanaCardDefinition = {
  id: "001/001",
  name: "Fire the Cannons!",
  type: "action",
  cost: 3,
  text: "Deal 2 damage to chosen character.",
  abilities: [{
    type: "play",
    effects: [{
      type: "damage",
      value: 2,
      // Target is plain JSON
      target: {
        type: "card",
        cardType: "character",
        zone: "play",
        count: 1
      }
    }]
  }]
};

// More complex targeting - still JSON
export const healingGlow: LorcanaCardDefinition = {
  id: "001/054",
  name: "Healing Glow",
  type: "action",
  cost: 2,
  text: "Remove up to 2 damage from chosen character.",
  abilities: [{
    type: "play",
    effects: [{
      type: "heal",
      value: 2,
      target: {
        type: "card",
        cardType: "character",
        zone: "play",
        damaged: true,
        count: 1
      }
    }]
  }]
};

// Multiple targets
export const strengthOfFox: LorcanaCardDefinition = {
  id: "001/189",
  name: "Strength of a Fox",
  type: "action",
  cost: 4,
  text: "Chosen character gets +4 strength this turn.",
  abilities: [{
    type: "play",
    effects: [{
      type: "getAttribute",
      attribute: "strength",
      value: 4,
      duration: { type: "turn" },
      target: {
        type: "card",
        cardType: "character",
        zone: "play",
        owner: "self",
        count: 1
      }
    }]
  }]
};
```

### Using Builder for Complex Construction

```typescript
// When programmatically generating cards or in tests
function createDamageAction(damage: number, targetFilter: LorcanaCardFilter): LorcanaCardDefinition {
  const target = new CardFilterBuilder<LorcanaCardFilter>()
    .ofType("character")
    .inZone("play")
    .count(1)
    .build();
  
  return {
    id: "dynamic",
    name: `Deal ${damage} Damage`,
    type: "action",
    cost: Math.ceil(damage / 2),
    abilities: [{
      type: "play",
      effects: [{
        type: "damage",
        value: damage,
        target: { ...target, ...targetFilter } // Still merging JSON
      }]
    }]
  };
}
```

## Target Resolution System

### TargetResolver (Core Engine)

**Purpose**: Resolve target filters to actual card instances at runtime.

```typescript
/**
 * Resolves serialized target filters to actual game objects
 * This is where filter evaluation happens
 */
export class TargetResolver<
  CardFilter extends BaseCoreCardFilter,
  CardInstance
> {
  constructor(
    private readonly state: CoreEngineState,
    private readonly cardStore: CoreCardInstanceStore<any>,
  ) {}
  
  /**
   * Resolve a card filter to matching card instances
   */
  resolveCardTargets(
    filter: CardFilter,
    sourceCard?: CardInstance,
    context?: TargetContext,
  ): CardInstance[] {
    // 1. Get candidate pool based on zone
    let candidates = this.getCandidatesByZone(filter.zone);
    
    // 2. Apply owner filter
    if (filter.owner) {
      candidates = this.filterByOwner(candidates, filter.owner, sourceCard);
    }
    
    // 3. Apply type filter
    if (filter.type) {
      candidates = this.filterByType(candidates, filter.type);
    }
    
    // 4. Apply status filters
    if (filter.ready !== undefined) {
      candidates = candidates.filter(c => this.isReady(c) === filter.ready);
    }
    if (filter.damaged !== undefined) {
      candidates = candidates.filter(c => this.isDamaged(c) === filter.damaged);
    }
    
    // 5. Apply attribute comparisons
    if (filter.cost) {
      candidates = candidates.filter(c => 
        this.compareNumeric(this.getCost(c), filter.cost!)
      );
    }
    
    // 6. Apply keyword filters
    if (filter.withKeyword) {
      const keywords = Array.isArray(filter.withKeyword) ? filter.withKeyword : [filter.withKeyword];
      candidates = candidates.filter(c => 
        keywords.some(kw => this.hasKeyword(c, kw))
      );
    }
    
    // 7. Apply excludeSelf
    if (filter.excludeSelf && sourceCard) {
      candidates = candidates.filter(c => c.instanceId !== sourceCard.instanceId);
    }
    
    // 8. Apply security checks (Ward, etc.)
    candidates = this.applySecurityChecks(candidates, sourceCard, context);
    
    // 9. Apply quantity/selection rules
    return this.applyQuantityRules(candidates, filter);
  }
  
  /**
   * Security validation - Ward, protection abilities, etc.
   */
  private applySecurityChecks(
    candidates: CardInstance[],
    source?: CardInstance,
    context?: TargetContext,
  ): CardInstance[] {
    return candidates.filter(target => {
      // Check Ward
      if (this.hasWard(target) && !this.canBypassWard(source, target)) {
        return false;
      }
      
      // Check other protection abilities (game-specific)
      // This is where game-specific validators hook in
      
      return true;
    });
  }
  
  /**
   * Apply count, upTo, random selection
   */
  private applyQuantityRules(
    candidates: CardInstance[],
    filter: CardFilter,
  ): CardInstance[] {
    if (filter.count === "all") {
      return candidates;
    }
    
    const count = filter.count ?? 1;
    
    if (filter.random) {
      return this.selectRandom(candidates, count);
    }
    
    if (filter.upTo) {
      // For "up to N", return all candidates up to N
      // Actual selection happens during move execution
      return candidates.slice(0, count);
    }
    
    return candidates.slice(0, count);
  }
}
```

### Game-Specific Target Validator (Lorcana Example)

```typescript
/**
 * Lorcana-specific target validation
 * Extends core validation with game-specific rules
 */
export class LorcanaTargetValidator {
  constructor(
    private readonly resolver: TargetResolver<LorcanaCardFilter, LorcanaCardInstance>,
  ) {}
  
  /**
   * Get potential targets for a filter
   */
  getPotentialTargets(
    filter: LorcanaCardFilter,
    source: LorcanaCardInstance,
  ): LorcanaCardInstance[] {
    return this.resolver.resolveCardTargets(filter, source);
  }
  
  /**
   * Validate that selected targets are legal
   */
  validateSelectedTargets(
    selectedIds: string[],
    filter: LorcanaCardFilter,
    source: LorcanaCardInstance,
  ): ValidationResult {
    const potentialTargets = this.getPotentialTargets(filter, source);
    const potentialIds = new Set(potentialTargets.map(t => t.instanceId));
    
    // Check all selected targets are in potential targets
    for (const id of selectedIds) {
      if (!potentialIds.has(id)) {
        return {
          valid: false,
          reason: "INVALID_TARGET",
          details: { invalidTargetId: id }
        };
      }
    }
    
    // Check quantity constraints
    const count = filter.count ?? 1;
    if (filter.count === "all") {
      // "All" effects don't need validation
      return { valid: true };
    }
    
    if (filter.upTo) {
      if (selectedIds.length > count) {
        return {
          valid: false,
          reason: "TOO_MANY_TARGETS",
          details: { max: count, actual: selectedIds.length }
        };
      }
    } else {
      if (selectedIds.length !== count) {
        return {
          valid: false,
          reason: "WRONG_TARGET_COUNT",
          details: { expected: count, actual: selectedIds.length }
        };
      }
    }
    
    return { valid: true };
  }
  
  /**
   * Check if targeting is required for this filter
   */
  requiresTargetSelection(
    filter: LorcanaCardFilter,
    source: LorcanaCardInstance,
  ): boolean {
    // Random selection doesn't require player input
    if (filter.random) {
      return false;
    }
    
    // "All" effects don't require selection
    if (filter.count === "all") {
      return false;
    }
    
    const potentialTargets = this.getPotentialTargets(filter, source);
    const count = filter.count ?? 1;
    
    // Auto-target if only exact number of targets available
    if (!filter.upTo && potentialTargets.length === count) {
      return false;
    }
    
    // Need selection if there are targets to choose from
    return potentialTargets.length > 0;
  }
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  details?: Record<string, any>;
}
```

## Integration with EnumerableMove

### How Moves Declare Targets

```typescript
export const damageMove: LorcanaEnumerableMove = {
  execute: ({ G, coreOps, playerID }, targetIds: string[]) => {
    const lorcanaOps = coreOps as LorcanaCoreOperations;
    
    // Resolve target IDs to card instances
    const targets = targetIds.map(id => 
      lorcanaOps.getCardByInstanceId(id)
    ).filter(Boolean);
    
    // Deal damage to each target
    for (const target of targets) {
      lorcanaOps.dealDamage(target.instanceId, 2);
    }
    
    return G;
  },
  
  /**
   * Declare what targets this move needs
   * Returns TargetSpec with serialized CardFilter
   */
  getTargetSpecs: ({ G, coreOps, playerID }) => {
    const ctx = coreOps.getCtx();
    
    return [{
      id: "damage-target",
      parameterIndex: 0,
      required: true,
      targetType: "card",
      // CardFilter is plain JSON
      cardFilter: {
        type: "character",
        zone: "play",
        owner: "opponent",
        count: 1
      } as LorcanaCardFilter,
      description: "Choose a character to deal 2 damage to",
      messageKey: "moves.damage.selectTarget",
    }];
  },
};
```

## File Structure

```
packages/engines/core-engine/src/game-engine/core-engine/
├── targeting/
│   ├── target-resolver.ts          # Core resolution logic
│   ├── target-validator.ts         # Base validation
│   ├── card-filter-builder.ts      # Optional builder
│   └── types.ts                    # Shared types
├── types/
│   └── game-specific-types.ts      # Enhanced BaseCoreCardFilter
└── card/
    └── card-filtering.ts            # Updated to use new filters

packages/engines/core-engine/src/game-engine/engines/lorcana/src/
├── targeting/
│   ├── lorcana-target-validator.ts # Game-specific validation
│   └── lorcana-target-helpers.ts   # Convenience functions
└── lorcana-engine-types.ts         # LorcanaCardFilter definition
```

## Summary

1. **All target definitions are plain JSON** - serializable, network-transmittable
2. **Builder pattern is optional** - for programmatic construction convenience
3. **Type-safe at compile time** - TypeScript validates the JSON structure
4. **Game-agnostic core** - BaseCoreCardFilter in core, extended by games
5. **Runtime resolution** - TargetResolver converts JSON filters to actual cards
6. **Security built-in** - Validation happens during resolution
7. **Works with existing EnumerableMove** - TargetSpec already expects serialized filters

This approach gives you:
- ✅ Serializable card definitions
- ✅ Type safety
- ✅ Deterministic replay
- ✅ Server-authoritative validation
- ✅ Clean separation of concerns
- ✅ Game-specific extensibility

