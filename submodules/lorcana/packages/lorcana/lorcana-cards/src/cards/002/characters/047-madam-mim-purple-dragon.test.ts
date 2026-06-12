import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { madamMimPurpleDragon } from "./047-madam-mim-purple-dragon";

const allyOne = createMockCharacter({
  id: "mim-dragon-ally-1",
  name: "Dragon Ally One",
  cost: 2,
});

const allyTwo = createMockCharacter({
  id: "mim-dragon-ally-2",
  name: "Dragon Ally Two",
  cost: 3,
});

describe("Madam Mim - Purple Dragon", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [madamMimPurpleDragon],
    });

    expect(testEngine.asPlayerOne().getCard(madamMimPurpleDragon).hasEvasive).toBe(true);
  });

  describe("I WIN, I WIN! - When you play this character, banish her or return another 2 chosen characters of yours to your hand", () => {
    it("choosing to banish her sends her to discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimPurpleDragon.cost,
        hand: [madamMimPurpleDragon],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimPurpleDragon)).toBeSuccessfulCommand();

      // The "or" trigger fires; choose option 0 (banish self)
      testEngine.asPlayerOne().resolvePendingByCard(madamMimPurpleDragon);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 0 });

      expect(testEngine.asPlayerOne().getCardZone(madamMimPurpleDragon)).toBe("discard");
    });

    it("choosing to return 2 characters sends them to hand and keeps Mim in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: madamMimPurpleDragon.cost,
        hand: [madamMimPurpleDragon],
        play: [allyOne, allyTwo],
      });

      expect(testEngine.asPlayerOne().playCard(madamMimPurpleDragon)).toBeSuccessfulCommand();

      // The "or" trigger fires; choose option 1 (return 2 to hand)
      testEngine.asPlayerOne().resolvePendingByCard(madamMimPurpleDragon);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [allyOne, allyTwo] });

      expect(testEngine.asPlayerOne().getCardZone(allyOne)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(allyTwo)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(madamMimPurpleDragon)).toBe("play");
    });
  });
});
