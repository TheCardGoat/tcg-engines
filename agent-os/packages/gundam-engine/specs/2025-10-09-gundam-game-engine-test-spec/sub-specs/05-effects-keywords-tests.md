# 5. Effects and Keyword Effects Test Cases

## 5.1 Keyword Effects

### Test 5.1.1: <Repair> - HP Recovery
```typescript
it("recovers HP at end of turn (Rule 11-1-1)", () => {
  const unit = createUnit({ hp: 5, keywords: [{ type: "Repair", amount: 2 }] });
  const game = createTestGame({
    players: { player1: { battleArea: [{ card: unit, damage: 3 }] } }
  });
  
  game.advanceToPhase("end");
  game.advanceToStep("end");
  
  expect(game.getUnit("unit-1").damage).toBe(1); // 3 - 2 = 1
});
```

### Test 5.1.2: <Breach> - Shield Damage on Unit Destruction
```typescript
it("deals damage to shield area when destroying unit (Rule 11-1-2)", () => {
  const unit = createUnit({ ap: 5, keywords: [{ type: "Breach", amount: 2 }] });
  const game = createTestGame({
    players: {
      player1: { battleArea: [{ card: unit, position: "active" }] },
      player2: { 
        battleArea: [{ card: createUnit({ hp: 3 }), position: "rested" }],
        shields: Array(3).fill(null).map(() => createCard())
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "enemy-unit-1");
  game.completeBattle();
  
  // Enemy unit destroyed, breach triggers
  expect(game.getShieldCount("player2")).toBe(1); // 3 - 2 = 1
});
```

### Test 5.1.3: <Support> - Temporary AP Boost
```typescript
it("gives AP to another unit during turn (Rule 11-1-3)", () => {
  const supporter = createUnit({ keywords: [{ type: "Support", amount: 2 }] });
  const attacker = createUnit({ ap: 3 });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: supporter, position: "active" },
          { card: attacker, position: "active" }
        ]
      }
    }
  });
  
  game.advanceToPhase("main");
  game.activateSupport("supporter-1", "attacker-1");
  
  expect(game.getUnit("supporter-1").position).toBe("rested");
  expect(game.getUnit("attacker-1").ap).toBe(5); // 3 + 2
});
```

### Test 5.1.4: <Blocker> - Redirect Attack
```typescript
it("redirects attack to blocker (Rule 11-1-4)", () => {
  const blocker = createUnit({ keywords: ["Blocker"] });
  
  const game = createTestGame({
    players: {
      player1: { battleArea: [{ card: createUnit(), position: "active" }] },
      player2: { 
        battleArea: [{ card: blocker, position: "active" }],
        shields: []
      }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  game.activateBlocker("blocker-1");
  
  expect(game.getAttackTarget()).toBe("blocker-1");
});
```

### Test 5.1.5: <First Strike> - Damage Before Enemy
```typescript
it("deals damage before enemy deals damage (Rule 11-1-5)", () => {
  const firstStrike = createUnit({ ap: 3, hp: 2, keywords: ["FirstStrike"] });
  const enemy = createUnit({ ap: 3, hp: 3 });
  
  const game = createTestGame({
    players: {
      player1: { battleArea: [{ card: firstStrike, position: "active" }] },
      player2: { battleArea: [{ card: enemy, position: "rested" }] }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "enemy-unit-1");
  game.completeBattle();
  
  // Enemy destroyed by first strike, attacker takes no damage
  expect(game.getUnit("unit-1").damage).toBe(0);
  expect(game.getUnit("enemy-unit-1")).toBeUndefined();
});
```

### Test 5.1.6: <High-Maneuver> - Prevents Blocker
```typescript
it("prevents <Blocker> activation (Rule 11-1-6)", () => {
  const highManeuver = createUnit({ keywords: ["High-Maneuver"] });
  const blocker = createUnit({ keywords: ["Blocker"] });
  
  const game = createTestGame({
    players: {
      player1: { battleArea: [{ card: highManeuver, position: "active" }] },
      player2: { battleArea: [{ card: blocker, position: "active" }] }
    }
  });
  
  game.advanceToPhase("main");
  game.declareAttack("unit-1", "player2");
  
  const result = game.activateBlocker("blocker-1");
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("blockerPrevented");
});
```

## 5.2 Effect Types

