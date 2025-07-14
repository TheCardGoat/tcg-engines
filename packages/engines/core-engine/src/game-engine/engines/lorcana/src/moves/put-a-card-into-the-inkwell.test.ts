import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  cardWithoutInkwell,
  LorcanaTestEngine,
  testCharacterCard,
} from "../testing/lorcana-test-engine";

// Test card with inkwell symbol (testCharacterCard has inkwell: true)
const cardWithInkwell = testCharacterCard;

describe("Move: Put a Card into the Inkwell", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    // Set up game and progress to main phase where inkwell actions are allowed
    testEngine = new LorcanaTestEngine(
      {
        hand: [cardWithInkwell, cardWithInkwell, cardWithoutInkwell],
        deck: 5,
        inkwell: [],
      },
      { hand: [cardWithInkwell], deck: 5, inkwell: [] },
    );

    // Verify we're now in the main game phase
    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("mainPhase");
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    // Make sure player_one is active
    testEngine.changeActivePlayer("player_one");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it("should successfully put a card with inkwell symbol into the inkwell", () => {
    const handCards = testEngine.getCardsInZone("hand", "player_one");
    const cardWithInkwellInstance = handCards.find(
      (card) => card.card?.inkwell === true,
    );

    expect(cardWithInkwellInstance).toBeDefined();
    expect(cardWithInkwellInstance!.card.inkwell).toBe(true);

    // Initial state verification - we have 3 cards in hand (no mulligan when skipping pre-match)
    testEngine.assertThatZonesContain(
      {
        hand: 3,
        inkwell: 0,
      },
      "player_one",
    );

    // Put card into inkwell
    const response = testEngine.putACardIntoTheInkwell(
      cardWithInkwellInstance!.instanceId,
    );
    expect(response.success).toBe(true);

    // Verify card moved to inkwell
    testEngine.assertThatZonesContain(
      {
        hand: 2,
        inkwell: 1,
      },
      "player_one",
    );

    // Verify the correct card is in the inkwell
    const inkwellCards = testEngine.getCardsInZone("inkwell", "player_one");
    expect(inkwellCards).toHaveLength(1);
    expect(inkwellCards[0].instanceId).toBe(
      cardWithInkwellInstance!.instanceId,
    );
  });

  it("should reject cards without inkwell symbol", () => {
    // For this test, we'll create a separate engine with non-inkwell cards
    testEngine.dispose();
    testEngine = new LorcanaTestEngine(
      { hand: [cardWithoutInkwell], deck: 5, inkwell: [] },
      { hand: [cardWithInkwell], deck: 5, inkwell: [] },
      { skipPreGame: false },
    );

    // Progress to main phase
    testEngine.chooseWhoGoesFirst("player_one");
    testEngine.changeActivePlayer("player_one");
    testEngine.alterHand([]);
    testEngine.changeActivePlayer("player_two");
    testEngine.alterHand([]);
    testEngine.changeActivePlayer("player_one");

    const handCards = testEngine.getCardsInZone("hand", "player_one");
    const cardWithoutInkwellInstance = handCards.find(
      (card) => card.card?.inkwell === false,
    );

    expect(cardWithoutInkwellInstance).toBeDefined();
    expect(cardWithoutInkwellInstance!.card.inkwell).toBe(false);

    // Attempting to put non-inkwell card should fail
    expect(() => {
      testEngine.putACardIntoTheInkwell(cardWithoutInkwellInstance!.instanceId);
    }).toThrow();

    // Verify zones unchanged
    testEngine.assertThatZonesContain(
      {
        hand: 6, // 1 original card + 5 drawn during mulligan
        inkwell: 0,
      },
      "player_one",
    );
  });

  it("should only allow one card into inkwell per turn", () => {
    testEngine.assertThatZonesContain(
      {
        hand: 3,
        inkwell: 0,
      },
      "player_one",
    );

    const cardsWithInkwell = testEngine
      .getCardsInZone("hand", "player_one")
      .filter((card) => card.card?.inkwell === true);

    testEngine.putACardIntoTheInkwell(cardsWithInkwell[0].instanceId);
    testEngine.assertThatZonesContain(
      {
        hand: 2,
        inkwell: 1,
      },
      "player_one",
    );

    // Second attempt should fail (once per turn rule)
    expect(() => {
      testEngine.putACardIntoTheInkwell(cardsWithInkwell[1].instanceId);
    }).toThrow();

    // Verify only one card moved, in other words, zones unchanged
    testEngine.assertThatZonesContain(
      {
        hand: 2,
        inkwell: 1,
      },
      "player_one",
    );
  });

  it("should reject card not in player's hand", () => {
    const player2Cards = testEngine.getCardsInZone("hand", "player_two");
    const player2Card = player2Cards[0];

    expect(player2Card).toBeDefined();

    // Player one trying to put player two's card into inkwell should fail
    expect(() => {
      testEngine.putACardIntoTheInkwell(player2Card.instanceId);
    }).toThrow();

    // Verify zones unchanged
    testEngine.assertThatZonesContain(
      {
        hand: 3,
        inkwell: 0,
      },
      "player_one",
    );

    testEngine.assertThatZonesContain(
      {
        hand: 1, // Player 2 starts with 1 card (no mulligan when skipping pre-match)
        inkwell: 0,
      },
      "player_two",
    );
  });

  it("should reject non-existent card instance", () => {
    const fakeInstanceId = "fake-instance-id-12345";

    expect(() => {
      testEngine.putACardIntoTheInkwell(fakeInstanceId);
    }).toThrow();

    // Verify zones unchanged
    testEngine.assertThatZonesContain(
      {
        hand: 3,
        inkwell: 0,
      },
      "player_one",
    );
  });

  it("should update turn actions state correctly", () => {
    const handCards = testEngine.getCardsInZone("hand", "player_one");
    const cardWithInkwellInstance = handCards.find(
      (card) => card.card?.inkwell === true,
    );

    expect(cardWithInkwellInstance).toBeDefined();

    // Check initial turn actions state
    const initialState = testEngine.authoritativeEngine.getGameState();
    expect(initialState.G.turnActions?.putCardIntoInkwell).toBeFalsy();

    // Put card into inkwell
    const response = testEngine.putACardIntoTheInkwell(
      cardWithInkwellInstance!.instanceId,
    );
    expect(response.success).toBe(true);

    // Check turn actions state is updated
    const updatedState = testEngine.authoritativeEngine.getGameState();
    expect(updatedState.G.turnActions?.putCardIntoInkwell).toBe(true);
  });

  it("should work during main phase", () => {
    // Verify we're in the main phase
    expect(testEngine.getGamePhase()).toBe("mainPhase");

    const handCards = testEngine.getCardsInZone("hand", "player_one");
    const cardWithInkwellInstance = handCards.find(
      (card) => card.card?.inkwell === true,
    );

    expect(cardWithInkwellInstance).toBeDefined();

    // Should work in main phase
    const response = testEngine.putACardIntoTheInkwell(
      cardWithInkwellInstance!.instanceId,
    );
    expect(response.success).toBe(true);
  });

  it("should only work on the active player's turn", () => {
    // Currently player_one has priority
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    const player1Cards = testEngine.getCardsInZone("hand", "player_one");
    const cardWithInkwellInstance = player1Cards.find(
      (card) => card.card?.inkwell === true,
    );

    expect(cardWithInkwellInstance).toBeDefined();

    // Should work for the turn player
    const response = testEngine.putACardIntoTheInkwell(
      cardWithInkwellInstance!.instanceId,
    );
    expect(response.success).toBe(true);
  });
});
