import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseStandardBearer } from "./185-mickey-mouse-standard-bearer";

const targetCharacter = createMockCharacter({
  id: "mm-sb-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const weakDefender = createMockCharacter({
  id: "mm-sb-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Mickey Mouse - Standard Bearer", () => {
  describe("STAND STRONG - When you play this character, chosen character gains Challenger +2 this turn.", () => {
    it("gives chosen character Challenger +2 when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseStandardBearer],
        play: [targetCharacter],
        inkwell: mickeyMouseStandardBearer.cost,
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(mickeyMouseStandardBearer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Challenger")).toBe(true);
    });
  });
});
