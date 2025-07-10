import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "../testing/lorcana-test-engine.ts";

describe("Move: Altering hands", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    testEngine = new LorcanaTestEngine(
      { hand: 7, deck: 10 },
      { hand: 7, deck: 10 },
      { skipPreGame: false },
    );

    testEngine.chooseWhoGoesFirst("player_one");
    expect(testEngine.getCtx().otp).toBe("player_one");
    expect(testEngine.getGameSegment()).toBe("startingAGame");
    expect(testEngine.getGamePhase()).toBe("alterHand");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  it.only("Can't mulligan twice", () => {
    testEngine.changeActivePlayer("player_one");
    testEngine.alterHand([]);
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_two"),
    ).toBe(false);

    testEngine.changeActivePlayer("player_one");
    try {
      testEngine.alterHand([]);
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_two"),
    ).toBe(false);
  });

  it("When both players have altered their hands, the game officially starts", () => {
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(false);
    testEngine.alterHand([]);
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(true);

    testEngine.changeActivePlayer("player_two");
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_two"),
    ).toBe(false);
    testEngine.alterHand([]);
    // The current logic sets the value to undefined, so the check fails
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_two"),
    ).toBe(true);

    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("mainPhase");
  });

  it("Altering whole hand", () => {
    const cardsInHandBeforeAltering: string[] = testEngine.getZone(
      "hand",
      "player_one",
    );

    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(false);
    testEngine.alterHand(cardsInHandBeforeAltering);
    expect(
      testEngine.authoritativeEngine.hasPlayerMulliganed("player_one"),
    ).toBe(true);

    // Check if original hand cards are now in the deck array in the game state
    for (const cardId of cardsInHandBeforeAltering) {
      expect(testEngine.getZone("deck", "player_one")).toContain(cardId);
      expect(testEngine.getZone("hand", "player_one")).not.toContain(cardId);
    }

    // Check if the new hand array in the game state has 7 cards
    expect(testEngine.getZone("hand", "player_one")).toHaveLength(7);

    // Check that none of the original hand cards are in the new hand
    for (const handCardId of testEngine.getZone("hand", "player_one")) {
      expect(cardsInHandBeforeAltering).not.toContain(handCardId);
    }
  });

  it("Partially altering hand", () => {
    const initialHand = [...testEngine.getZone("hand", "player_one")];
    const initialDeck = [...testEngine.getZone("deck", "player_one")];

    expect(initialHand.length).toBe(7);
    expect(initialDeck.length).toBe(10);

    // Alter only the first 3 cards
    const cardsToAlter = initialHand.slice(0, 3);
    const cardsToKeep = initialHand.slice(3);

    expect(cardsToAlter.length).toBe(3);
    expect(cardsToKeep.length).toBe(4);

    testEngine.alterHand(cardsToAlter);

    const finalHand = testEngine.getZone("hand", "player_one");
    const finalDeck = testEngine.getZone("deck", "player_one");

    // Player should still have 7 cards in hand
    expect(finalHand.length).toBe(7);

    // Altered cards should not be in hand
    for (const cardId of cardsToAlter) {
      expect(finalHand).not.toContain(cardId);
    }

    // Non-altered cards should still be in hand
    for (const cardId of cardsToKeep) {
      expect(finalHand).toContain(cardId);
    }

    // The altered cards should be at the bottom of the deck
    const bottomOfDeck = finalDeck.slice(-3);
    for (const cardId of cardsToAlter) {
      expect(bottomOfDeck).toContain(cardId);
    }

    // New cards drawn should be from the top of the initial deck
    const newCardsInHand = finalHand.filter((id) => !initialHand.includes(id));
    expect(newCardsInHand.length).toBe(3);

    const expectedNewCards = initialDeck.slice(0, 3);
    for (const cardId of expectedNewCards) {
      expect(finalHand).toContain(cardId);
    }

    // Final deck should be: initial deck minus the 3 drawn + the 3 altered at bottom
    expect(finalDeck.length).toBe(initialDeck.length);
  });

  it("Altering the hands should respect the priority", () => {
    // Checking that player_one has the priority
    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    testEngine.changeActivePlayer("player_two");
    try {
      testEngine.alterHand([]);
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(testEngine.getPriorityPlayers()).toEqual(["player_one"]);
    expect(testEngine.getTurnPlayer()).toBe("player_one");
  });
});
