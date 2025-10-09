# 2. Card Locations and Zone Management Test Cases

## 2.1 Zone Properties (Rule 3-1)

### Test 2.1.1: Public Zone Visibility
```typescript
it("both players can view public zones (Rule 3-1-4)", () => {
  const game = createTestGame();
  
  // Public zones: battle area, shield base, resource area, trash, removal
  const publicZones = [
    game.getBattleArea("player1"),
    game.getBaseSection("player1"),
    game.getResourceArea("player1"),
    game.getTrash("player1"),
    game.getRemovalArea("player1")
  ];
  
  publicZones.forEach(zone => {
    expect(zone.visibility).toBe("public");
    expect(game.canPlayerView("player2", zone.id)).toBe(true);
  });
});
```

### Test 2.1.2: Private Zone Visibility
```typescript
it("players cannot view opponent's private zones (Rule 3-1-4)", () => {
  const game = createTestGame();
  
  // Private zones: hand, deck, resource deck, shield section
  const player1PrivateZones = [
    game.getHand("player1"),
    game.getDeck("player1"),
    game.getResourceDeck("player1"),
    game.getShieldSection("player1")
  ];
  
  player1PrivateZones.forEach(zone => {
    expect(zone.visibility).toBe("private");
    expect(game.canPlayerView("player2", zone.id)).toBe(false);
    expect(game.canPlayerView("player1", zone.id)).toBe(true);
  });
});
```

### Test 2.1.3: Zone Card Count is Public
```typescript
it("card count in any zone is public information (Rule 3-1-3)", () => {
  const game = createTestGame();
  
  // Both players can query card counts in any zone
  expect(game.getZoneCount("player1", "deck")).toBeGreaterThan(0);
  expect(game.getZoneCount("player2", "deck")).toBeGreaterThan(0);
  expect(game.getZoneCount("player1", "hand")).toBe(5);
  expect(game.getZoneCount("player2", "shieldSection")).toBe(6);
});
```

## 2.2 Deck Area (Rule 3-2)

### Test 2.2.1: Deck Shuffling
```typescript
it("shuffles deck randomly (Rule 3-2-4)", () => {
  const initialOrder = createOrderedDeck();
  const game = createTestGame({
    players: { player1: { deck: initialOrder } }
  });
  
  game.shuffleDeck("player1");
  
  const newOrder = game.getState().player1.deckArea;
  
  // Order should be different (statistically very likely)
  expect(newOrder).not.toEqual(initialOrder);
  expect(newOrder.length).toBe(initialOrder.length);
});
```

### Test 2.2.2: Cannot View Deck Order
```typescript
it("players cannot view deck contents or order (Rule 3-2-2)", () => {
  const game = createTestGame();
  
  const deckQuery = game.viewDeck("player1", "player1");
  
  // Even owner cannot view full deck
  expect(deckQuery.success).toBe(false);
  expect(deckQuery.error.type).toBe("cannotViewPrivateZone");
});
```

### Test 2.2.3: Moving Multiple Cards Simultaneously
```typescript
it("treats multiple cards as simultaneous when moving from deck (Rule 3-2-3)", () => {
  const game = createTestGame();
  
  // Effect that moves top 3 cards to trash
  const result = game.executeCardEffect({
    type: "millCards",
    count: 3,
    from: "deck",
    to: "trash"
  });
  
  expect(result.success).toBe(true);
  
  // All 3 cards moved simultaneously
  const trash = game.getTrash("player1");
  expect(trash.length).toBe(3);
  
  // But physically moved one at a time
  const moveHistory = game.getState().lastMoveHistory;
  expect(moveHistory.cardsMovedSimultaneously).toBe(true);
  expect(moveHistory.physicalMovesCount).toBe(3);
});
```

## 2.3 Resource Area (Rule 3-4)

### Test 2.3.1: Resource Area Capacity
```typescript
it("allows up to 15 resources in resource area (Rule 3-4-2)", () => {
  const game = createTestGame({
    players: {
      player1: { resourceArea: 14 }
    }
  });
  
  // Place 15th resource
  const result = game.placeResource("player1");
  expect(result.success).toBe(true);
  expect(game.getResourceCount("player1")).toBe(15);
});
```

