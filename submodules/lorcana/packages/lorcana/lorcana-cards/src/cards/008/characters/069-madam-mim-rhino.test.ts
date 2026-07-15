import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { madamMimRhino } from "./069-madam-mim-rhino";
import { madamMimUpToNoGood } from "./059-madam-mim-up-to-no-good";

const otherCharacter = createMockCharacter({
  id: "mim-rhino-ally",
  name: "Other Character",
  cost: 2,
});

describe("Madam Mim - Rhino", () => {
  it("has Shift 2 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [madamMimRhino],
    });

    expect(testEngine.asPlayerOne().hasKeyword(madamMimRhino, "Shift")).toBe(true);
  });

  describe("MAKE WAY, COMING THROUGH! - When you play this character, banish her or return another chosen character of yours to your hand.", () => {
    it("choosing to banish her sends her to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimRhino.cost,
        hand: [madamMimRhino],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimRhino)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimRhino);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 });

      expect(testEngine.asPlayerOne().getCardZone(madamMimRhino)).toBe("discard");
    });

    it("choosing to return another character sends it to hand and keeps Mim in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimRhino.cost,
        hand: [madamMimRhino],
        play: [otherCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimRhino)).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimRhino);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [otherCharacter] });

      expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(madamMimRhino)).toBe("play");
    });

    it("can be played via Shift and still triggers the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        hand: [madamMimRhino],
        play: [madamMimUpToNoGood, otherCharacter],
      });

      const shiftTarget = testEngine.findCardInstanceId(madamMimUpToNoGood, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(madamMimRhino, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      testEngine.asPlayerOne().resolvePendingByCard(madamMimRhino);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [otherCharacter] });

      expect(testEngine.asPlayerOne().getCardZone(otherCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(madamMimRhino)).toBe("play");
    });
  });
});
