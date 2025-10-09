# 4. Battle System Test Cases

## 4.1 Attack Declaration (Rule 7-3)

### Test 4.1.1: Attack Player
```typescript
it("allows attacking player with active unit (Rule 7-1, 7-3-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 4, hp: 5 }), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  const result = game.declareAttack("unit-1", "player2");
  
  expect(result.success).toBe(true);
  expect(game.getCurrentStep()).toBe("attack");
  expect(game.getAttackingUnit()).toBe("unit-1");
  expect(game.getAttackTarget()).toBe("player2");
});
```

### Test 4.1.2: Attack Rested Unit
```typescript
it("allows attacking rested enemy unit (Rule 7-3-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 4, hp: 5 }), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ ap: 3, hp: 4 }), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  const result = game.declareAttack("unit-1", "enemy-unit-1");
  
  expect(result.success).toBe(true);
  expect(game.getAttackTarget()).toBe("enemy-unit-1");
});
```

### Test 4.1.3: Cannot Attack with Rested Unit
```typescript
it("cannot attack with rested unit (Rule 7-3-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  const result = game.declareAttack("unit-1", "player2");
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("unitMustBeActive");
});
```

### Test 4.1.4: Unit Rests When Declaring Attack
```typescript
it("rests unit when declaring attack (Rule 7-3-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  expect(game.getUnit("unit-1").position).toBe("active");
  
  game.declareAttack("unit-1", "player2");
  
  expect(game.getUnit("unit-1").position).toBe("rested");
});
```

### Test 4.1.5: Cannot Attack Active Unit
```typescript
it("cannot attack active enemy unit (Rule 7-3-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  const result = game.declareAttack("unit-1", "enemy-unit-1");
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("targetMustBeRested");
});
```

### Test 4.1.6: When Attacking Effects Trigger
```typescript
it("triggers [When Attacking] effects (Rule 7-3-2)", () => {
  const unit = createUnit({
    ap: 4,
    hp: 5,
    effects: [{
      timing: "whenAttacking",
      type: "gainAP",
      amount: 2
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit, position: "active" }]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  expect(game.getUnit("unit-1").ap).toBe(4);
  
  game.declareAttack("unit-1", "player2");
  
  // Effect triggers
  expect(game.getPendingEffects().length).toBeGreaterThan(0);
  game.resolveTopOfStack();
  
  // AP increased
  expect(game.getUnit("unit-1").ap).toBe(6);
});
```

### Test 4.1.7: Multiple When Attacking Effects - Active Player First
```typescript
it("resolves multiple [When Attacking] effects with active player first (Rule 7-3-2)", () => {
  const attackingUnit = createUnit({
    effects: [{
      timing: "whenAttacking",
      type: "drawCard"
    }]
  });
  
  const supportUnit = createUnit({
    effects: [{
      timing: "whenAnyUnitAttacks",
      type: "gainAP",
      target: "attackingUnit",
      amount: 1
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: attackingUnit, position: "active" },
          { card: supportUnit, position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  // Both effects trigger simultaneously
  const pendingEffects = game.getPendingEffects();
  expect(pendingEffects.length).toBe(2);
  
  // Active player chooses order
  expect(game.getState().requiresChoice).toBe(true);
  expect(game.getState().choiceType).toBe("effectResolutionOrder");
});
```

### Test 4.1.8: During This Battle Effects Start
```typescript
it("activates 'during this battle' effects (Rule 7-3-4)", () => {
  const unit = createUnit({
    effects: [{
      type: "constant",
      condition: "duringBattle",
      effect: "gainAP",
      amount: 3
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit, position: "active" }]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  const baseAP = game.getUnit("unit-1").ap;
  
  game.declareAttack("unit-1", "player2");
  
  // Effect active during battle
  expect(game.getUnit("unit-1").ap).toBe(baseAP + 3);
});
```

### Test 4.1.9: Skip Block If Unit Destroyed
```typescript
it("skips to battle end if attacking unit destroyed (Rule 7-3-5-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ hp: 2 }), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  // Effect destroys attacking unit during attack step
  game.dealDamageToUnit("unit-1", 2);
  
  // Unit destroyed
  expect(game.getUnit("unit-1")).toBeUndefined();
  
  // Battle skips to end
  expect(game.getCurrentStep()).toBe("battleEnd");
});
```

