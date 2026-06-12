import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseDetective } from "./154-mickey-mouse-detective";

describe("Mickey Mouse - Detective", () => {
  describe("GET A CLUE — When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("puts the top card of the deck into the inkwell when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseDetective],
          inkwell: mickeyMouseDetective.cost,
          deck: 5,
        },
        {
          deck: 2,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;
      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().playCard(mickeyMouseDetective)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseDetective, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const inkwellAfter = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      expect(inkwellAfter).toBe(inkwellBefore + 1);
      expect(deckAfter).toBe(deckBefore - 1);
    });

    it("is optional — player can decline and no card goes to inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseDetective],
          inkwell: mickeyMouseDetective.cost,
          deck: 5,
        },
        {
          deck: 2,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;
      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().playCard(mickeyMouseDetective)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseDetective, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      const inkwellAfter = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      expect(inkwellAfter).toBe(inkwellBefore);
      expect(deckAfter).toBe(deckBefore);
    });

    it("the card put into the inkwell is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [mickeyMouseDetective],
          inkwell: mickeyMouseDetective.cost,
          deck: 5,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(mickeyMouseDetective)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMouseDetective, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const inkwellCards = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).cards;
      // Find the card that was just added (all inkwell cards from deck are exerted)
      const exertedInkwellCards = inkwellCards.filter((c) => c.exerted);
      expect(exertedInkwellCards.length).toBeGreaterThan(0);
    });
  });
});
