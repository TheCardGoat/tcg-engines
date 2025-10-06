/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { peterPansShadowNotSewnOn } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  peteSteamboatRival,
  peteWrestlingChamp,
  simbaAdventurousSuccessor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Pete - Steamboat Rival", () => {
  describe("**SCRAM!** When you play this character, if you have another character named Pete in play, you may banish chosen opposing character.", () => {
    it("Pete in play", () => {
      const testStore = new TestStore(
        {
          inkwell: peteSteamboatRival.cost,
          hand: [peteSteamboatRival],
          play: [peteWrestlingChamp],
        },
        {
          play: [simbaAdventurousSuccessor],
        },
      );

      const cardUnderTest = testStore.getCard(peteSteamboatRival);
      const target = testStore.getCard(simbaAdventurousSuccessor);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();

      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("discard");
    });

    it("No Pete in play", () => {
      const testStore = new TestStore(
        {
          inkwell: peteSteamboatRival.cost,
          hand: [peteSteamboatRival],
          play: [peterPansShadowNotSewnOn],
        },
        {
          play: [simbaAdventurousSuccessor],
        },
      );

      const cardUnderTest = testStore.getCard(peteSteamboatRival);
      const target = testStore.getCard(simbaAdventurousSuccessor);

      cardUnderTest.playFromHand();

      expect(testStore.stackLayers.length).toEqual(0);
      expect(target.zone).toEqual("play");
    });
  });
});
