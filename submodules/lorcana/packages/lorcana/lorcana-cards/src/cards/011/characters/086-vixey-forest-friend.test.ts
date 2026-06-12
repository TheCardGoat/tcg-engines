import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { todPlayfulKit } from "./090-tod-playful-kit";
import { vixeyForestFriend } from "./086-vixey-forest-friend";

describe("Vixey - Forest Friend", () => {
  describe("Evasive - Only characters with Evasive can challenge this character", () => {
    it("has Evasive keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [vixeyForestFriend],
      });

      const cardUnderTest = testEngine.getCardModel(vixeyForestFriend);
      expect(cardUnderTest.hasEvasive).toBe(true);
    });
  });

  describe("SHOWIN' UP - If you have a character named Tod in play, you pay 1 {I} less to play this character", () => {
    it("costs 1 less when Tod is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: vixeyForestFriend.cost - 1, // Only reduced cost
        play: [todPlayfulKit],
        hand: [vixeyForestFriend],
        deck: 5,
      });

      // Should succeed with reduced cost because Tod is in play
      expect(testEngine.asPlayerOne().playCard(vixeyForestFriend)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(vixeyForestFriend)).toBe("play");
    });

    it("costs full price when Tod is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: vixeyForestFriend.cost - 1, // Only reduced cost - not enough without Tod
        hand: [vixeyForestFriend],
        deck: 5,
      });

      // Should fail - not enough ink without Tod discount
      const result = testEngine.asPlayerOne().playCard(vixeyForestFriend);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(vixeyForestFriend)).toBe("hand");
    });

    it("can be played at full cost without Tod", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: vixeyForestFriend.cost, // Full cost
        hand: [vixeyForestFriend],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(vixeyForestFriend)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(vixeyForestFriend)).toBe("play");
    });
  });
});