### Test 5.2.1: Constant Effects
```typescript
it("remains active while conditions met (Rule 9-1-5)", () => {
  const unit = createUnit({
    effects: [{
      type: "constant",
      condition: "whileInBattle",
      effect: "gainAP",
      amount: 2
    }]
  });
  
  const game = createTestGame({
    players: { player1: { hand: [unit] } }
  });
  
  const baseAP = unit.ap;
  
  // Not in battle yet
  game.deployUnit("player1", "unit-1", { cost: 2 });
  expect(game.getUnit("unit-1").ap).toBe(baseAP);
  
  // Enter battle
  game.declareAttack("unit-1", "player2");
  expect(game.getUnit("unit-1").ap).toBe(baseAP + 2);
  
  // Leave battle
  game.completeBattle();
  expect(game.getUnit("unit-1").ap).toBe(baseAP);
});
```

### Test 5.2.2: Triggered Effects
```typescript
it("activates automatically when condition occurs (Rule 9-1-6)", () => {
  const unit = createUnit({
    effects: [{
      timing: "deploy",
      type: "drawCard",
      count: 1
    }]
  });
  
  const game = createTestGame({
    players: { player1: { hand: [unit], resourceArea: 5 } }
  });
  
  const handSize = game.getHand("player1").length;
  
  game.advanceToPhase("main");
  game.deployUnit("player1", "unit-1", { cost: 2 });
  game.resolveTopOfStack();
  
  expect(game.getHand("player1").length).toBe(handSize); // -1 deployed +1 drawn
});
```

### Test 5.2.3: Activated Effects
```typescript
it("activates when player chooses (Rule 9-1-7)", () => {
  const unit = createUnit({
    effects: [{
      type: "activateMain",
      cost: { rest: true },
      effect: "dealDamage",
      target: "enemyUnit",
      amount: 2
    }]
  });
  
  const game = createTestGame({
    players: {
      player1: { battleArea: [{ card: unit, position: "active" }] },
      player2: { battleArea: [{ card: createUnit({ hp: 5 }) }] }
    }
  });
  
  game.advanceToPhase("main");
  game.activateAbility("unit-1", "enemy-unit-1");
  
  expect(game.getUnit("unit-1").position).toBe("rested");
  expect(game.getUnit("enemy-unit-1").damage).toBe(2);
});
```

### Test 5.2.4: Command Effects
```typescript
it("activates when played at specified timing (Rule 9-1-8)", () => {
  const command = createCommand({
    timing: "main",
    cost: 2,
    effect: "destroyUnit",
    target: "enemyRestedUnit"
  });
  
  const game = createTestGame({
    players: {
      player1: { hand: [command], resourceArea: 3 },
      player2: { battleArea: [{ card: createUnit(), position: "rested" }] }
    }
  });
  
  game.advanceToPhase("main");
  game.playCommand("player1", "command-1", "enemy-unit-1", { cost: 2 });
  
  expect(game.getUnit("enemy-unit-1")).toBeUndefined();
  expect(game.getTrash("player1")).toContainCard("command-1");
});
```

### Test 5.2.5: Substitution Effects
```typescript
it("replaces one event with another (Rule 9-1-9)", () => {
  const unit = createUnit({
    effects: [{
      type: "substitution",
      replaces: "whenThisWouldBeDestroyed",
      with: "returnToHand"
    }]
  });
  
  const game = createTestGame({
    players: { player1: { battleArea: [{ card: unit, damage: 4 }] } }
  });
  
  game.dealDamageToUnit("unit-1", 1); // Would destroy
  
  // Unit not destroyed, returned to hand instead
  expect(game.getUnit("unit-1")).toBeUndefined();
  expect(game.getHand("player1")).toContainCard("unit-1");
  expect(game.getTrash("player1")).not.toContainCard("unit-1");
});
```

## 5.3 Effect Resolution

### Test 5.3.1: Multiple Effects - Same Player Order
```typescript
it("owner chooses order for simultaneous effects (Rule 9-1-6-5)", () => {
  const unit1 = createUnit({ effects: [{ timing: "startOfTurn", type: "drawCard" }] });
  const unit2 = createUnit({ effects: [{ timing: "startOfTurn", type: "gainHP" }] });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit1 }, { card: unit2 }]
      }
    }
  });
  
  game.advanceToNextTurn("player1");
  
  expect(game.getPendingEffects().length).toBe(2);
  expect(game.getState().requiresChoice).toBe(true);
  expect(game.getState().choiceType).toBe("effectOrder");
});
```

