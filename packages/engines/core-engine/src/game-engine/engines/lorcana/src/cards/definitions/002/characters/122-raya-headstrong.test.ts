/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  pinocchioStarAttraction,
  pinocchioTalkativePuppet,
  rayaHeadstrong,
  theHuntsmanReluctantEnforcer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Raya - Headstrong", () => {
  it("**NOTE TO SELF, DON’T DIE** During your turn, whenever this character banishes another character in a challenge, you may ready this character. She can’t quest for the rest of this turn.", () => {
    const testStore = new TestStore(
      {
        play: [rayaHeadstrong],
      },
      {
        play: [
          theHuntsmanReluctantEnforcer,
          pinocchioTalkativePuppet,
          pinocchioStarAttraction,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("play", rayaHeadstrong.id);

    const target = testStore.getByZoneAndId(
      "play",
      theHuntsmanReluctantEnforcer.id,
      "player_two",
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      pinocchioTalkativePuppet.id,
      "player_two",
    );

    [target, target2].forEach((char) => {
      char.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(char);

      expect(char.zone).toBe("discard");
      expect(cardUnderTest.ready).toBe(true);
    });

    expect(cardUnderTest.hasQuestRestriction).toBe(true);
    expect(cardUnderTest.damage).toBe(target.strength + target2.strength);
  });
});
