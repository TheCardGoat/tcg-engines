import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theQueenWickedAndVain } from "./035-the-queen-wicked-and-vain";

const drawnCard = createMockCharacter({
  id: "the-queen-wicked-drawn-card",
  name: "The Queen Drawn Card",
  cost: 1,
});

describe.skip("The Queen - Wicked and Vain", () => {
  describe("I SUMMON THEE — {E} — Draw a card.", () => {
    it("draws a card when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenWickedAndVain, isDrying: false }],
        deck: [drawnCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, {
          ability: "I SUMMON THEE",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(theQueenWickedAndVain)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    });

    it("exerts The Queen when the ability is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenWickedAndVain, isDrying: false }],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, {
          ability: "I SUMMON THEE",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(theQueenWickedAndVain)).toBe(true);
    });

    it("cannot activate when already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: theQueenWickedAndVain, exerted: true, isDrying: false }],
        deck: [drawnCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, {
          ability: "I SUMMON THEE",
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("cannot activate while still drying (just played)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [theQueenWickedAndVain],
        deck: [drawnCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain, {
          ability: "I SUMMON THEE",
        }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });
});
