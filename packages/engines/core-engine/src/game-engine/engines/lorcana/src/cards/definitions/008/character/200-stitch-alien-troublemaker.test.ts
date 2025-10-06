/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { stitchAlienTroublemaker } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Stitch - Alien Troublemaker", () => {
  it("I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.", async () => {
    const testEngine = new TestEngine(
      {
        play: [stitchAlienTroublemaker],
        deck: 2,
      },
      {
        play: [liloMakingAWish],
      },
    );

    const cardBeingChallenged = testEngine.getCardModel(liloMakingAWish);
    cardBeingChallenged.updateCardMeta({ exerted: true });

    testEngine
      .getCardModel(stitchAlienTroublemaker)
      .challenge(cardBeingChallenged);

    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
    expect(testEngine.getPlayerLore("player_one")).toEqual(1);
  });
});
