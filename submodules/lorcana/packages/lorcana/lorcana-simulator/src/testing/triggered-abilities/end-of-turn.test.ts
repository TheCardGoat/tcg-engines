import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { meekoSkittishScrounger } from "@tcg/lorcana-cards/cards/011";

const handCard = createMockCharacter({
  id: "eot-hand-card",
  name: "Hand Card",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("BOTTOMLESS PIT - Meeko, Skittish Scrounger - At the end of your turn, if this character is exerted, choose and discard a card or banish him.", () => {
  it("should trigger at end of turn when this character is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: meekoSkittishScrounger, isDrying: false }],
      hand: [handCard],
      deck: 2,
    });

    // Quest with Meeko to exert him
    expect(testEngine.asPlayerOne().quest(meekoSkittishScrounger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(meekoSkittishScrounger)).toBe(true);

    // Pass turn triggers end-of-turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Should have a bag effect for the choice (discard or banish)
    const bagCount = testEngine.asPlayerOne().getBagCount();
    expect(bagCount).toBeGreaterThanOrEqual(1);
  });

  it("should not require a choice when this character is NOT exerted (ability.condition fails)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: meekoSkittishScrounger, isDrying: false }],
      hand: [handCard],
      deck: 2,
    });

    // Don't quest, Meeko stays ready
    expect(testEngine.asPlayerOne().isExerted(meekoSkittishScrounger)).toBe(false);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getCardZone(meekoSkittishScrounger)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("hand");
  });

  it("with exerted Meeko and no cards in hand, resolves to banish (discard branch not legal)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: meekoSkittishScrounger, isDrying: false }],
      hand: [],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(meekoSkittishScrounger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(meekoSkittishScrounger)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.asPlayerOne().getCardZone(meekoSkittishScrounger)).toBe("discard");
  });

  it("should allow choosing to discard a card (option 1)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: meekoSkittishScrounger, isDrying: false }],
      hand: [handCard],
      deck: 2,
    });

    // Quest to exert Meeko
    expect(testEngine.asPlayerOne().quest(meekoSkittishScrounger)).toBeSuccessfulCommand();

    // Pass turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Choose option 1: discard a card
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          choiceIndex: 0,
          targets: [handCard],
        }),
    ).toBeSuccessfulCommand();

    // Hand card should be in discard
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");
    // Meeko should still be in play
    expect(testEngine.asPlayerOne().getCardZone(meekoSkittishScrounger)).toBe("play");
  });

  it("should allow choosing to banish Meeko (option 2)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: meekoSkittishScrounger, isDrying: false }],
      hand: [handCard],
      deck: 2,
    });

    // Quest to exert
    expect(testEngine.asPlayerOne().quest(meekoSkittishScrounger)).toBeSuccessfulCommand();

    // Pass turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Choose option 2: banish Meeko
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          choiceIndex: 1,
        }),
    ).toBeSuccessfulCommand();

    // Meeko should be in discard
    expect(testEngine.asPlayerOne().getCardZone(meekoSkittishScrounger)).toBe("discard");
    // Hand card should still be in hand
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("hand");
  });
});