### Test 4.1.10: When Attacking Target Conditions
```typescript
it("evaluates target conditions during attack step (Rule 7-3-5-2)", () => {
  const unit = createUnit({
    effects: [{
      timing: "whenAttackingPlayer",
      type: "gainAP",
      amount: 2
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit, position: "active" }]
      },
      player2: {
        battleArea: [
          { card: createUnit(), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  
  // Attack player - effect should trigger
  game.declareAttack("unit-1", "player2");
  expect(game.hasTriggeredEffect("gainAPWhenAttackingPlayer")).toBe(true);
  
  // Reset for next test
  game.reset();
  
  // Attack unit - effect should NOT trigger
  game.declareAttack("unit-1", "enemy-unit-1");
  expect(game.hasTriggeredEffect("gainAPWhenAttackingPlayer")).toBe(false);
});
```

## 4.2 Block Step (Rule 7-4)

### Test 4.2.1: Activate Blocker
```typescript
it("allows standby player to activate <Blocker> (Rule 7-4-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 4 }), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ ap: 3, hp: 5, keywords: ["Blocker"] }), position: "active" }
        ],
        shields: []
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  // Now in block step
  expect(game.getCurrentStep()).toBe("block");
  
  // Standby player activates blocker
  const result = game.activateBlocker("enemy-blocker-1");
  
  expect(result.success).toBe(true);
  expect(game.getAttackTarget()).toBe("enemy-blocker-1"); // Target changed
  expect(game.getUnit("enemy-blocker-1").position).toBe("rested");
});
```

### Test 4.2.2: Blocker Once Per Attack
```typescript
it("allows <Blocker> activation only once per attack (Rule 7-4-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 4 }), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ keywords: ["Blocker"] }), position: "active" },
          { card: createUnit({ keywords: ["Blocker"] }), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  // Activate first blocker
  game.activateBlocker("blocker-1");
  
  // Cannot activate second blocker
  const result = game.activateBlocker("blocker-2");
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("blockerAlreadyActivated");
});
```

### Test 4.2.3: Original Target Cannot Block
```typescript
it("original attack target cannot activate <Blocker> (Rule 7-4-3)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ keywords: ["Blocker"] }), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "enemy-unit-1");
  
  // Target unit cannot block even with <Blocker>
  const result = game.activateBlocker("enemy-unit-1");
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("originalTargetCannotBlock");
});
```

### Test 4.2.4: Can Choose Not to Block
```typescript
it("allows choosing not to activate <Blocker> (Rule 7-4-4)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ keywords: ["Blocker"] }), position: "active" }
        ],
        shields: [createCard()]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  // Player 2 chooses not to block
  const result = game.passBlockerActivation("player2");
  
  expect(result.success).toBe(true);
  expect(game.getCurrentStep()).toBe("action");
  expect(game.getAttackTarget()).toBe("player2"); // Target unchanged
});
```

## 4.3 Action Step During Battle (Rule 7-5)

### Test 4.3.1: Standby Player First
```typescript
it("standby player acts first in battle action step (Rule 7-5-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passBlockerActivation("player2");
  
  // Now in action step
  expect(game.getCurrentStep()).toBe("action");
  expect(game.getCurrentActingPlayer()).toBe("player2"); // Standby player
});
```

### Test 4.3.2: Both Players Pass Ends Action Step
```typescript
it("ends action step when both players pass (Rule 7-5-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passBlockerActivation("player2");
  
  // Standby player passes
  game.passAction("player2");
  expect(game.getCurrentActingPlayer()).toBe("player1");
  
  // Active player passes
  game.passAction("player1");
  
  // Action step ends
  expect(game.getCurrentStep()).toBe("damage");
});
```

## 4.4 Damage Step (Rule 7-6)

### Test 4.4.1: Attack on Player - No Shields or Base
```typescript
it("player loses when taking battle damage with no shields/base (Rule 7-6-2-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 5 }), position: "active" }
        ]
      },
      player2: {
        shields: [],
        base: null
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passBlockerActivation("player2");
  game.passBothActions();
  
  // Damage step executes
  expect(game.getState().winner).toBe("player1");
  expect(game.getState().defeated).toContain("player2");
});
```

### Test 4.4.2: Attack on Player - Damage to Base
```typescript
it("deals battle damage to base when attacking player (Rule 7-6-2-3)", () => {
  const base = createBase({ ap: 0, hp: 5 });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 3 }), position: "active" }
        ]
      },
      player2: {
        base,
        shields: []
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passAllActionsUntilDamage();
  
  // Damage dealt to base
  expect(game.getBase("player2").damage).toBe(3);
  expect(game.getBase("player2").hp).toBe(5);
});
```

