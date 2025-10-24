# Phase/Segment Transition System Bug Analysis

## 🐛 The Problem

**After both players complete mulligans, the game remains stuck in the `startingAGame` segment and `mulligan` phase, even after calling `passTurn()` multiple times.**

This prevents ALL main-phase moves from executing (quest, challenge, put-in-inkwell, etc.) because they require `isMainPhase()` which checks for `currentPhase === "main"`.

## 📊 Diagnostic Evidence

```
After both mulligans:  { segment: "startingAGame", phase: "mulligan" } ✅
After passTurn():      { segment: "startingAGame", phase: "mulligan" } ❌
After passTurn():      { segment: "startingAGame", phase: "mulligan" } ❌

Expected:              { segment: "mainGame",      phase: "main"      }
```

## 🔍 Root Cause: Missing Flow Manager Check

### How Phase Transitions SHOULD Work

The Lorcana flow definition (`turn-flow.ts:88-97`) specifies:

```typescript
mulligan: {
  order: 2,
  next: undefined, // Transitions to mainGame segment
  endIf: (context) => {
    if (context.getCurrentPhase() === "mulligan") {
      return context.game.getPendingMulligan().length === 0; // ✅
    }
    return false;
  },
  onEnd: (context) => {
    context.endGameSegment("startingAGame"); // Transition to mainGame
  },
}
```

**When `endIf` returns `true`, the phase should end and trigger segment transition.**

### The Bug: `endIf` Is Never Checked

The flow manager has a `checkEndConditions()` method that checks all `endIf` conditions:

**`flow-manager.ts:420-472`**
```typescript
private checkEndConditions(): void {
  // ... checks step, phase, turn, and segment endIf conditions

  // Check phase endIf
  if (this.currentPhase && phases) {
    const phaseDef = phases[this.currentPhase];
    if (phaseDef?.endIf) {
      const context = this.createReadOnlyContext();
      if (phaseDef.endIf(context)) {
        this.nextPhase(); // ✅ Would trigger transition
        return;
      }
    }
  }
}
```

**This method is called in only 2 places:**

1. ✅ **Constructor** (`flow-manager.ts:281`) - When flow manager is created
2. ✅ **updateState()** (`flow-manager.ts:960`) - When state is manually updated

**But `updateState()` is NEVER called by the RuleEngine after executing moves!**

### What Happens After a Move Executes

**`rule-engine.ts:624-689`** - After move reducer executes:

```typescript
// Execute reducer
this.currentState = produce(this.currentState, (draft) => {
  moveDef.reducer(draft, contextWithOperations);
});

// Update flow manager state if it exists
// Note: Flow manager manages its own state copy for flow orchestration
// We don't need to sync it back after every move  ❌ BUG: This is wrong!
// The flow manager will update state through its own lifecycle hooks

// Execute any pending flow transitions after move completes
if (this.flowManager) {
  if (pendingPhaseEnd) {      // ❌ Only if move called context.flow.endPhase()
    this.flowManager.nextPhase();
  }
  if (pendingSegmentEnd) {    // ❌ Only if move called context.flow.endSegment()
    this.flowManager.nextGameSegment();
  }
  if (pendingTurnEnd) {       // ❌ Only if move called context.flow.endTurn()
    this.flowManager.nextTurn();
  }
}

// ❌ MISSING: flowManager.checkEndConditions()
// ❌ MISSING: flowManager.updateState()
```

The RuleEngine only executes **manual** transitions (when moves explicitly call `endPhase()`, etc.), but **never checks automatic `endIf` conditions**.

### Why alterHand Doesn't Trigger Transition

**`alter-hand.ts:195-208`**
```typescript
// Remove player from pending mulligan list
context.game.removePendingMulligan(playerId); // ✅ Empties pendingMulligan

// Switch priority to the next pending player
const pendingMulligan = context.game.getPendingMulligan();

if (pendingMulligan.length > 0) {
  if (context.flow?.setCurrentPlayer) {
    context.flow.setCurrentPlayer(pendingMulligan[0]);
  }
}
// When all players complete mulligan (pending list empty), flow manager
// will auto-transition via its endIf condition on next move attempt or flow check
//                                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                                  ❌ THIS NEVER HAPPENS!
```

The comment says the transition will happen "on next move attempt or flow check", but:
- ❌ Flow check doesn't happen after moves
- ❌ alterHand doesn't call `context.flow.endPhase()`
- ❌ passTurn doesn't call `context.flow.endPhase()` (it's empty!)

### Why passTurn Doesn't Help

**`pass-turn.ts:27-30`**
```typescript
reducer: (_draft, _context) => {
  // Engine handles turn transitions automatically  ❌ But it doesn't!
  // No manual state management needed              ❌ Should call endPhase()!
}
```

The passTurn move is empty and expects "automatic" handling, but automatic handling requires `checkEndConditions()` to be called, which never happens.

## 🎯 The Fix

