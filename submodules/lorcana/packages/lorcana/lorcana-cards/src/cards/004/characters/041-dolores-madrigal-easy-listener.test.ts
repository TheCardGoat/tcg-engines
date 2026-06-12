import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { doloresMadrigalEasyListener } from "./041-dolores-madrigal-easy-listener";

const drawnCard = createMockCharacter({
  id: "dolores-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const opponentCharacter = createMockCharacter({
  id: "dolores-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 2,
});

describe("Dolores Madrigal - Easy Listener (set4-041)", () => {
  describe("MAGICAL INFORMANT - When you play this character, if an opponent has an exerted character in play, you may draw a card.", () => {
    it("draws a card when the opponent has an exerted character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [doloresMadrigalEasyListener],
          inkwell: doloresMadrigalEasyListener.cost,
          deck: [drawnCard],
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(doloresMadrigalEasyListener),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(doloresMadrigalEasyListener),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });

    it("does not draw a card when the opponent has no exerted characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [doloresMadrigalEasyListener],
          inkwell: doloresMadrigalEasyListener.cost,
          deck: [drawnCard],
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(doloresMadrigalEasyListener),
      ).toBeSuccessfulCommand();

      // Condition is not met, no bag effect or bag resolves without drawing
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(doloresMadrigalEasyListener),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("can decline the optional draw when the condition is met", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [doloresMadrigalEasyListener],
          inkwell: doloresMadrigalEasyListener.cost,
          deck: [drawnCard],
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(doloresMadrigalEasyListener),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(doloresMadrigalEasyListener, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });
});
