/**
 * Zone Management Examples
 *
 * Demonstrates comprehensive usage of zone operations from @tcg/core
 * Run with: bun run packages/core/docs/examples/zone-management.ts
 */

import {
  addCard,
  addCardToBottom,
  addCardToTop,
  type CardId,
  clearZone,
  createCardId,
  createPlayerId,
  createZone,
  createZoneId,
  draw,
  findCardInZones,
  getBottomCard,
  getCardsInZone,
  getTopCard,
  getZoneSize,
  isCardInZone,
  mill,
  moveCard,
  type PlayerId,
  peek,
  removeCard,
  reveal,
  search,
  shuffle,
  type Zone,
} from "../../src";

import {
  createPlayerZones,
  getCardZone,
  moveCardInState,
} from "../../src/zones/zone-state-helpers";

// =============================================================================
// Example 1: Basic Zone Operations
// =============================================================================

function example1_basicZoneOperations() {
  console.log("\n=== Example 1: Basic Zone Operations ===\n");

  // Create a deck zone
  const deckConfig = {
    id: createZoneId("deck"),
    name: "deck",
    visibility: "secret" as const,
    ordered: true,
  };

  const card1 = createCardId("card-1");
  const card2 = createCardId("card-2");
  const card3 = createCardId("card-3");

  let deck = createZone(deckConfig, [card1, card2, card3]);
  console.log("Initial deck size:", getZoneSize(deck)); // 3

  // Add cards
  deck = addCard(deck, createCardId("card-4"));
  console.log("After adding card:", getZoneSize(deck)); // 4

  // Add to top
  deck = addCardToTop(deck, createCardId("card-5"));
  console.log("Top card:", getTopCard(deck)); // card-5

  // Add to bottom
  deck = addCardToBottom(deck, createCardId("card-6"));
  console.log("Bottom card:", getBottomCard(deck)); // card-6

  // Check if card is in zone
  console.log("card-1 in deck?", isCardInZone(deck, card1)); // true
  console.log(
    "card-999 in deck?",
    isCardInZone(deck, createCardId("card-999")),
  ); // false

  // Get all cards
  const allCards = getCardsInZone(deck);
  console.log("All cards in deck:", allCards.length); // 6
}

// =============================================================================
// Example 2: Moving Cards Between Zones
// =============================================================================

function example2_movingCards() {
  console.log("\n=== Example 2: Moving Cards Between Zones ===\n");

  const card1 = createCardId("card-1");
  const card2 = createCardId("card-2");

  let deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    [card1, card2],
  );

  let hand = createZone(
    {
      id: createZoneId("hand"),
      name: "hand",
      visibility: "private",
      ordered: false,
    },
    [],
  );

  console.log("Initial state:");
  console.log("  Deck:", getZoneSize(deck)); // 2
  console.log("  Hand:", getZoneSize(hand)); // 0

  // Move a card
  const result = moveCard(deck, hand, card1);
  deck = result.fromZone;
  hand = result.toZone;

  console.log("\nAfter moving card-1:");
  console.log("  Deck:", getZoneSize(deck)); // 1
  console.log("  Hand:", getZoneSize(hand)); // 1

  // Remove a card
  deck = removeCard(deck, card2);
  console.log("\nAfter removing card-2:");
  console.log("  Deck:", getZoneSize(deck)); // 0
}

// =============================================================================
// Example 3: Drawing Cards
// =============================================================================

