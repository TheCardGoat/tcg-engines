// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/04-turn-actions.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  controlYourTemper,
  simbaProtectiveCub,
  stitchNewDog,
  teKTheBurningOne,
} from "@tcg/lorcana-cards/cards/001";
import {
  cruellaDeVilPerfectlyWretched,
  flynnRiderHisOwnBiggestFan,
  grandDukeAdvisorToTheKing,
  improvise,
  thePrinceNeverGivesUp,
} from "@tcg/lorcana-cards/cards/002";
import { annaIceBreaker } from "@tcg/lorcana-cards/cards/007";
import { microbots } from "@tcg/lorcana-cards/cards/006";
import { rollyChubbyPuppy } from "@tcg/lorcana-cards/cards/008";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";

const chosenQuester = annaIceBreaker;
const recklessQuester = teKTheBurningOne;
const negativeLoreQuester = flynnRiderHisOwnBiggestFan;

describe("#### 4. TURN ACTIONS", () => {
  describe("#### 4.5. Quest", () => {
    it("4.5.1.2. Second, the player checks for any restrictions that prevent them from questing.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [recklessQuester],
      });

      const result = testEngine.asPlayerOne().quest(recklessQuester) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("RECKLESS_CANT_QUEST");
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(recklessQuester)).toBe(false);
    });

    it("4.5.1.3. Third, the player exerts the questing character.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chosenQuester],
      });

      expect(testEngine.asPlayerOne().quest(chosenQuester)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(chosenQuester)).toBe(true);
    });

    it("4.5.1.4. Fourth, the player gains lore equal to the {L} of the questing character. This marks the end of the process.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [chosenQuester],
      });

      expect(testEngine.asPlayerOne().quest(chosenQuester)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(chosenQuester.lore);
    });

    it("4.5.2. Once the lore is gained by the questing player, the questing character has “quested.” Triggered abilities that were added to the bag during the process can now resolve.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [rollyChubbyPuppy],
          inkwell: [stitchNewDog],
          play: [cruellaDeVilPerfectlyWretched],
        },
        {
          play: [simbaProtectiveCub],
        },
      );

      expect(testEngine.asPlayerOne().quest(cruellaDeVilPerfectlyWretched)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(cruellaDeVilPerfectlyWretched.lore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("4.5.3.1. If a questing character has a negative lore value, the questing player gains no lore.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: negativeLoreQuester, isDrying: false }],
          lore: 5,
        },
        {
          hand: [
            controlYourTemper,
            improvise,
            grandDukeAdvisorToTheKing,
            thePrinceNeverGivesUp,
            microbots,
          ],
        },
      );

      expect(testEngine.asServer().quest(PLAYER_ONE, negativeLoreQuester)).toBeSuccessfulCommand();

      expect(testEngine.asServer().isExerted(negativeLoreQuester)).toBe(true);
      expect(testEngine.asServer().getLore(PLAYER_ONE)).toBe(5);
    });
  });
});