### Test 2.3.2: Exceeding Resource Capacity
```typescript
it("prevents placing resource when at 15 resource limit (Rule 3-4-2)", () => {
  const game = createTestGame({
    players: {
      player1: { resourceArea: 15 }
    }
  });
  
  // Attempt to place 16th resource
  const result = game.placeResource("player1");
  
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("resourceAreaFull");
  expect(result.error.currentCount).toBe(15);
  expect(result.error.maxCapacity).toBe(15);
});
```

### Test 2.3.3: EX Resource Limit
```typescript
it("allows up to 5 EX Resources (Rule 3-4-2-1)", () => {
  const game = createTestGame();
  
  // Player 2 starts with 1 EX Resource
  let exResourceCount = game.getEXResourceCount("player2");
  expect(exResourceCount).toBe(1);
  
  // Add 4 more EX Resources through effects
  for (let i = 0; i < 4; i++) {
    const result = game.placeEXResource("player2");
    expect(result.success).toBe(true);
  }
  
  exResourceCount = game.getEXResourceCount("player2");
  expect(exResourceCount).toBe(5);
  
  // Cannot add 6th EX Resource
  const result = game.placeEXResource("player2");
  expect(result.success).toBe(false);
  expect(result.error.type).toBe("exResourceLimitReached");
});
```

### Test 2.3.4: Resource Area is Public
```typescript
it("resource area is public and viewable (Rule 3-4-3)", () => {
  const game = createTestGame({
    players: {
      player1: { resourceArea: 5 }
    }
  });
  
  const resourceArea = game.getResourceArea("player1");
  
  expect(resourceArea.visibility).toBe("public");
  expect(game.canPlayerView("player2", "player1-resource-area")).toBe(true);
  
  // Both players can see all resources
  resourceArea.resources.forEach(resource => {
    expect(resource.faceUp).toBe(true);
  });
});
```

## 2.4 Battle Area (Rule 3-5)

### Test 2.4.1: Battle Area Capacity
```typescript
it("allows up to 6 units in battle area (Rule 3-5-2)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ name: "Unit 1" }) },
          { card: createUnit({ name: "Unit 2" }) },
          { card: createUnit({ name: "Unit 3" }) },
          { card: createUnit({ name: "Unit 4" }) },
          { card: createUnit({ name: "Unit 5" }) }
        ]
      }
    }
  });
  
  // Deploy 6th unit
  const result = game.deployUnit("player1", createUnit({ name: "Unit 6" }), { cost: 2 });
  
  expect(result.success).toBe(true);
  expect(game.getBattleArea("player1").length).toBe(6);
});
```

### Test 2.4.2: Battle Area Excess Management
```typescript
it("requires trashing unit when deploying with full battle area (Rule 10-4)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: Array(6).fill(null).map((_, i) => ({
          card: createUnit({ name: `Unit ${i + 1}` })
        }))
      }
    }
  });
  
  // Attempt to deploy 7th unit
  const result = game.deployUnit("player1", createUnit({ name: "Unit 7" }), { cost: 2 });
  
  // Should prompt for unit to trash
  expect(result.requiresChoice).toBe(true);
  expect(result.choiceType).toBe("selectUnitToTrash");
  
  // Choose unit to trash
  const choice = game.makeChoice("unit-1");
  expect(choice.success).toBe(true);
  
  // Battle area still has 6 units
  expect(game.getBattleArea("player1").length).toBe(6);
  
  // Old unit is in trash (not destroyed)
  expect(game.getTrash("player1")).toContainCard("unit-1");
});
```

### Test 2.4.3: Battle Area is Public
```typescript
it("battle area is public and viewable (Rule 3-5-3)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [
          { card: createUnit({ name: "Unit 1" }) }
        ]
      }
    }
  });
  
  const battleArea = game.getBattleArea("player1");
  
  expect(battleArea.visibility).toBe("public");
  expect(game.canPlayerView("player2", "player1-battle-area")).toBe(true);
});
```

## 2.5 Shield Area (Rule 3-6)

