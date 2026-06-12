import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mauriceWorldfamousInventor } from "./152-maurice-world-famous-inventor";
import { hadesInfernalSchemer } from "./147-hades-infernal-schemer";

describe("Hades - Infernal Schemer", () => {
  describe("IS THERE A DOWNSIDE TO THIS? - When you play this character, you may put chosen opposing character into their player's inkwell facedown.", () => {
    it("puts the chosen opposing character into its owner's inkwell facedown when you accept the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [hadesInfernalSchemer],
          inkwell: hadesInfernalSchemer.cost,
          deck: 1,
        },
        {
          play: [mauriceWorldfamousInventor],
          deck: 1,
        },
      );
      const mauriceId = testEngine.findCardInstanceId(mauriceWorldfamousInventor, "play", "p2");

      expect(testEngine.asPlayerOne().playCard(hadesInfernalSchemer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [mauriceId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mauriceId)).toBe("inkwell");
      expect(testEngine.getCardPublicFaceState(mauriceId, "inkwell", PLAYER_TWO)).toBe("faceDown");
      expect(testEngine.asPlayerTwo().isExerted(mauriceId)).toBe(true);
    });

    it("leaves the opposing character in play when you decline the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [hadesInfernalSchemer],
          inkwell: hadesInfernalSchemer.cost,
          deck: 1,
        },
        {
          play: [mauriceWorldfamousInventor],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(hadesInfernalSchemer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mauriceWorldfamousInventor)).toBe("play");
    });
  });
});
