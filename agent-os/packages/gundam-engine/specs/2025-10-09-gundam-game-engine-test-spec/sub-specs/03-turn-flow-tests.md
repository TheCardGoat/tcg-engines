# 3. Turn Flow and Phase System Test Cases

## 3.1 Turn Structure (Rule 6-1)

### Test 3.1.1: Complete Turn Flow
```typescript
it("completes turn through all 5 phases in order (Rule 6-1-1)", () => {
  const game = createTestGame();
  
  expect(getCurrentPhase(game)).toBe("start");
  
  game.advancePhase();
  expect(getCurrentPhase(game)).toBe("draw");
  
  game.advancePhase();
  expect(getCurrentPhase(game)).toBe("resource");
  
  game.advancePhase();
  expect(getCurrentPhase(game)).toBe("main");
  
  game.advancePhase();
  expect(getCurrentPhase(game)).toBe("end");
  
  // After end phase, turn passes to opponent
  game.advancePhase();
  expect(getActivePlayer(game)).toBe("player2");
  expect(getCurrentPhase(game)).toBe("start");
});
```

### Test 3.1.2: Active Player Control
```typescript
it("active player controls turn progression (Rule 6-1-2)", () => {
  const game = createTestGame();
  
  expect(getActivePlayer(game)).toBe("player1");
  
  // Only active player can advance phases
  const result = game.advancePhase("player1");
  expect(result.success).toBe(true);
  
  // Standby player cannot
  const invalidResult = game.advancePhase("player2");
  expect(invalidResult.success).toBe(false);
  expect(invalidResult.error.type).toBe("notActivePlayer");
});
```

### Test 3.1.3: Effects Must Resolve Before Phase Advance
```typescript
it("cannot advance phase until all effects resolved (Rule 6-1-3)", () => {
  const game = createTestGame();
  
  // Trigger effect during start phase
  game.triggerEffect({
    type: "drawCard",
    timing: "startStep"
  });
  
  // Cannot advance until effect resolves
  const result = game.advancePhase();
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("effectsPending");
  
  // Resolve effect
  game.resolveTopOfStack();
  
  // Now can advance
  const advanceResult = game.advancePhase();
  expect(advanceResult.success).toBe(true);
});
```

## 3.2 Start Phase (Rule 6-2)

### Test 3.2.1: Active Step - Rest All Cards
```typescript
it("sets all rested cards to active during active step (Rule 6-2-2-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "rested" },
          { card: createUnit(), position: "rested" }
        ],
        resourceArea: 5 // All rested from previous turn
      }
    }
  });
  
  // Rest resources
  game.payResourceCost("player1", 5);
  
  // All cards rested
  expect(game.getActiveUnits("player1").length).toBe(0);
  expect(game.getActiveResources("player1")).toBe(0);
  
  // Advance to next turn's start phase
  game.advanceToNextTurn("player1");
  
  // Active step executes automatically
  expect(game.getCurrentStep()).toBe("active");
  
  // All cards now active
  expect(game.getActiveUnits("player1").length).toBe(2);
  expect(game.getActiveResources("player1")).toBe(5);
});
```

### Test 3.2.2: Simultaneous Activation
```typescript
it("activates all cards simultaneously (Rule 6-2-2-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: Array(6).fill(null).map(() => ({
          card: createUnit(),
          position: "rested"
        }))
      }
    }
  });
  
  game.advanceToNextTurn("player1");
  
  const activationHistory = game.getLastMoveHistory();
  expect(activationHistory.cardsActivated).toBe(6);
  expect(activationHistory.simultaneousActivation).toBe(true);
  expect(activationHistory.activationOrder).toBeUndefined(); // No specific order
});
```

### Test 3.2.3: Start Step Effects
```typescript
it("activates 'at the start of turn' effects during start step (Rule 6-2-3-1)", () => {
  const unit = createUnit({
    name: "Test Unit",
    effects: [{
      timing: "startOfTurn",
      type: "drawCard",
      count: 1
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit }]
      }
    }
  });
  
  const initialHandSize = game.getHand("player1").length;
  
  // Advance to start step
  game.advanceToPhase("start");
  game.advanceToStep("start");
  
  // Effect should trigger
  expect(game.getPendingEffects().length).toBeGreaterThan(0);
  
  // Resolve effect
  game.resolveTopOfStack();
  
  // Card drawn
  expect(game.getHand("player1").length).toBe(initialHandSize + 1);
});
```

## 3.3 Draw Phase (Rule 6-3)

### Test 3.3.1: Draw One Card
```typescript
it("active player draws one card (Rule 6-3-1)", () => {
  const game = createTestGame();
  
  const initialHandSize = game.getHand("player1").length;
  const initialDeckSize = game.getDeck("player1").length;
  
  game.advanceToPhase("draw");
  
  // Draw phase executes automatically
  expect(game.getHand("player1").length).toBe(initialHandSize + 1);
  expect(game.getDeck("player1").length).toBe(initialDeckSize - 1);
});
```