### Test 2.5.1: Base Section - Single Base Limit
```typescript
it("allows only 1 base in base section (Rule 3-6-3)", () => {
  const game = createTestGame();
  
  // Player starts with EX Base
  expect(game.getBaseSection("player1")).toBeDefined();
  
  // Deploy new base
  const result = game.deployBase("player1", createBase({ name: "New Base" }), { cost: 3 });
  
  // Should replace EX Base
  expect(result.success).toBe(true);
  expect(game.getBaseSection("player1")?.name).toBe("New Base");
  expect(game.getTrash("player1")).toContainCard("EX Base");
});
```

### Test 2.5.2: Shield Section Privacy
```typescript
it("shield section is private (Rule 3-6-4-1)", () => {
  const game = createTestGame();
  
  const shieldSection = game.getShieldSection("player1");
  
  expect(shieldSection.visibility).toBe("private");
  expect(game.canPlayerView("player2", "player1-shield-section")).toBe(false);
  expect(game.canPlayerView("player1", "player1-shield-section")).toBe(false); // Even owner
  
  // Shields are face down
  shieldSection.forEach(shield => {
    expect(shield.faceUp).toBe(false);
  });
});
```

### Test 2.5.3: Shield HP
```typescript
it("shields are treated as having 1 HP each (Rule 3-6-4-2)", () => {
  const game = createTestGame();
  
  const shields = game.getShieldSection("player1");
  
  shields.forEach(shield => {
    expect(shield.hp).toBe(1);
  });
});
```

### Test 2.5.4: Destroying Top Shield
```typescript
it("destroys top shield when taking damage (Rule 3-6-4-1)", () => {
  const game = createTestGame();
  
  const initialShields = game.getShieldCount("player1");
  const topShield = game.getTopShield("player1");
  
  // Attack deals damage to shield
  game.dealDamageToShield("player1", 1);
  
  // Top shield destroyed and revealed
  expect(game.getShieldCount("player1")).toBe(initialShields - 1);
  expect(game.getTrash("player1")).toContainCard(topShield.id);
});
```

## 2.6 Hand (Rule 3-8)

### Test 2.6.1: Hand Limit
```typescript
it("hand has limit of 10 cards (Rule 3-8-4)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: Array(10).fill(null).map(() => createCard())
      }
    }
  });
  
  expect(game.getHand("player1").length).toBe(10);
});
```

### Test 2.6.2: Hand Limit Enforcement in End Phase
```typescript
it("requires discarding down to 10 during hand step (Rule 3-8-4-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        hand: Array(12).fill(null).map(() => createCard())
      }
    }
  });
  
  // Advance to end phase hand step
  game.advanceToPhase("end");
  game.advanceToStep("hand");
  
  // Should prompt for discards
  const state = game.getState();
  expect(state.requiresChoice).toBe(true);
  expect(state.choiceType).toBe("discardToHandLimit");
  expect(state.choiceCount).toBe(2); // Must discard 2 cards
});
```

### Test 2.6.3: Hand is Private
```typescript
it("hand is private zone (Rule 3-8-2, 3-8-3)", () => {
  const game = createTestGame();
  
  const player1Hand = game.getHand("player1");
  
  expect(player1Hand.visibility).toBe("private");
  expect(game.canPlayerView("player1", "player1-hand")).toBe(true);
  expect(game.canPlayerView("player2", "player1-hand")).toBe(false);
});
```

## 2.7 Trash (Rule 3-9)

### Test 2.7.1: Trash is Public
```typescript
it("trash is public and viewable (Rule 3-9-2)", () => {
  const game = createTestGame();
  
  const trash = game.getTrash("player1");
  
  expect(trash.visibility).toBe("public");
  expect(game.canPlayerView("player2", "player1-trash")).toBe(true);
  
  // All cards face up
  trash.forEach(card => {
    expect(card.faceUp).toBe(true);
  });
});
```

### Test 2.7.2: Trash Order Can be Changed
```typescript
it("players can reorder cards in trash (Rule 3-9-2-1)", () => {
  const cards = [
    createCard({ name: "Card A" }),
    createCard({ name: "Card B" }),
    createCard({ name: "Card C" })
  ];
  
  const game = createTestGame({
    players: {
      player1: {
        trash: cards
      }
    }
  });
  
  const result = game.reorderTrash("player1", ["Card C", "Card A", "Card B"]);
  
  expect(result.success).toBe(true);
  expect(game.getTrash("player1")[0].name).toBe("Card C");
  expect(game.getTrash("player1")[1].name).toBe("Card A");
  expect(game.getTrash("player1")[2].name).toBe("Card B");
});
```

