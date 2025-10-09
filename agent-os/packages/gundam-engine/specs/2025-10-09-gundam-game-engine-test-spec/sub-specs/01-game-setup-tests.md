# 1. Game Setup and Win Conditions Test Cases

## 1.1 Deck Construction Validation (Rule 5-1)

### Test 1.1.1: Valid Deck Construction
```typescript
it("accepts deck with exactly 50 cards", () => {
  const deck = createDeck({ cardCount: 50, colors: ["red"] });
  const game = createTestGame({ 
    players: { player1: { deck } } 
  });
  
  expect(game.validateDeck("player1").success).toBe(true);
});
```

### Test 1.1.2: Invalid Deck Size
```typescript
it("rejects deck with fewer than 50 cards (Rule 5-1-1)", () => {
  const deck = createDeck({ cardCount: 49, colors: ["red"] });
  const validation = validateDeck(deck);
  
  expect(validation.success).toBe(false);
  expect(validation.error.type).toBe("invalidDeckSize");
  expect(validation.error.expected).toBe(50);
  expect(validation.error.actual).toBe(49);
});
```

### Test 1.1.3: Single Color Deck
```typescript
it("accepts deck with single color (Rule 5-1-1-2)", () => {
  const deck = createDeck({ cardCount: 50, colors: ["blue"] });
  const validation = validateDeck(deck);
  
  expect(validation.success).toBe(true);
});
```

### Test 1.1.4: Two Color Deck
```typescript
it("accepts deck with two colors (Rule 5-1-1-2)", () => {
  const deck = createDeck({ cardCount: 50, colors: ["green", "white"] });
  const validation = validateDeck(deck);
  
  expect(validation.success).toBe(true);
});
```

### Test 1.1.5: Three Color Deck Rejection
```typescript
it("rejects deck with three colors (Rule 5-1-1-2)", () => {
  const deck = createDeck({ cardCount: 50, colors: ["red", "blue", "green"] });
  const validation = validateDeck(deck);
  
  expect(validation.success).toBe(false);
  expect(validation.error.type).toBe("tooManyColors");
  expect(validation.error.maxColors).toBe(2);
  expect(validation.error.actualColors).toBe(3);
});
```

### Test 1.1.6: Card Count Limit
```typescript
it("accepts up to 4 copies of same card (Rule 5-1-1-3)", () => {
  const deck = createDeck({ 
    cardCount: 50,
    colors: ["red"],
    duplicates: { "card-001": 4 }
  });
  const validation = validateDeck(deck);
  
  expect(validation.success).toBe(true);
});
```

### Test 1.1.7: Exceeds Card Copy Limit
```typescript
it("rejects deck with more than 4 copies of same card (Rule 5-1-1-3)", () => {
  const deck = createDeck({ 
    cardCount: 50,
    colors: ["red"],
    duplicates: { "card-001": 5 }
  });
  const validation = validateDeck(deck);
  
  expect(validation.success).toBe(false);
  expect(validation.error.type).toBe("tooManyCopies");
  expect(validation.error.cardNumber).toBe("card-001");
  expect(validation.error.maxCopies).toBe(4);
  expect(validation.error.actualCopies).toBe(5);
});
```

## 1.2 Resource Deck Construction (Rule 5-1)

### Test 1.2.1: Valid Resource Deck
```typescript
it("accepts resource deck with exactly 10 cards (Rule 5-1-1)", () => {
  const resourceDeck = createResourceDeck({ count: 10 });
  const validation = validateResourceDeck(resourceDeck);
  
  expect(validation.success).toBe(true);
  expect(resourceDeck.length).toBe(10);
});
```

### Test 1.2.2: Invalid Resource Deck Size
```typescript
it("rejects resource deck with fewer than 10 cards (Rule 5-1-1)", () => {
  const resourceDeck = createResourceDeck({ count: 9 });
  const validation = validateResourceDeck(resourceDeck);
  
  expect(validation.success).toBe(false);
  expect(validation.error.type).toBe("invalidResourceDeckSize");
  expect(validation.error.expected).toBe(10);
  expect(validation.error.actual).toBe(9);
});
```

