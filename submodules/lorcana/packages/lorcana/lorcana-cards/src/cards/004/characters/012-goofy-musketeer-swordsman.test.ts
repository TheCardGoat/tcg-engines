import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyMusketeerSwordsman } from "./012-goofy-musketeer-swordsman";
import { donaldDuckMusketeerSoldier } from "./008-donald-duck-musketeer-soldier";

const nonBodyguardAlly = createMockCharacter({
  id: "goofy-musketeer-swordsman-non-bodyguard-ally",
  name: "Non-Bodyguard Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Goofy - Musketeer Swordsman", () => {
  describe("EN GAWRSH! - Whenever you play a character with Bodyguard, ready this character. He can't quest for the rest of this turn.", () => {
    it("readies Goofy and stops him from questing for the rest of the turn when you play a Bodyguard character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: goofyMusketeerSwordsman, isDrying: false }],
        hand: [donaldDuckMusketeerSoldier],
        inkwell: donaldDuckMusketeerSoldier.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(goofyMusketeerSwordsman)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(goofyMusketeerSwordsman)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(donaldDuckMusketeerSoldier)).toBeSuccessfulCommand();
      const [goofyBag] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolveBag(goofyBag!.id)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(goofyMusketeerSwordsman)).toBe(false);
      expect(testEngine.hasRestriction(goofyMusketeerSwordsman, "cant-quest")).toBe(true);
    });

    it("does not trigger when you play a character without Bodyguard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: goofyMusketeerSwordsman, isDrying: false }],
        hand: [nonBodyguardAlly],
        inkwell: nonBodyguardAlly.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(goofyMusketeerSwordsman)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(goofyMusketeerSwordsman)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(nonBodyguardAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(goofyMusketeerSwordsman)).toBe(true);
      expect(testEngine.hasRestriction(goofyMusketeerSwordsman, "cant-quest")).toBe(false);
    });
  });
});
