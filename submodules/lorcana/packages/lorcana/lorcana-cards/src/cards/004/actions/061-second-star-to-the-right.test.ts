import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  arielOnHumanLegs,
  healingGlow,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { secondStarToTheRight } from "./061-second-star-to-the-right";

describe("Second Star to the Right", () => {
  describe("Chosen player draws 5 cards", () => {
    it("creates a player-selection prompt and resolves when the chosen player is submitted later", () => {
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

      expect(testEngine.asPlayerOne().playCard(secondStarToTheRight)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      const [pendingEffect] = testEngine.asPlayerOne().getPendingEffects();
      expect(pendingEffect?.selectionContext).toMatchObject({
        kind: "target-selection",
        playerCandidateIds: expect.arrayContaining([PLAYER_ONE, PLAYER_TWO]),
      });

      expect(
        testEngine.asPlayerOne().resolveEffect(pendingEffect!.id, {
          targets: [PLAYER_TWO],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(5);
    });

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
