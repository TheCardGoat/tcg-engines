import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { secondStarToTheRight } from "./060-second-star-to-the-right";

describe("Second Star to the Right", () => {
  describe("Chosen player draws 5 cards", () => {
    it("opponent draws 5", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [secondStarToTheRight],
          inkwell: secondStarToTheRight.cost,
        },
        {
          deck: [
            aladdinPrinceAli,
            arielOnHumanLegs,
            healingGlow,
            simbaProtectiveCub,
            tinkerBellPeterPansAlly,
          ],
        },
      );

      expect(
        testEngine.asPlayerOne().playCardForPlayer(secondStarToTheRight, PLAYER_TWO),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(5);
    });

    it("active player draws 5", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [secondStarToTheRight],
          inkwell: secondStarToTheRight.cost,
          deck: [
            aladdinPrinceAli,
            arielOnHumanLegs,
            healingGlow,
            simbaProtectiveCub,
            tinkerBellPeterPansAlly,
          ],
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCardForPlayer(secondStarToTheRight, PLAYER_ONE),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(5);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
    });
  });
});