### Test 4.4.3: Attack on Player - Base Destroyed
```typescript
it("destroys base when HP reaches zero (Rule 7-6-2-3-1)", () => {
  const base = createBase({ ap: 0, hp: 3 });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 3 }), position: "active" }
        ]
      },
      player2: {
        base,
        shields: []
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passAllActionsUntilDamage();
  
  // Base destroyed
  expect(game.getBase("player2")).toBeNull();
  expect(game.getTrash("player2")).toContainCard("base");
});
```

### Test 4.4.4: Attack on Player - Destroy Shield
```typescript
it("destroys top shield when attacking player with no base (Rule 7-6-2-4)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 5 }), position: "active" }
        ]
      },
      player2: {
        shields: Array(3).fill(null).map(() => createCard()),
        base: null
      }
    }
  });
  
  const initialShields = game.getShieldCount("player2");
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passAllActionsUntilDamage();
  
  // Top shield destroyed and revealed
  expect(game.getShieldCount("player2")).toBe(initialShields - 1);
  expect(game.getTrash("player2").length).toBe(1);
});
```

### Test 4.4.5: Shield Burst Effect
```typescript
it("allows activating [Burst] effect when shield revealed (Rule 7-6-2-4-1)", () => {
  const burstCard = createCommand({
    burst: {
      type: "drawCard",
      count: 2
    }
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 5 }), position: "active" }
        ]
      },
      player2: {
        shields: [burstCard, createCard(), createCard()],
        base: null
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.passAllActionsUntilDamage();
  
  // Shield revealed - prompt for burst activation
  expect(game.getState().requiresChoice).toBe(true);
  expect(game.getState().choiceType).toBe("activateBurst");
  
  // Activate burst
  game.activateBurstEffect("player2");
  
  // Cards drawn
  expect(game.getHand("player2").length).toBeGreaterThan(5);
});
```

### Test 4.4.6: Attack on Unit - Simultaneous Damage
```typescript
it("deals damage simultaneously in unit vs unit battle (Rule 7-6-3-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 4, hp: 3 }), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ ap: 3, hp: 4 }), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "enemy-unit-1");
  game.passAllActionsUntilDamage();
  
  // Both units take damage simultaneously
  expect(game.getUnit("unit-1").damage).toBe(3);
  expect(game.getUnit("enemy-unit-1").damage).toBe(4);
});
```

### Test 4.4.7: Both Units Destroyed Simultaneously
```typescript
it("destroys both units simultaneously if both reach 0 HP (Rule 7-6-3-2-3)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ ap: 3, hp: 3 }), position: "active" }
        ]
      },
      player2: {
        battleArea: [
          { card: createUnit({ ap: 3, hp: 3 }), position: "rested" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "enemy-unit-1");
  game.passAllActionsUntilDamage();
  
  // Both destroyed
  expect(game.getUnit("unit-1")).toBeUndefined();
  expect(game.getUnit("enemy-unit-1")).toBeUndefined();
  
  // Both in trash
  expect(game.getTrash("player1")).toContainCard("unit-1");
  expect(game.getTrash("player2")).toContainCard("enemy-unit-1");
  
  // Destroyed simultaneously (same timestamp)
  const destroyHistory = game.getDestructionHistory();
  expect(destroyHistory[0].timestamp).toBe(destroyHistory[1].timestamp);
});
```

## 4.5 Battle End Step (Rule 7-7)

### Test 4.5.1: During Battle Effects End
```typescript
it("ends 'during this battle' effects (Rule 7-7-1)", () => {
  const unit = createUnit({
    ap: 3,
    effects: [{
      type: "constant",
      condition: "duringBattle",
      effect: "gainAP",
      amount: 2
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit, position: "active" }]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  // During battle
  expect(game.getUnit("unit-1").ap).toBe(5);
  
  game.completeBattle();
  
  // After battle
  expect(game.getUnit("unit-1").ap).toBe(3);
});
```

### Test 4.5.2: Return to Main Phase
```typescript
it("returns to main phase after battle end (Rule 7-7-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit(), position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.completeBattle();
  
  expect(getCurrentPhase(game)).toBe("main");
  expect(game.getCurrentStep()).toBeNull(); // Not in battle
});
```

