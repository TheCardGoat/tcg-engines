# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/gundam-engine/specs/2025-10-09-type-safe-ability-system/spec.md

## Technical Requirements

### Type System Architecture

**Discriminated Unions**: All major types must use discriminated unions with a `type` or `action` discriminant field for type narrowing and exhaustive checking.

**No Unknown Types**: The system must eliminate all uses of `unknown` or `any` types from ability definitions. Use discriminated unions with explicit fallback types instead.

**Immutable Data Structures**: All types should be readonly where appropriate to enforce immutability principles from the core engine tenets.

**Recursive Type Support**: The ability system must support recursive definitions (e.g., abilities that grant other abilities, nested conditions).

### Target System

**Zone-Based Targeting**: Support targeting cards in any game zone (deck, hand, battle-area, shield-section, base-section, trash, removal, resource-area, resource-deck).

**Filter Composition**: Card filters must support multiple simultaneous criteria including card type, color, traits, name matching, level/cost/AP/HP comparisons, card state, and Link Unit status.

**Count Specifications**: Targets must specify minimum and maximum counts (e.g., "1 to 2 Units", "exactly 1 Unit", "up to 3 cards").

**Selection Methods**: Support different selection methods: player choice, random, top of deck/zone, bottom of deck/zone.

**Controller Specification**: Clearly distinguish between self-controlled and opponent-controlled targets.

### Condition System

**Composability**: Conditions must be composable using logical operators (AND, OR, NOT).

**Condition Types**: Support game state conditions (phase, during-battle, is-paired), card property conditions (traits, colors, stats), and temporal conditions (during-attack, until-end-of-turn).

**Evaluation Context**: Conditions must have clear evaluation timing (when checked vs when effect resolves).

### Effect Actions

**Atomic Actions**: Each effect action must represent a single atomic game state change.

**Action Categories**:
- Card Movement: move-card, draw-cards, discard-cards, shuffle-deck
- Deployment: deploy-unit, deploy-base, pair-pilot
- State Changes: rest-card, set-active, destroy-card, remove-card
- Combat: deal-damage, recover-hp
- Modification: modify-stats, grant-keyword, grant-ability
- Search: search-deck, reveal-cards, look-at-cards
- Resources: place-resource
- Special: change-attack-target, prevent-damage, create-token

**Cost System**: Activation costs support resting cards, destroying cards, paying resources, discarding cards, and composite costs using AND logic.

### Ability Types

**Constant Abilities**: Always active effects with optional conditions. Support continuous stat modifications, static keyword grants, and conditional constant effects.

**Triggered Abilities**: Effects that trigger on specific game events. Support triggers: ON_DEPLOY, ON_ATTACK, ON_DESTROY, ON_BURST, WHEN_PAIRED, WHEN_UNIT_ATTACKS, WHEN_UNIT_DESTROYED, START_OF_TURN, END_OF_TURN, WHEN_DAMAGE_DEALT, WHEN_DAMAGE_RECEIVED.

**Activated Abilities**: Player-initiated effects with costs. Support MAIN phase and ACTION step activation with optional activation costs.

**Command Abilities**: One-time effects from Command cards. Support MAIN, ACTION, and BURST timing.

**Substitution Abilities**: Replacement effects that alter how game events resolve. Support replacing destroy, damage, move, and discard events.

### Duration System

**Duration Types**:
- Permanent: Never expires
- Until-end-of-turn: Expires in cleanup step
- Until-end-of-battle: Expires at battle end
- Until-leaves-zone: Expires when card changes zones
- While-condition: Active only while condition is true

**Scope Tracking**: Each duration must be associated with the appropriate scope (turn-based, battle-based, zone-based, condition-based).

### Restrictions System

**Activation Limits**: Support once-per-turn restrictions, phase restrictions, turn-ownership restrictions (only during your turn).

**Custom Conditions**: Allow arbitrary condition-based restrictions using the condition system.

### Metadata Requirements

**Original Text**: All abilities must preserve the original card text for display and debugging purposes.

**Localization Keys**: While not required in initial implementation, structure should support future localization through description field.

**Source Tracking**: Ability structures should support tracking which card generated them (for granted abilities).

## File Structure

```
packages/gundam-engine/src/
├── cards/
│   ├── card-types.ts (updated with new ability system)
│   └── ability-types.ts (NEW - comprehensive ability type definitions)
├── game-logic/
│   ├── targets.ts (NEW - target system types)
│   ├── conditions.ts (NEW - condition system types)
│   ├── effects.ts (NEW - effect action types)
│   └── durations.ts (NEW - duration system types)
└── utils/
    └── type-guards.ts (NEW - type guard functions)
```

## Type Safety Guarantees

**Compile-Time Checks**:
- All effect actions must be handled in executor (exhaustiveness)
- Invalid target/filter combinations are compilation errors
- Mismatched ability types and metadata are compilation errors

**Runtime Safety**:
- Type guards enable safe runtime type narrowing
- Discriminated unions prevent invalid state representation
- Optional fields are explicitly marked for null-safety

## Migration Strategy

**Phase 1**: Define all type structures in new files without breaking existing code.

**Phase 2**: Update card-types.ts to import and use new types while maintaining backward compatibility with old ParsedAbility.

**Phase 3**: Mark old types as deprecated with clear migration path documented.

**Phase 4**: Parser can target new types incrementally while falling back to UNKNOWN action type with warnings.

## Testing Requirements

**Type Tests**: Create test files that verify type relationships and exhaustiveness checking at compile time.

**Type Guard Tests**: Unit tests for all type guard functions verifying correct narrowing behavior.

**Example Usage Tests**: Integration test showing full card definition → type validation → (mock) execution flow.

## Documentation Requirements

**JSDoc Comments**: All exported types must have comprehensive JSDoc comments explaining purpose, usage, and examples.

**Example Cards**: Provide 5+ example card definitions using the new type system covering various complexity levels.

**Migration Guide**: Document how to convert from old ParsedAbility to new AbilityDefinition structure.

