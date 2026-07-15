import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { aliceCourageousKeyholder } from "./127-alice-courageous-keyholder";

describe("Alice - Courageous Keyholder", () => {
  describe("THIS WAY OUT - When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.", () => {
    it("readies chosen damaged character and applies cant-quest restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [aliceCourageousKeyholder],
        inkwell: aliceCourageousKeyholder.cost,
        play: [{ card: simbaProtectiveCub, damage: 1 }],
      });

      const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p1");

      // Exert the target manually
      testEngine.asServer().manualExertCard(targetId);
      expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(true);

      // Play Alice
      expect(testEngine.asPlayerOne().playCard(aliceCourageousKeyholder)).toBeSuccessfulCommand();

      // Optional trigger should appear in bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept optional and target the damaged character
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Target should be readied
      expect(testEngine.asPlayerOne().isExerted(simbaProtectiveCub)).toBe(false);
      // Target should have cant-quest restriction
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: simbaProtectiveCub,
        restriction: "cant-quest",
      });
    });
  });
});