function example3_drawingCards() {
  console.log("\n=== Example 3: Drawing Cards ===\n");

  const cards = Array.from({ length: 10 }, (_, i) =>
    createCardId(`card-${i + 1}`),
  );

  let deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    cards,
  );

  let hand = createZone(
    {
      id: createZoneId("hand"),
      name: "hand",
      visibility: "private",
      ordered: false,
    },
    [],
  );

  console.log("Initial state:");
  console.log("  Deck:", getZoneSize(deck)); // 10
  console.log("  Hand:", getZoneSize(hand)); // 0

  // Draw 3 cards
  const drawResult = draw(deck, hand, 3);
  deck = drawResult.fromZone;
  hand = drawResult.toZone;

  console.log("\nAfter drawing 3 cards:");
  console.log("  Deck:", getZoneSize(deck)); // 7
  console.log("  Hand:", getZoneSize(hand)); // 3
  console.log("  Drawn cards:", drawResult.drawnCards); // [card-1, card-2, card-3]

  // Try to draw too many cards (will throw error)
  try {
    draw(deck, hand, 100);
  } catch (error) {
    console.log("\nCannot draw 100 cards:", error.message);
  }
}

// =============================================================================
// Example 4: Shuffling
// =============================================================================

function example4_shuffling() {
  console.log("\n=== Example 4: Shuffling (Deterministic) ===\n");

  const cards = Array.from({ length: 10 }, (_, i) =>
    createCardId(`card-${i + 1}`),
  );

  const deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    cards,
  );

  console.log("Original order:", getCardsInZone(deck).slice(0, 5));

  // Shuffle with seed
  const shuffled1 = shuffle(deck, "test-seed-123");
  console.log("Shuffled (seed 1):", getCardsInZone(shuffled1).slice(0, 5));

  // Same seed = same shuffle
  const shuffled2 = shuffle(deck, "test-seed-123");
  console.log(
    "Shuffled (seed 1 again):",
    getCardsInZone(shuffled2).slice(0, 5),
  );
  console.log(
    "Same shuffle?",
    JSON.stringify(getCardsInZone(shuffled1)) ===
      JSON.stringify(getCardsInZone(shuffled2)),
  );

  // Different seed = different shuffle
  const shuffled3 = shuffle(deck, "different-seed");
  console.log("Shuffled (seed 2):", getCardsInZone(shuffled3).slice(0, 5));
}

// =============================================================================
// Example 5: Searching and Peeking
// =============================================================================

function example5_searchingAndPeeking() {
  console.log("\n=== Example 5: Searching and Peeking ===\n");

  // Create a mock card database
  type Card = { id: CardId; name: string; type: string; cost: number };
  const cardDatabase = new Map<CardId, Card>([
    [
      createCardId("card-1"),
      { id: createCardId("card-1"), name: "Dragon", type: "creature", cost: 5 },
    ],
    [
      createCardId("card-2"),
      {
        id: createCardId("card-2"),
        name: "Fireball",
        type: "spell",
        cost: 3,
      },
    ],
    [
      createCardId("card-3"),
      {
        id: createCardId("card-3"),
        name: "Goblin",
        type: "creature",
        cost: 1,
      },
    ],
    [
      createCardId("card-4"),
      {
        id: createCardId("card-4"),
        name: "Lightning",
        type: "spell",
        cost: 1,
      },
    ],
  ]);

  const deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    Array.from(cardDatabase.keys()),
  );

  // Search for creatures
  const creatures = search(deck, (cardId) => {
    const card = cardDatabase.get(cardId);
    return card?.type === "creature";
  });
  console.log("Creatures in deck:", creatures.length); // 2
  console.log(
    "  -",
    creatures.map((id) => cardDatabase.get(id)?.name),
  ); // ['Dragon', 'Goblin']

  // Search for low-cost cards
  const cheapCards = search(deck, (cardId) => {
    const card = cardDatabase.get(cardId);
    return (card?.cost ?? 0) <= 1;
  });
  console.log("\nCheap cards (cost <= 1):", cheapCards.length); // 2
  console.log(
    "  -",
    cheapCards.map((id) => cardDatabase.get(id)?.name),
  ); // ['Goblin', 'Lightning']

  // Peek at top 3 cards
  const topCards = peek(deck, 3);
  console.log("\nTop 3 cards:", topCards);
  console.log(
    "  -",
    topCards.map((id) => cardDatabase.get(id)?.name),
  );
  console.log(
    "Deck still has:",
    getZoneSize(deck),
    "cards (peek doesn't modify)",
  );
}