### Test 1.2.3: Unlimited Copies in Resource Deck
```typescript
it("allows any number of same resource card (Rule 5-1-1-5)", () => {
  const resourceDeck = createResourceDeck({ 
    count: 10,
    allSameCard: "resource-001"
  });
  const validation = validateResourceDeck(resourceDeck);
  
  expect(validation.success).toBe(true);
});
```

## 1.3 Game Initialization (Rule 5-2)

### Test 1.3.1: Complete Game Setup
```typescript
it("initializes game with proper starting state (Rule 5-2)", () => {
  const game = createTestGame({
    players: {
      player1: { deck: createDeck(), resourceDeck: createResourceDeck() },
      player2: { deck: createDeck(), resourceDeck: createResourceDeck() }
    }
  });
  
  // Both players have shuffled decks (Rule 5-2-1-2)
  expect(game.getState().player1.deckArea.length).toBe(50);
  expect(game.getState().player2.deckArea.length).toBe(50);
  
  // Both players have resource decks (Rule 5-2-1-3)
  expect(game.getState().player1.resourceDeckArea.length).toBe(10);
  expect(game.getState().player2.resourceDeckArea.length).toBe(10);
  
  // Both players have starting hands of 5 cards (Rule 5-2-1-5)
  expect(game.getState().player1.hand.length).toBe(5);
  expect(game.getState().player2.hand.length).toBe(5);
  
  // Both players have 6 shields (Rule 5-2-2)
  expect(game.getState().player1.shieldSection.length).toBe(6);
  expect(game.getState().player2.shieldSection.length).toBe(6);
  
  // Both players have EX Base (Rule 5-2-3)
  expect(game.getState().player1.baseSection).toBeDefined();
  expect(game.getState().player1.baseSection?.isEXBase).toBe(true);
  expect(game.getState().player2.baseSection).toBeDefined();
  expect(game.getState().player2.baseSection?.isEXBase).toBe(true);
  
  // Player 2 has 1 EX Resource (Rule 5-2-4)
  expect(game.getState().player2.resourceArea.length).toBe(1);
  expect(game.getState().player2.resourceArea[0].isEXResource).toBe(true);
  
  // Player 1 starts (Rule 5-2-5)
  expect(game.getState().activePlayer).toBe("player1");
});
```

### Test 1.3.2: Mulligan - Player 1
```typescript
it("allows Player 1 to redraw starting hand once (Rule 5-2-1-6)", () => {
  const game = createTestGame({ skipSetup: true });
  
  // Initial hands
  game.drawStartingHands();
  const player1InitialHand = [...game.getState().player1.hand];
  
  // Player 1 mulligans
  game.executeMulligan("player1");
  const player1NewHand = game.getState().player1.hand;
  
  // Hand should be different cards
  expect(player1NewHand).not.toEqual(player1InitialHand);
  expect(player1NewHand.length).toBe(5);
  
  // Deck should be shuffled
  expect(game.getState().player1.deckArea.length).toBe(50);
});
```

### Test 1.3.3: Mulligan - Player 2 After Player 1
```typescript
it("allows Player 2 to mulligan after Player 1 decides (Rule 5-2-1-7)", () => {
  const game = createTestGame({ skipSetup: true });
  
  game.drawStartingHands();
  const player2InitialHand = [...game.getState().player2.hand];
  
  // Player 1 chooses not to mulligan
  game.passMulligan("player1");
  
  // Player 2 mulligans
  game.executeMulligan("player2");
  const player2NewHand = game.getState().player2.hand;
  
  expect(player2NewHand).not.toEqual(player2InitialHand);
  expect(player2NewHand.length).toBe(5);
});
```