### Test 3.3.2: Lose When Drawing with Empty Deck
```typescript
it("player loses immediately when drawing with empty deck (Rule 6-3-1-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        deck: createDeck({ cardCount: 1 }) // Only 1 card left
      }
    }
  });
  
  // Draw last card
  game.advanceToPhase("draw");
  
  expect(game.getHand("player1").length).toBe(6); // 5 starting + 1 drawn
  expect(game.getDeck("player1").length).toBe(0);
  
  // Player immediately loses (Rule 10-2-1-2)
  expect(game.getState().defeated).toContain("player1");
  expect(game.getState().winner).toBe("player2");
});
```

## 3.4 Resource Phase (Rule 6-4)

### Test 3.4.1: Place One Resource
```typescript
it("places one resource from resource deck active (Rule 6-4-1)", () => {
  const game = createTestGame();
  
  const initialResources = game.getResourceCount("player1");
  const initialResourceDeck = game.getResourceDeck("player1").length;
  
  game.advanceToPhase("resource");
  
  // Resource placed automatically
  expect(game.getResourceCount("player1")).toBe(initialResources + 1);
  expect(game.getResourceDeck("player1").length).toBe(initialResourceDeck - 1);
  
  // Resource is active
  const newResource = game.getResourceArea("player1")[initialResources];
  expect(newResource.position).toBe("active");
});
```

### Test 3.4.2: Cannot Place Resource When At Limit
```typescript
it("cannot place resource when at 15 resource limit", () => {
  const game = createTestGame({
    players: {
      player1: {
        resourceArea: 15
      }
    }
  });
  
  game.advanceToPhase("resource");
  
  // Resource phase should handle limit
  expect(game.getResourceCount("player1")).toBe(15);
  
  // No resource added
  const phaseLog = game.getLastPhaseLog();
  expect(phaseLog.resourcePlaced).toBe(false);
  expect(phaseLog.reason).toBe("resourceAreaFull");
});
```

## 3.5 Main Phase (Rule 6-5)

### Test 3.5.1: Multiple Actions Permitted
```typescript
it("allows playing cards, activating abilities, and attacking (Rule 6-5-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: [
          createUnit({ cost: 2 }),
          createCommand({ cost: 1, timing: "main" })
        ],
        resourceArea: 5,
        battleArea: [
          { card: createUnit({ ap: 3 }), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  // Action 1: Deploy unit
  const deployResult = game.deployUnit("player1", "unit-card-1", { cost: 2 });
  expect(deployResult.success).toBe(true);
  
  // Action 2: Play command
  const commandResult = game.playCommand("player1", "command-card-1", { cost: 1 });
  expect(commandResult.success).toBe(true);
  
  // Action 3: Attack
  const attackResult = game.declareAttack("player1", "unit-1", "player2");
  expect(attackResult.success).toBe(true);
  
  // All actions during same main phase
  expect(getCurrentPhase(game)).toBe("main");
});
```

### Test 3.5.2: Actions in Any Order
```typescript
it("allows actions in any order (Rule 6-5-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: [createUnit({ cost: 1 })],
        resourceArea: 3,
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  // Attack first
  game.declareAttack("player1", "unit-1", "player2");
  game.resolveBattle();
  
  // Then deploy unit
  game.deployUnit("player1", "unit-card-1", { cost: 1 });
  
  // Then attack with new unit (if Link Unit)
  // etc.
  
  expect(game.getMainPhaseActions("player1").length).toBeGreaterThan(1);
});
```

### Test 3.5.3: Cannot Act During Pending Abilities
```typescript
it("cannot take main phase actions while abilities pending (Rule 6-5-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: [createUnit({ cost: 2 })],
        resourceArea: 3
      }
    }
  });
  
  game.advanceToPhase("main");
  
  // Trigger an ability
  game.triggerEffect({ type: "drawCard" });
  
  // Cannot deploy while ability pending
  const result = game.deployUnit("player1", "unit-1", { cost: 2 });
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("abilitiesPending");
});
```

### Test 3.5.4: Declare End of Main Phase
```typescript
it("allows declaring end of main phase (Rule 6-5-5)", () => {
  const game = createTestGame();
  
  game.advanceToPhase("main");
  
  // Player declares end
  const result = game.declareEndOfMainPhase("player1");
  
  expect(result.success).toBe(true);
  expect(getCurrentPhase(game)).toBe("end");
});
```