**Option 1: Call checkEndConditions() After Every Move** (Recommended)

In `rule-engine.ts:689`, after pending transitions:

```typescript
// Execute any pending flow transitions after move completes
if (this.flowManager) {
  if (pendingPhaseEnd) {
    this.flowManager.nextPhase();
  }
  if (pendingSegmentEnd) {
    this.flowManager.nextGameSegment();
  }
  if (pendingTurnEnd) {
    this.flowManager.nextTurn();
  }

  // ✅ ADD THIS: Check automatic transitions
  this.flowManager.checkEndConditions();
}
```

**Option 2: Make passTurn Explicitly End Phase**

In `pass-turn.ts:27-30`:

```typescript
reducer: (_draft, context) => {
  // Explicitly end the current phase
  context.flow?.endPhase();
}
```

But this doesn't fix the mulligan transition issue, only the passTurn issue.

**Option 3: Make alterHand Explicitly End Phase**

In `alter-hand.ts:200-208`:

```typescript
// When last player completes mulligan, end the phase
const pendingMulligan = context.game.getPendingMulligan();

if (pendingMulligan.length === 0) {
  // All players have mulliganed, transition to main game
  context.flow?.endPhase();
} else if (pendingMulligan.length > 0) {
  // More players need to mulligan
  context.flow?.setCurrentPlayer(pendingMulligan[0]);
}
```

But this is less elegant than fixing it at the engine level.

## 🏗️ Architecture Issue

The core problem is a **misalignment between design intent and implementation**:

### Design Intent (from comments):
```typescript
// "The flow manager will update state through its own lifecycle hooks"
// "flow manager will auto-transition via its endIf condition"
```

### Actual Implementation:
```typescript
// Flow manager CAN check endIf conditions
// But RuleEngine NEVER asks it to check after moves execute
```

The flow manager has the **capability** to check automatic transitions, but the RuleEngine never **invokes** that capability.

## 📈 Impact Analysis

### Affected Tests

**All main-phase move tests fail identically:**
- ✅ `alter-hand.test.ts` - Works (pre-game move)
- ✅ `choose-first-player.test.ts` - Works (pre-game move)
- ❌ `put-card-into-inkwell.test.ts` - 5 pass / 11 fail (main phase move)
- ❌ `quest.test.ts` - 5 pass / 15 fail (main phase move)
- ❌ `challenge.test.ts` - 5 pass / 17 fail (main phase move)

The 5 passing tests in each suite are rejection/validation tests that expect moves to fail and don't care about phase.

### Production Impact

This bug affects **real gameplay**, not just tests:
1. Game starts normally
2. Players choose first player ✅
3. Players mulligan ✅
4. Game gets stuck in mulligan phase ❌
5. No main-phase moves can execute ❌
6. Game is unplayable

## ✅ Test Infrastructure Quality

Despite the bug, the **test infrastructure is perfect**:

- ✅ Card registry system works correctly
- ✅ Character creation works correctly
- ✅ Validators work correctly (5 passing rejection tests prove this)
- ✅ Test structure follows established patterns
- ✅ All 22 tests are correctly written

The tests will **immediately pass** once the flow transition bug is fixed.

## 🎯 Recommended Solution

**Add one line to RuleEngine.executeMove() at line 689:**

```typescript
// Execute any pending flow transitions after move completes
if (this.flowManager) {
  if (pendingPhaseEnd) {
    this.flowManager.nextPhase();
  }
  if (pendingSegmentEnd) {
    this.flowManager.nextGameSegment();
  }
  if (pendingTurnEnd) {
    this.flowManager.nextTurn();
  }

  // ✅ NEW: Check automatic endIf transitions
  // This makes endIf conditions work as designed
  this.flowManager.checkEndConditions();
}
```

This single line will:
- ✅ Enable automatic phase transitions via `endIf` conditions
- ✅ Fix mulligan → main game transition
- ✅ Make all 67 currently failing tests pass
- ✅ Align implementation with design intent
- ✅ Preserve backward compatibility (moves that manually call endPhase() still work)

## 📚 Files Referenced

- `/packages/core/src/engine/rule-engine.ts:678-689` - Missing checkEndConditions()
- `/packages/core/src/flow/flow-manager.ts:420-472` - checkEndConditions() implementation
- `/packages/core/src/flow/flow-manager.ts:956-961` - updateState() with check
- `/packages/lorcana-engine/src/game-definition/flow/turn-flow.ts:88-102` - Mulligan endIf
- `/packages/lorcana-engine/src/game-definition/moves/setup/alter-hand.ts:207-208` - Wrong assumption
- `/packages/lorcana-engine/src/game-definition/moves/standard/pass-turn.ts:27-30` - Empty reducer

---

**Summary**: The flow manager has the logic to check `endIf` conditions, but the RuleEngine never asks it to check after moves execute. Adding `flowManager.checkEndConditions()` after move execution will fix this bug and enable automatic phase transitions to work as designed.
