/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arthurTrainedSwordsman,
  herculesHeroInTraining,
  queenOfHeartsCapriciousMonarch,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { brawl } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen of Hearts- Capricious Monarch", () => {
  describe("**OFF WITH THEIR HEADS!** Whenever an opposing character is banished, you may ready this character.", () => {
    it("on challenge", () => {
      const testStore = new TestStore(
        {
          play: [queenOfHeartsCapriciousMonarch, arthurTrainedSwordsman],
        },
        {
          play: [herculesHeroInTraining],
        },
      );

      const cardUnderTest = testStore.getCard(queenOfHeartsCapriciousMonarch);
      const target = testStore.getCard(herculesHeroInTraining);
      const challenger = testStore.getCard(arthurTrainedSwordsman);

      cardUnderTest.updateCardMeta({ exerted: true });
      expect(cardUnderTest.meta.exerted).toEqual(true);

      target.updateCardMeta({ exerted: true });
      expect(target.meta.exerted).toEqual(true);

      challenger.challenge(target);
      expect(target.zone).toEqual("discard");

      testStore.resolveOptionalAbility();
      expect(cardUnderTest.meta.exerted).toBeFalsy();
    });

    it("on removal", () => {
      const testStore = new TestStore(
        {
          inkwell: brawl.cost,
          hand: [brawl],
          play: [queenOfHeartsCapriciousMonarch],
        },
        {
          play: [herculesHeroInTraining],
        },
      );

      const cardUnderTest = testStore.getCard(queenOfHeartsCapriciousMonarch);
      const target = testStore.getCard(herculesHeroInTraining);
      const removal = testStore.getCard(brawl);

      cardUnderTest.updateCardMeta({ exerted: true });
      expect(cardUnderTest.meta.exerted).toEqual(true);

      removal.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] }, true);

      expect(target.zone).toEqual("discard");
      expect(removal.zone).toEqual("discard");

      testStore.resolveOptionalAbility();
      expect(cardUnderTest.meta.exerted).toEqual(false);
    });
  });
});
