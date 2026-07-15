import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { madamMimFox } from "./046-madam-mim-fox";

const allyCharacter = createMockCharacter({
  id: "mim-fox-ally",
  name: "Ally Character",
  cost: 2,
});

describe("Madam Mim - Fox", () => {
  it("has Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [madamMimFox],
    });

    expect(testEngine.asPlayerOne().getCard(madamMimFox).hasRush).toBe(true);
  });

  describe("CHASING THE RABBIT - When you play this character, banish her or return another chosen character of yours to your hand", () => {
    it("choosing to banish her sends her to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimFox.cost,
        hand: [madamMimFox],
        play: [allyCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      // The "or" trigger fires; choose option 0 (banish self)
      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 });

      expect(testEngine.asPlayerOne().getCardZone(madamMimFox)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("play");
    });

    it("choosing to return another character sends it to hand and keeps Mim in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimFox.cost,
        hand: [madamMimFox],
        play: [allyCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      // The "or" trigger fires; choose option 1 (return another to hand)
      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [allyCharacter] });

      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(madamMimFox)).toBe("play");
    });

    it("targeting self (invalid due to excludeSelf) when choosing return forces the banish branch", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimFox.cost,
        hand: [madamMimFox],
        play: [allyCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      // Player attempts the exploit: picks option 1 but targets Mim herself (invalid)
      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [madamMimFox] });

      // Option 1 is not legal (self is not a valid candidate), so option 0 (banish) is forced
      expect(testEngine.asPlayerOne().getCardZone(madamMimFox)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(allyCharacter)).toBe("play");
    });
  });
});
