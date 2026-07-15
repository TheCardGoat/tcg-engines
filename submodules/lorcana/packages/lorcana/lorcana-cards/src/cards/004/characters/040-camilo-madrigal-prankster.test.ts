import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { camiloMadrigalPrankster } from "./040-camilo-madrigal-prankster";

const opponent = createMockCharacter({
  id: "camilo-test-opponent",
  name: "Test Opponent",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Camilo Madrigal - Prankster", () => {
  describe("MANY FORMS - At the start of your turn, you may choose one", () => {
    it("can choose +1 lore this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [camiloMadrigalPrankster], deck: 3 },
        { deck: 2 },
      );

      const baseLore = testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster);

      // Pass both turns to get back to player one's start of turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Resolve the bag entry (the trigger fires at start of turn)
      // Accept the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(camiloMadrigalPrankster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      // Choose option 0: +1 lore this turn
      expect(testEngine.asPlayerOne().respondWithChoice(0)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster)).toBe(baseLore + 1);
    });

    it("can choose Challenger +2 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [camiloMadrigalPrankster], deck: 3 },
        { play: [{ card: opponent, exerted: true }], deck: 2 },
      );

      // Pass both turns to get back to player one's start of turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Accept the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(camiloMadrigalPrankster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      // Choose option 1: Challenger +2 this turn
      expect(testEngine.asPlayerOne().respondWithChoice(1)).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(camiloMadrigalPrankster, "Challenger")).toBe(true);
      expect(testEngine.getKeywordValue(camiloMadrigalPrankster, "Challenger")).toBe(2);
    });

    it("can decline the ability (you may)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [camiloMadrigalPrankster], deck: 3 },
        { deck: 2 },
      );

      const baseLore = testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster);

      // Pass both turns to get back to player one's start of turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(camiloMadrigalPrankster, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Lore should remain unchanged
      expect(testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster)).toBe(baseLore);
      expect(testEngine.hasKeyword(camiloMadrigalPrankster, "Challenger")).toBe(false);
    });

    it("lore bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [camiloMadrigalPrankster], deck: 5 },
        { deck: 4 },
      );

      const baseLore = testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster);

      // Pass both turns to get back to player one's start of turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Accept the optional ability and choose +1 lore
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(camiloMadrigalPrankster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().respondWithChoice(0)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster)).toBe(baseLore + 1);

      // Pass both turns again - the effect should expire
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // The lore bonus should have expired before the new trigger fires
      // Decline the new trigger to isolate the test
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(camiloMadrigalPrankster, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(camiloMadrigalPrankster)).toBe(baseLore);
    });
  });
});
