// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/04-turn-actions.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { prideLandsPrideRock } from "@tcg/lorcana-cards/cards/003";
import { taffytaMuttonfudgeSourSpeedster } from "@tcg/lorcana-cards/cards/005";
import { hiddenCoveTranquilHaven } from "@tcg/lorcana-cards/cards/004";
import { stitchNewDog } from "@tcg/lorcana-cards/cards/001";

const moveExampleRacer = taffytaMuttonfudgeSourSpeedster;

describe("#### 4. TURN ACTIONS", () => {
  // #### 4.7. Move a Character
  //
  //   4.7.1. A player can move only their characters. A player can move characters only to their locations. A player can’t move opposing characters, and they can’t move their characters to opposing locations.
  //   4.7.2. Players can’t move a character from a location unless that character is being moved to another location.
  //   4.7.3. To move a character to a location, the active player follows the process listed below in order.
  //
  //   4.7.3.1. First, the player chooses one of their characters and one of their locations and declares that the character is moving to that location.
  //   4.7.3.2. Second, the player pays the chosen location’s move cost. If the character can move “for free,” the player ignores all costs to move the character and skips directly to 4.7.3.3.
  //   4.7.3.3. Third, once the cost is paid, the chosen character moves to the chosen location. This marks the end of the process.
  //
  //   4.7.4. Triggered abilities that were added to the bag during the process can now resolve. Once all effects have been resolved, the move is complete.

  describe("#### 4.7. Move a Character", () => {
    it("4.7.1. A player can move only their characters. A player can move characters only to their locations. A player can’t move opposing characters, and they can’t move their characters to opposing locations.   ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielOnHumanLegs, hiddenCoveTranquilHaven],
          inkwell: hiddenCoveTranquilHaven.moveCost,
        },
        {
          play: [simbaProtectiveCub, prideLandsPrideRock],
        },
      );

      const moveOpposingCharacter = testEngine
        .asPlayerOne()
        .moveCharacterToLocation(simbaProtectiveCub, hiddenCoveTranquilHaven) as CommandFailure;
      const moveToOpposingLocation = testEngine
        .asPlayerOne()
        .moveCharacterToLocation(arielOnHumanLegs, prideLandsPrideRock) as CommandFailure;

      expect(moveOpposingCharacter.success).toBe(false);
      expect(moveOpposingCharacter.errorCode).toBe("CHARACTER_NOT_CONTROLLED");
      expect(moveToOpposingLocation.success).toBe(false);
      expect(moveToOpposingLocation.errorCode).toBe("LOCATION_NOT_CONTROLLED");
    });

    it("4.7.2. Players can’t move a character from a location unless that character is being moved to another location.   ", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: arielOnHumanLegs, atLocation: hiddenCoveTranquilHaven },
          hiddenCoveTranquilHaven,
        ],
        inkwell: hiddenCoveTranquilHaven.moveCost,
      });

      const result = testEngine
        .asPlayerOne()
        .moveCharacterToLocation(arielOnHumanLegs, hiddenCoveTranquilHaven) as CommandFailure;

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe("SAME_LOCATION");
      expect(String(testEngine.asPlayerOne().getCardLocationId(arielOnHumanLegs))).toBe(
        String(testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id),
      );
    });

    describe("4.7.3. To move a character to a location, the active player follows the process listed below in order.", () => {
      it("4.7.3.1. First, the player chooses one of their characters and one of their locations and declares that the character is moving to that location.   ", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [arielOnHumanLegs, hiddenCoveTranquilHaven],
          inkwell: hiddenCoveTranquilHaven.moveCost,
        });

        const result = testEngine
          .asPlayerOne()
          .moveCharacterToLocation(arielOnHumanLegs, hiddenCoveTranquilHaven);

        expect(result).toBeSuccessfulCommand();
        expect(String(testEngine.asPlayerOne().getCardLocationId(arielOnHumanLegs))).toBe(
          String(testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id),
        );
      });

      it("4.7.3.2. Second, the player pays the chosen location’s move cost. If the character can move “for free,” the player ignores all costs to move the character and skips directly to 4.7.3.3. ", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [arielOnHumanLegs, prideLandsPrideRock],
          inkwell: [simbaProtectiveCub, hiddenCoveTranquilHaven],
        });
        const firstInkId = testEngine.findCardInstanceId(simbaProtectiveCub, "inkwell", "p1");
        const secondInkId = testEngine.findCardInstanceId(hiddenCoveTranquilHaven, "inkwell", "p1");

        const result = testEngine
          .asPlayerOne()
          .moveCharacterToLocation(arielOnHumanLegs, prideLandsPrideRock);

        expect(result).toBeSuccessfulCommand();
        expect(testEngine.asServer().getCard(firstInkId)?.exerted).toBe(true);
        expect(testEngine.asServer().getCard(secondInkId)?.exerted).toBe(true);
      });

      it("4.7.3.3. Third, once the cost is paid, the chosen character moves to the chosen location. This marks the end of the process.", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [
            { card: arielOnHumanLegs, atLocation: hiddenCoveTranquilHaven },
            hiddenCoveTranquilHaven,
            prideLandsPrideRock,
          ],
          inkwell: [simbaProtectiveCub, stitchNewDog],
        });

        const result = testEngine
          .asPlayerOne()
          .moveCharacterToLocation(arielOnHumanLegs, prideLandsPrideRock);

        expect(result).toBeSuccessfulCommand();
        expect(String(testEngine.asPlayerOne().getCardLocationId(arielOnHumanLegs))).toBe(
          String(testEngine.asPlayerOne().getCard(prideLandsPrideRock).id),
        );
        expect(String(testEngine.asPlayerOne().getCardLocationId(arielOnHumanLegs))).not.toBe(
          String(testEngine.asPlayerOne().getCard(hiddenCoveTranquilHaven).id),
        );
      });

      it("4.7.4. Triggered abilities that were added to the bag during the process can now resolve. Once all effects have been resolved, the move is complete.", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven],
          inkwell: hiddenCoveTranquilHaven.moveCost,
        });

        const moveResult = testEngine
          .asPlayerOne()
          .moveCharacterToLocation(taffytaMuttonfudgeSourSpeedster, hiddenCoveTranquilHaven);

        expect(moveResult).toBeSuccessfulCommand();
        expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      });
    });
  });
});
