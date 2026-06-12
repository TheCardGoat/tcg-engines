import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMouseLeaderOfTheBand } from "./015-mickey-mouse-leader-of-the-band";

const targetCharacter = createMockCharacter({
  id: "mm-lb-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Mickey Mouse - Leader of the Band", () => {
  it("has Support keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mickeyMouseLeaderOfTheBand],
    });

    expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseLeaderOfTheBand, "Support")).toBe(true);
  });

  describe("STRIKE UP THE MUSIC - When you play this character, chosen character gains Support this turn.", () => {
    it("gives chosen character Support when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [mickeyMouseLeaderOfTheBand],
        play: [targetCharacter],
        inkwell: mickeyMouseLeaderOfTheBand.cost,
        deck: 3,
      });

      expect(testEngine.asPlayerOne().playCard(mickeyMouseLeaderOfTheBand)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Support")).toBe(true);
    });
  });
});
