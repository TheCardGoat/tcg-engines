# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/packages/gundam-engine/specs/2025-10-08-core-game-loop/spec.md

> Created: 2025-10-08
> Version: 1.0.0

## Technical Requirements

### 1. Turn Flow Architecture

**Phase Structure:**
- Use segment/phase/step hierarchy from @tcg/core
- Each phase defines: next phase, moves available, endIf condition, onBegin/onEnd hooks
- Steps within phases for granular control (e.g., startPhase has active and start steps)
- Auto-advance for automatic phases (draw, resource), manual transition for interactive phases (main)

**Implementation Pattern:**
```typescript
duringGameSegment: {
  turn: {
    phases: {
      startPhase: {
        steps: {
          active: { onBegin: readyAllCards, endIf: true },
          start: { onBegin: triggerStartEffects, endIf: true }
        }
      },
      mainPhase: {
        moves: { deployUnit, attack, pass },
        endIf: ({ G }) => G.mainPhaseEnded
      }
    }
  }
}
```

### 2. Zone Management System

**All 9 Zones Required:**
- deck (private, ordered, shuffleable)
- resourceDeck (private, ordered)
- resourceArea (public, max 15, max 5 EX)
- battleArea (public, max 6 units)
- shieldBase (public, max 1 base)
- shieldSection (private, ordered shields)
- removalArea (public, unordered)
- hand (private, max 10 at end phase)
- trash (public, unordered)

**Zone Operations:**
- moveCard(from, to, cardId, position)
- shuffleZone(zone, playerId)
- getZone(zone, playerId)
- countZone(zone, playerId)

### 3. Core Move Implementations

**deployUnit:**
- Validate level requirement (resources >= card level)
- Validate cost (available active resources >= cost)
- Check zone limit (battleArea < 6)
- Rest resources to pay cost
- Move card from hand to battleArea
- Trigger rules management if zone full

**attackWithUnit:**
- Validate unit is active
- Validate target (player or rested enemy unit)
- Rest attacking unit
- Enter 5-step battle sequence
- Handle damage and destruction

**Battle Sequence Steps:**
1. Attack Step: Trigger 【When Attacking】 effects
2. Block Step: Allow <Blocker> activation
3. Action Step: Players can play 【Action】 cards
4. Damage Step: Calculate and apply damage
5. Battle End Step: Clean up "during battle" effects

### 4. State Management

**Card States:**
- active/rested (orientation)
- HP tracking via damage counters
- Position in zone (front/back, order)
- Paired pilot relationship

**Game State:**
- Current turn player
- Current phase/step
- Priority player
- Win/loss conditions
- Turn counter

### 5. Cost & Resource System

**Cost Payment:**
- Identify active resources in resource area
- Rest N resources where N = card cost
- Validate sufficient resources available
- Handle EX Resources (removed when used)

**Level Validation:**
- Count total resources (active + rested)
- Compare to card level requirement
- Allow play only if resources >= level

### 6. Rules Management (Automatic)

**Destruction Management:**
- Check HP <= 0 after any damage
- Move destroyed cards to trash
- Handle simultaneous destruction
- Trigger 【Destroyed】 effects (future)

**Zone Capacity:**
- Battle area: 6 units max (choose and trash excess)
- Shield base: 1 base max (replace if deploying new)
- Hand: 10 cards max (discard during hand step)
- Resource area: 15 total, 5 EX max

**Win/Loss Detection:**
- Check after every damage event
- Check after every draw
- Set winner immediately when condition met

### 7. Battle System Details

**Damage Calculation:**
- Attacker deals AP damage to target
- If target is unit, simultaneous damage exchange
- Use damage counters to track HP reduction
- Destroy when damage >= HP

**Player Attack:**
- If no shields and no base: player defeated
- If base exists: damage base
- If shields exist: destroy top shield, reveal for 【Burst】

**Unit Attack:**
- Both units deal damage simultaneously
- Check for destruction after damage
- Handle paired pilots (destroyed with unit)

### 8. Testing Strategy

**Test Layers:**
1. Unit tests for pure functions (validation, calculations)
2. Move tests for each action (behavior-driven)
3. Phase transition tests
4. Battle sequence integration tests
5. Full game playthrough tests
6. Win condition tests
7. Edge case tests (zone limits, simultaneous effects)

**Test Pattern:**
```typescript
describe("deployUnit move", () => {
  it("deploys unit when cost and level satisfied", () => {
    const state = setupGameWith5Resources();
    const result = deployUnit(state, { cardId: "unit-lv3-cost2" });
    expect(result.battleArea).toContain("unit-lv3-cost2");
    expect(result.hand).not.toContain("unit-lv3-cost2");
    expect(countActiveResources(result)).toBe(3); // 5 - 2
  });
});
```

### 9. Framework Integration

**CoreOperation Usage:**
- All state mutations via coreOps methods
- No direct state modification
- Immutable patterns enforced
- Type-safe operations

**Move Definition:**
```typescript
export const deployUnit: Move<GundamGameState> = {
  move: (G, ctx, ...args) => {
    const coreOps = new GundamCoreOperation(G, ctx);
    // Validate
    // Mutate via coreOps
    return coreOps.getState();
  }
};
```

### 10. Performance Considerations

**Deferred to Phase 6:**
- State delta optimizations
- Move enumeration caching
- Card query indexing
- Effect resolution optimization

**Current Phase Focus:**
- Correctness over performance
- Clear, maintainable code
- Comprehensive logging for debugging
- Framework pattern validation

## External Dependencies

No new external dependencies required. All functionality uses existing @tcg/core framework APIs.

## Framework Gaps & Recommendations

**Document any discovered limitations:**
- Missing coreOps methods
- Type safety issues
- Pattern anti-patterns
- API ergonomics problems

**Format:**
```
Gap: No built-in support for simultaneous card destruction
Recommendation: Add `destroyCards(cardIds[])` method to handle batch destruction atomically
Workaround: Loop and destroy individually, track destruction set
```

These findings will guide Phase 2 framework improvements.