### Test 3.5.5: Cannot Deploy/Play During Attack
```typescript
it("cannot play cards while unit is attacking (Rule 11-2-1-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: [createUnit({ cost: 2 })],
        resourceArea: 5,
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  // Declare attack
  game.declareAttack("player1", "unit-1", "player2");
  
  // Now in attack sequence
  expect(game.getCurrentStep()).toBe("attack");
  
  // Cannot deploy unit during attack
  const result = game.deployUnit("player1", "unit-card-1", { cost: 2 });
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("cannotActDuringBattle");
});
```

## 3.6 End Phase (Rule 6-6)

### Test 3.6.1: End Phase Structure
```typescript
it("completes all 4 steps in order (Rule 6-6-1)", () => {
  const game = createTestGame();
  
  game.advanceToPhase("end");
  
  expect(getCurrentStep(game)).toBe("action");
  
  game.advanceStep();
  expect(getCurrentStep(game)).toBe("end");
  
  game.advanceStep();
  expect(getCurrentStep(game)).toBe("hand");
  
  game.advanceStep();
  expect(getCurrentStep(game)).toBe("cleanup");
  
  // After cleanup, turn passes
  game.advanceStep();
  expect(getActivePlayer(game)).toBe("player2");
});
```

### Test 3.6.2: Action Step - Standby Player First
```typescript
it("standby player acts first in action step (Rule 6-6-2-1)", () => {
  const game = createTestGame();
  
  game.advanceToPhase("end");
  
  expect(getCurrentStep(game)).toBe("action");
  expect(game.getCurrentActingPlayer()).toBe("player2"); // Standby player
  
  // Standby player passes
  game.passAction("player2");
  
  expect(game.getCurrentActingPlayer()).toBe("player1"); // Active player
});
```

### Test 3.6.3: End Step Effects
```typescript
it("activates 'at end of turn' effects (Rule 6-6-3-1)", () => {
  const unit = createUnit({
    name: "Test Unit",
    effects: [{
      timing: "endOfTurn",
      type: "dealDamage",
      target: "opponent",
      amount: 1
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit }]
      }
    }
  });
  
  game.advanceToPhase("end");
  game.advanceToStep("end");
  
  // Effect triggers
  expect(game.getPendingEffects().length).toBeGreaterThan(0);
  
  game.resolveAllEffects();
  
  // Damage dealt
  expect(game.getShieldCount("player2")).toBe(5); // 1 shield destroyed
});
```

### Test 3.6.4: Hand Step - Discard to Limit
```typescript
it("requires discarding to 10 card limit (Rule 6-6-4-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: Array(13).fill(null).map(() => createCard())
      }
    }
  });
  
  game.advanceToPhase("end");
  game.advanceToStep("hand");
  
  // Player must choose 3 cards to discard
  expect(game.getState().requiresChoice).toBe(true);
  expect(game.getState().choiceType).toBe("discardToHandLimit");
  expect(game.getState().choiceCount).toBe(3);
  
  // Make choice
  game.discardCards("player1", ["card-1", "card-2", "card-3"]);
  
  expect(game.getHand("player1").length).toBe(10);
});
```

### Test 3.6.5: Cleanup Step - "During This Turn" Effects End
```typescript
it("ends 'during this turn' effects in cleanup (Rule 6-6-5-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: createUnit({ ap: 3 }) }]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  // Apply temporary effect
  game.applyEffect({
    type: "modifyAP",
    target: "unit-1",
    amount: 2,
    duration: "duringThisTurn"
  });
  
  expect(game.getUnit("unit-1").ap).toBe(5); // 3 + 2
  
  // Advance to cleanup
  game.advanceToPhase("end");
  game.advanceToStep("cleanup");
  
  // Effect ends
  expect(game.getUnit("unit-1").ap).toBe(3); // Back to normal
});
```

### Test 3.6.6: Turn Passes After Cleanup
```typescript
it("passes turn to opponent after cleanup (Rule 6-6-6)", () => {
  const game = createTestGame();
  
  expect(getActivePlayer(game)).toBe("player1");
  
  // Complete Player 1's turn
  game.advanceToPhase("end");
  game.completeEndPhase();
  
  // Turn passed
  expect(getActivePlayer(game)).toBe("player2");
  expect(getCurrentPhase(game)).toBe("start");
});
```

## 3.7 Phase Transitions

### Test 3.7.1: Cannot Skip Phases
```typescript
it("must complete phases in order", () => {
  const game = createTestGame();
  
  expect(getCurrentPhase(game)).toBe("start");
  
  // Cannot skip to main phase
  const result = game.advanceToPhase("main");
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("mustAdvanceSequentially");
});
```

### Test 3.7.2: Phase Completion Tracking
```typescript
it("tracks phase completion status", () => {
  const game = createTestGame();
  
  expect(game.isPhaseComplete("start")).toBe(false);
  
  game.completePhase("start");
  
  expect(game.isPhaseComplete("start")).toBe(true);
  expect(getCurrentPhase(game)).toBe("draw");
});
```

