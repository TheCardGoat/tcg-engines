import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jasmineHeirOfAgrabah } from "./151-jasmine-heir-of-agrabah";

const damagedAlly = createMockCharacter({
  id: "jasmine-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Jasmine - Heir of Agrabah", () => {
  describe("I'M A FAST LEARNER - When you play this character, remove up to 1 damage from chosen character", () => {
    it("removes 1 damage from chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jasmineHeirOfAgrabah.cost,
        hand: [jasmineHeirOfAgrabah],
        play: [{ card: damagedAlly, damage: 2 }],
      });

      testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah);

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(jasmineHeirOfAgrabah);
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] });
      }

      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(jasmineHeirOfAgrabah)).toBe("play");
    });

    it("does not block the game when played with no valid targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jasmineHeirOfAgrabah.cost,
        hand: [jasmineHeirOfAgrabah],
      });

      testEngine.asPlayerOne().playCard(jasmineHeirOfAgrabah);
      expect(testEngine.asPlayerOne().getCardZone(jasmineHeirOfAgrabah)).toBe("play");
    });
  });
});
