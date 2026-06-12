import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gurgiAppleLover } from "./010-gurgi-apple-lover";

const damagedCharacter = createMockCharacter({
  id: "gurgi-apple-lover-damaged-target",
  name: "Damaged Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Gurgi - Apple Lover", () => {
  describe("HAPPY DAY - When you play this character, you may remove up to 2 damage from chosen character.", () => {
    it("removes up to 2 damage from the chosen character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gurgiAppleLover],
        play: [{ card: damagedCharacter, damage: 3 }],
        inkwell: gurgiAppleLover.cost,
      });

      expect(testEngine.asPlayerOne().playCard(gurgiAppleLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: true,
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(1);
    });

    it("does not remove damage when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gurgiAppleLover],
        play: [{ card: damagedCharacter, damage: 2 }],
        inkwell: gurgiAppleLover.cost,
      });

      expect(testEngine.asPlayerOne().playCard(gurgiAppleLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(2);
    });
  });
});