### Test 5.3.2: Multiple Effects - Active Player First
```typescript
it("active player resolves effects first (Rule 9-1-6-6)", () => {
  // Both players have start-of-turn effects
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: createUnit({ effects: [{ timing: "startOfTurn", type: "drawCard" }] }) }]
      },
      player2: {
        battleArea: [{ card: createUnit({ effects: [{ timing: "startOfTurn", type: "drawCard" }] }) }]
      }
    }
  });
  
  game.advanceToNextTurn("player1");
  
  const effectOrder = game.getEffectResolutionOrder();
  expect(effectOrder[0].owner).toBe("player1");
  expect(effectOrder[1].owner).toBe("player2");
});
```

### Test 5.3.3: Burst Priority
```typescript
it("resolves [Burst] effects with priority (Rule 9-1-6-8)", () => {
  const burstShield = createCommand({ burst: { type: "destroyAttackingUnit" } });
  const deployEffect = createUnit({ effects: [{ timing: "deploy", type: "drawCard" }] });
  
  const game = createTestGame({
    players: {
      player1: { 
        hand: [deployEffect],
        battleArea: [{ card: createUnit({ ap: 5 }), position: "active" }]
      },
      player2: { shields: [burstShield], base: null }
    }
  });
  
  // Deploy unit (triggers deploy effect)
  game.advanceToPhase("main");
  game.deployUnit("player1", "deploy-unit", { cost: 2 });
  
  // Attack (triggers burst)
  game.declareAttack("attacking-unit", "player2");
  game.completeBattle();
  
  // Burst resolves first even though deploy triggered earlier
  const effectLog = game.getEffectResolutionLog();
  expect(effectLog[0].type).toBe("burst");
  expect(effectLog[1].type).toBe("deploy");
});
```

## 5.4 Keywords

### Test 5.4.1: [Activate・Main]
```typescript
it("can only activate during main phase (Rule 11-2-1)", () => {
  const unit = createUnit({
    effects: [{
      type: "activateMain",
      cost: { rest: true },
      effect: "drawCard"
    }]
  });
  
  const game = createTestGame({
    players: { player1: { battleArea: [{ card: unit }] } }
  });
  
  // Cannot activate during start phase
  game.advanceToPhase("start");
  let result = game.activateAbility("unit-1");
  expect(result.success).toBe(false);
  
  // Can activate during main phase
  game.advanceToPhase("main");
  result = game.activateAbility("unit-1");
  expect(result.success).toBe(true);
});
```

### Test 5.4.2: [Activate・Action]
```typescript
it("can only activate during action steps (Rule 11-2-2)", () => {
  const unit = createUnit({
    effects: [{
      type: "activateAction",
      effect: "dealDamage",
      amount: 1
    }]
  });
  
  const game = createTestGame({
    players: { player1: { battleArea: [{ card: unit }] } }
  });
  
  game.advanceToPhase("main");
  
  // Cannot activate during main phase
  let result = game.activateAbility("unit-1");
  expect(result.success).toBe(false);
  
  // Enter battle to reach action step
  game.declareAttack("some-unit", "player2");
  game.passBlockerActivation("player2");
  
  // Can activate during action step
  result = game.activateAbility("unit-1");
  expect(result.success).toBe(true);
});
```

### Test 5.4.3: [Once per Turn]
```typescript
it("limits effect to once per turn (Rule 11-2-12)", () => {
  const unit = createUnit({
    effects: [{
      type: "activateMain",
      frequency: "oncePerTurn",
      effect: "drawCard"
    }]
  });
  
  const game = createTestGame({
    players: { player1: { battleArea: [{ card: unit, position: "active" }], resourceArea: 5 } }
  });
  
  game.advanceToPhase("main");
  
  // First activation succeeds
  let result = game.activateAbility("unit-1");
  expect(result.success).toBe(true);
  
  // Ready the unit
  game.activateCard("unit-1");
  
  // Second activation fails
  result = game.activateAbility("unit-1");
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("alreadyUsedThisTurn");
});
```

This provides comprehensive test coverage for all effect types, keyword effects, and effect resolution rules while keeping the file at a manageable size.