// =============================================================================
// Example 6: Milling Cards
// =============================================================================

function example6_milling() {
  console.log("\n=== Example 6: Milling Cards ===\n");

  const cards = Array.from({ length: 10 }, (_, i) =>
    createCardId(`card-${i + 1}`),
  );

  let deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    cards,
  );

  let graveyard = createZone(
    {
      id: createZoneId("graveyard"),
      name: "graveyard",
      visibility: "public",
      ordered: false,
    },
    [],
  );

  console.log("Initial state:");
  console.log("  Deck:", getZoneSize(deck)); // 10
  console.log("  Graveyard:", getZoneSize(graveyard)); // 0

  // Mill 3 cards
  const millResult = mill(deck, graveyard, 3);
  deck = millResult.fromZone;
  graveyard = millResult.toZone;

  console.log("\nAfter milling 3 cards:");
  console.log("  Deck:", getZoneSize(deck)); // 7
  console.log("  Graveyard:", getZoneSize(graveyard)); // 3
  console.log("  Milled cards:", millResult.milledCards); // [card-1, card-2, card-3]

  // Reveal milled cards
  const revealedCards = reveal(millResult.milledCards);
  console.log("  Revealed cards:", revealedCards);
}

// =============================================================================
// Example 7: Finding Cards Across Multiple Zones
// =============================================================================

function example7_findingAcrossZones() {
  console.log("\n=== Example 7: Finding Cards Across Multiple Zones ===\n");

  const card1 = createCardId("card-1");
  const card2 = createCardId("card-2");
  const card3 = createCardId("card-3");

  const hand = createZone(
    {
      id: createZoneId("hand"),
      name: "hand",
      visibility: "private",
      ordered: false,
    },
    [card1],
  );

  const deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    [card2],
  );

  const graveyard = createZone(
    {
      id: createZoneId("graveyard"),
      name: "graveyard",
      visibility: "public",
      ordered: false,
    },
    [],
  );

  const zones = [hand, deck, graveyard];

  // Find cards
  const zone1 = findCardInZones(card1, zones);
  console.log(`card-1 found in: ${zone1?.config.id}`); // hand

  const zone2 = findCardInZones(card2, zones);
  console.log(`card-2 found in: ${zone2?.config.id}`); // deck

  const zone3 = findCardInZones(card3, zones);
  console.log(`card-3 found in: ${zone3?.config.id ?? "not found"}`); // not found
}

// =============================================================================
// Example 8: State Helpers - Player Zones
// =============================================================================

function example8_playerZones() {
  console.log("\n=== Example 8: Player Zones ===\n");

  const player1 = createPlayerId("p1");
  const player2 = createPlayerId("p2");

  // Create empty zones for each player
  const emptyZones = createPlayerZones<Zone>([player1, player2]);
  console.log("Empty zones:", Object.keys(emptyZones)); // ['p1', 'p2']

  // Create with initial values
  const hands = createPlayerZones([player1, player2], () =>
    createZone(
      {
        id: createZoneId("hand"),
        name: "hand",
        visibility: "private",
        ordered: false,
      },
      [],
    ),
  );

  console.log("Player 1 hand size:", getZoneSize(hands[player1])); // 0
  console.log("Player 2 hand size:", getZoneSize(hands[player2])); // 0

  // Create complex zone structures
  type PlayerZones = {
    hand: Zone;
    deck: Zone;
    graveyard: Zone;
  };

  const playerZones = createPlayerZones<PlayerZones>(
    [player1, player2],
    () => ({
      hand: createZone(
        {
          id: createZoneId("hand"),
          name: "hand",
          visibility: "private",
          ordered: false,
        },
        [],
      ),
      deck: createZone(
        {
          id: createZoneId("deck"),
          name: "deck",
          visibility: "secret",
          ordered: true,
        },
        [],
      ),
      graveyard: createZone(
        {
          id: createZoneId("graveyard"),
          name: "graveyard",
          visibility: "public",
          ordered: false,
        },
        [],
      ),
    }),
  );

  console.log("\nPlayer 1 zones:", Object.keys(playerZones[player1])); // ['hand', 'deck', 'graveyard']
  console.log("Player 2 zones:", Object.keys(playerZones[player2])); // ['hand', 'deck', 'graveyard']
}