## 2.8 Removal Area (Rule 3-7)

### Test 2.8.1: Removal Area is Public
```typescript
it("removal area is public and viewable (Rule 3-7-2)", () => {
  const game = createTestGame();
  
  const removal = game.getRemovalArea("player1");
  
  expect(removal.visibility).toBe("public");
  expect(game.canPlayerView("player2", "player1-removal")).toBe(true);
});
```

### Test 2.8.2: Removal Order Can be Changed
```typescript
it("players can reorder cards in removal area (Rule 3-7-2-1)", () => {
  const cards = [
    createCard({ name: "Card A" }),
    createCard({ name: "Card B" })
  ];
  
  const game = createTestGame({
    players: {
      player1: {
        removal: cards
      }
    }
  });
  
  const result = game.reorderRemoval("player1", ["Card B", "Card A"]);
  
  expect(result.success).toBe(true);
  expect(game.getRemovalArea("player1")[0].name).toBe("Card B");
});
```

### Test 2.8.3: Removed Cards Not Destroyed
```typescript
it("removed units are not treated as destroyed (Rule 4-12-2)", () => {
  const unit = createUnit({ 
    name: "Test Unit",
    effects: [{ type: "destroyed", text: "Draw 1 card when destroyed" }]
  });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit }]
      }
    }
  });
  
  // Remove the unit
  const result = game.removeCard("player1", "unit-1");
  
  expect(result.success).toBe(true);
  expect(game.getRemovalArea("player1")).toContainCard("unit-1");
  
  // Destroyed effect should NOT trigger
  expect(game.getEffectHistory()).not.toContainEffect("drawOnDestroy");
});
```

## 2.9 Zone Transitions (Rule 3-1-5)

### Test 2.9.1: Card Becomes New Card on Zone Change
```typescript
it("treats card as new when moving between zones (Rule 3-1-5)", () => {
  const unit = createUnit({ name: "Test Unit" });
  
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{ card: unit, damage: 3 }]
      }
    }
  });
  
  // Unit has 3 damage
  expect(game.getCardDamage("unit-1")).toBe(3);
  
  // Return unit to hand
  const result = game.returnToHand("player1", "unit-1");
  expect(result.success).toBe(true);
  
  // Re-deploy unit
  const deployResult = game.deployUnit("player1", "unit-1", { cost: 2 });
  expect(deployResult.success).toBe(true);
  
  // Damage should be cleared (treated as new card)
  expect(game.getCardDamage("unit-1")).toBe(0);
});
```

### Test 2.9.2: Simultaneous Zone Placement Order
```typescript
it("owner determines order when multiple cards placed simultaneously (Rule 3-1-6)", () => {
  const cards = [
    createCard({ name: "Card A" }),
    createCard({ name: "Card B" }),
    createCard({ name: "Card C" })
  ];
  
  const game = createTestGame();
  
  // Effect moves 3 cards to trash simultaneously
  const result = game.moveCardsToZone("player1", cards, "trash", {
    order: ["Card C", "Card B", "Card A"]
  });
  
  expect(result.success).toBe(true);
  
  const trash = game.getTrash("player1");
  expect(trash[0].name).toBe("Card C");
  expect(trash[1].name).toBe("Card B");
  expect(trash[2].name).toBe("Card A");
});
```

### Test 2.9.3: Private Zone Placement Order Hidden
```typescript
it("does not reveal order when placing in private zone (Rule 3-1-7)", () => {
  const cards = [
    createCard({ name: "Card A" }),
    createCard({ name: "Card B" })
  ];
  
  const game = createTestGame();
  
  // Effect returns cards to deck
  const result = game.moveCardsToZone("player1", cards, "deck", {
    order: ["Card B", "Card A"]
  });
  
  expect(result.success).toBe(true);
  
  // Order determined but not revealed
  const moveLog = game.getLastMove();
  expect(moveLog.orderDetermined).toBe(true);
  expect(moveLog.orderRevealed).toBe(false);
});
```

