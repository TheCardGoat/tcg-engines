/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { stitchAlienTroublemaker } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