// =============================================================================
// Example 9: State Helpers - Moving Cards in Flat State
// =============================================================================

function example9_flatStateOperations() {
  console.log("\n=== Example 9: Flat State Operations ===\n");

  type GameState = {
    hand: Zone;
    deck: Zone;
    graveyard: Zone;
    exile: Zone;
  };

  const card1 = createCardId("card-1");
  const card2 = createCardId("card-2");

  const state: GameState = {
    hand: createZone(
      {
        id: createZoneId("hand"),
        name: "hand",
        visibility: "private",
        ordered: false,
      },
      [card1],
    ),
    deck: createZone(
      {
        id: createZoneId("deck"),
        name: "deck",
        visibility: "secret",
        ordered: true,
      },
      [card2],
    ),
    graveyard: createZone(
      {
        id: createZoneId("graveyard"),
        name: "graveyard",
        visibility: "public",
        ordered: false,
      },
      [],
    ),
    exile: createZone(
      {
        id: createZoneId("exile"),
        name: "exile",
        visibility: "public",
        ordered: false,
      },
      [],
    ),
  };

  console.log("Initial state:");
  console.log("  Hand:", getZoneSize(state.hand)); // 1
  console.log("  Graveyard:", getZoneSize(state.graveyard)); // 0

  // Move card from hand to graveyard
  const newState = moveCardInState(state, "hand", "graveyard", card1);

  console.log("\nAfter moving card to graveyard:");
  console.log("  Hand:", getZoneSize(newState.hand)); // 0
  console.log("  Graveyard:", getZoneSize(newState.graveyard)); // 1

  // Find where a card is
  const location = getCardZone(newState, card1);
  console.log(`\ncard-1 is in: ${location}`); // graveyard
}

// =============================================================================
// Example 10: Clearing Zones
// =============================================================================

function example10_clearingZones() {
  console.log("\n=== Example 10: Clearing Zones ===\n");

  const cards = Array.from({ length: 10 }, (_, i) =>
    createCardId(`card-${i + 1}`),
  );

  let zone = createZone(
    {
      id: createZoneId("zone"),
      name: "zone",
      visibility: "public",
      ordered: false,
    },
    cards,
  );

  console.log("Initial size:", getZoneSize(zone)); // 10

  // Clear all cards
  zone = clearZone(zone);

  console.log("After clearing:", getZoneSize(zone)); // 0
  console.log("Cards:", getCardsInZone(zone)); // []
}

// =============================================================================
// Example 11: Complete Game Scenario
// =============================================================================