### Test 1.3.4: Shield Placement Order
```typescript
it("places shields face down overlapping from nearest to player (Rule 5-2-2)", () => {
  const game = createTestGame();
  
  const shields = game.getState().player1.shieldSection;
  
  // 6 shields placed
  expect(shields.length).toBe(6);
  
  // All face down
  shields.forEach(shield => {
    expect(shield.faceUp).toBe(false);
  });
  
  // All in rested position (Rule 4-4-5)
  shields.forEach(shield => {
    expect(shield.position).toBe("rested");
  });
});
```

## 1.4 Win/Loss Conditions (Rule 1-2)

### Test 1.4.1: Win by Battle Damage with No Shields
```typescript
it("player wins when dealing battle damage with no shields remaining (Rule 1-2-2-1)", () => {
  const game = createTestGame({
    players: {
      player1: {
        battleArea: [{
          card: createUnit({ ap: 5 }),
          position: "active"
        }]
      },
      player2: {
        shields: [], // No shields
        base: null    // No base
      }
    }
  });
  
  // Player 1 attacks Player 2
  const attackResult = game.declareAttack("unit-1", "player2");
  expect(attackResult.success).toBe(true);
  
  // Resolve battle
  const battleResult = game.resolveBattle();
  expect(battleResult.success).toBe(true);
  
  // Player 2 should be defeated
  expect(game.getState().winner).toBe("player1");
  expect(game.getState().defeated).toContain("player2");
  expect(game.getState().gameOver).toBe(true);
});
```

### Test 1.4.2: Win by Deck Out
```typescript
it("player wins when opponent has no cards in deck (Rule 1-2-2-2)", () => {
  const game = createTestGame({
    players: {
      player1: {},
      player2: {
        deck: createDeck({ cardCount: 1 }) // Only 1 card left
      }
    }
  });
  
  // Advance to Player 2's draw phase
  game.advanceToPlayer("player2");
  game.advanceToPhase("draw");
  
  // Player 2 draws last card
  const drawResult = game.executeDrawPhase();
  expect(drawResult.success).toBe(true);
  expect(game.getState().player2.deckArea.length).toBe(0);
  
  // Player 2 should be defeated immediately (Rule 6-3-1-1)
  expect(game.getState().winner).toBe("player1");
  expect(game.getState().defeated).toContain("player2");
  expect(game.getState().gameOver).toBe(true);
});
```

### Test 1.4.3: Concession
```typescript
it("player can concede at any time to lose (Rule 1-2-3)", () => {
  const game = createTestGame();
  
  // Player 1 concedes during their main phase
  game.advanceToPhase("main");
  const concedeResult = game.concede("player1");
  
  expect(concedeResult.success).toBe(true);
  expect(game.getState().winner).toBe("player2");
  expect(game.getState().defeated).toContain("player1");
  expect(game.getState().gameOver).toBe(true);
});
```

### Test 1.4.4: Simultaneous Defeat
```typescript
it("both players defeated simultaneously results in draw", () => {
  const game = createTestGame({
    players: {
      player1: {
        deck: createDeck({ cardCount: 1 }),
        shields: [],
        base: null
      },
      player2: {
        deck: createDeck({ cardCount: 1 }),
        shields: [],
        base: null
      }
    }
  });
  
  // Create scenario where both players would be defeated
  // (This would require a specific card effect scenario)
  const result = game.executeCardEffect("simultaneous-defeat-effect");
  
  // Both players defeated (Rule 10-2-1)
  expect(game.getState().defeated).toContain("player1");
  expect(game.getState().defeated).toContain("player2");
  expect(game.getState().winner).toBeNull();
  expect(game.getState().gameOver).toBe(true);
});
```

### Test 1.4.5: No Forced Concession
```typescript
it("no card effect can force concession (Rule 1-2-4)", () => {
  const game = createTestGame();
  
  // Attempt to play card that would force concession
  const card = createCommand({ 
    effect: "force opponent to concede"
  });
  
  // This should not be possible - card cannot exist in valid deck
  const validation = validateCardEffect(card);
  expect(validation.success).toBe(false);
  expect(validation.error.type).toBe("invalidEffect");
});
```

