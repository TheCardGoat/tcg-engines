import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aladdinVigilantGuard } from "./170-aladdin-vigilant-guard";
import { jimDearBelovedHusband } from "./012-jim-dear-beloved-husband";

// Non-Ally character for negative test
const nonAllyCharacter = createMockCharacter({
  id: "test-non-ally",
  name: "Non-Ally Hero",
  cost: 2,
  strength: 2,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Aladdin - Vigilant Guard", () => {
  it("should have Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [aladdinVigilantGuard],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: aladdinVigilantGuard,
      keyword: "Bodyguard",
    });
  });

  describe("SAFE PASSAGE - Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.", () => {
    it("should remove up to 2 damage from Aladdin when an Ally character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: aladdinVigilantGuard, damage: 3 },
          { card: jimDearBelovedHusband, isDrying: false },
        ],
        inkwell: 7,
        deck: 1,
      });

      const aladdinId = testEngine.findCardInstanceId(aladdinVigilantGuard, "play");

      // Quest with Jim Dear (an Ally character)
      expect(testEngine.asPlayerOne().quest(jimDearBelovedHusband)).toBeSuccessfulCommand();

      // SAFE PASSAGE should trigger (optional)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      // Accept the optional effect
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aladdinVigilantGuard, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Resolve amount choice if prompted (upTo: true)
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
      }

      // Aladdin should have 1 damage remaining (3 - 2 = 1)
      const aladdin = testEngine.asServer().getCard(aladdinId);
      expect(aladdin.damage).toBe(1);
    });

    it("should allow declining the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: aladdinVigilantGuard, damage: 3 },
          { card: jimDearBelovedHusband, isDrying: false },
        ],
        inkwell: 7,
        deck: 1,
      });

      const aladdinId = testEngine.findCardInstanceId(aladdinVigilantGuard, "play");

      // Quest with Jim Dear
      expect(testEngine.asPlayerOne().quest(jimDearBelovedHusband)).toBeSuccessfulCommand();

      // Decline the optional trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(aladdinVigilantGuard, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Aladdin should still have 3 damage
      const aladdin = testEngine.asServer().getCard(aladdinId);
      expect(aladdin.damage).toBe(3);
    });

    it("should NOT trigger when a non-Ally character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: aladdinVigilantGuard, damage: 3 },
          { card: nonAllyCharacter, isDrying: false },
        ],
        inkwell: 7,
        deck: 1,
      });

      const aladdinId = testEngine.findCardInstanceId(aladdinVigilantGuard, "play");

      // Quest with non-Ally character
      expect(testEngine.asPlayerOne().quest(nonAllyCharacter)).toBeSuccessfulCommand();

      // SAFE PASSAGE should NOT trigger
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Aladdin should still have 3 damage
      const aladdin = testEngine.asServer().getCard(aladdinId);
      expect(aladdin.damage).toBe(3);
    });
  });
});