function example11_completeGameScenario() {
  console.log("\n=== Example 11: Complete Game Scenario ===\n");

  // Setup
  const cards = Array.from({ length: 30 }, (_, i) =>
    createCardId(`card-${i + 1}`),
  );

  let deck = createZone(
    {
      id: createZoneId("deck"),
      name: "deck",
      visibility: "secret",
      ordered: true,
    },
    cards,
  );

  let hand = createZone(
    {
      id: createZoneId("hand"),
      name: "hand",
      visibility: "private",
      ordered: false,
    },
    [],
  );

  let graveyard = createZone(
    {
      id: createZoneId("graveyard"),
      name: "graveyard",
      visibility: "public",
      ordered: false,
    },
    [],
  );

  let field = createZone(
    {
      id: createZoneId("field"),
      name: "field",
      visibility: "public",
      ordered: false,
    },
    [],
  );

  console.log("=== Game Start ===");
  console.log(`Deck: ${getZoneSize(deck)} cards`);

  // Shuffle deck
  console.log("\nShuffling deck...");
  deck = shuffle(deck, "game-seed-123");

  // Draw opening hand (7 cards)
  console.log("Drawing opening hand (7 cards)...");
  let drawResult = draw(deck, hand, 7);
  deck = drawResult.fromZone;
  hand = drawResult.toZone;
  console.log(`Hand: ${getZoneSize(hand)} cards`);
  console.log(`Deck: ${getZoneSize(deck)} cards`);

  // Turn 1: Draw a card
  console.log("\n=== Turn 1 ===");
  drawResult = draw(deck, hand, 1);
  deck = drawResult.fromZone;
  hand = drawResult.toZone;
  console.log(`Drew: ${drawResult.drawnCards[0]}`);
  console.log(`Hand: ${getZoneSize(hand)} cards`);

  // Play a card from hand to field
  const cardToPlay = getCardsInZone(hand)[0];
  console.log(`Playing ${cardToPlay} to field...`);
  const moveResult = moveCard(hand, field, cardToPlay);
  hand = moveResult.toZone;
  field = moveResult.fromZone;
  console.log(`Hand: ${getZoneSize(hand)} cards`);
  console.log(`Field: ${getZoneSize(field)} cards`);

  // Turn 2: Mill 3 cards
  console.log("\n=== Turn 2 ===");
  console.log("Opponent plays mill effect (3 cards)...");
  const millResult = mill(deck, graveyard, 3);
  deck = millResult.fromZone;
  graveyard = millResult.toZone;
  console.log(`Milled: ${millResult.milledCards.join(", ")}`);
  console.log(`Deck: ${getZoneSize(deck)} cards`);
  console.log(`Graveyard: ${getZoneSize(graveyard)} cards`);

  // Turn 3: Card on field is destroyed
  console.log("\n=== Turn 3 ===");
  const cardToDestroy = getCardsInZone(field)[0];
  console.log(`${cardToDestroy} is destroyed...`);
  const destroyResult = moveCard(field, graveyard, cardToDestroy);
  field = destroyResult.fromZone;
  graveyard = destroyResult.toZone;
  console.log(`Field: ${getZoneSize(field)} cards`);
  console.log(`Graveyard: ${getZoneSize(graveyard)} cards`);

  // Final state
  console.log("\n=== Final State ===");
  console.log(`Deck: ${getZoneSize(deck)} cards`);
  console.log(`Hand: ${getZoneSize(hand)} cards`);
  console.log(`Field: ${getZoneSize(field)} cards`);
  console.log(`Graveyard: ${getZoneSize(graveyard)} cards`);
}

// =============================================================================
// Run all examples
// =============================================================================

function main() {
  console.log("==============================================");
  console.log("  Zone Management Examples");
  console.log("==============================================");

  example1_basicZoneOperations();
  example2_movingCards();
  example3_drawingCards();
  example4_shuffling();
  example5_searchingAndPeeking();
  example6_milling();
  example7_findingAcrossZones();
  example8_playerZones();
  example9_flatStateOperations();
  example10_clearingZones();
  example11_completeGameScenario();

  console.log("\n==============================================");
  console.log("  All examples completed successfully!");
  console.log("==============================================\n");
}

// Run if executed directly
if (import.meta.main) {
  main();
}

export {
  example1_basicZoneOperations,
  example2_movingCards,
  example3_drawingCards,
  example4_shuffling,
  example5_searchingAndPeeking,
  example6_milling,
  example7_findingAcrossZones,
  example8_playerZones,
  example9_flatStateOperations,
  example10_clearingZones,
  example11_completeGameScenario,
};
