/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heiheiBoatSnack } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { heiheiBumblingRooster } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Heihei - Bumbling Rooster", () => {
  describe("**LET’S FATTEN YOU UP** When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("Opponent has more than you", () => {
      const testStore = new TestStore(
        {
          inkwell: heiheiBumblingRooster.cost,
          hand: [heiheiBumblingRooster],
          deck: [heiheiBoatSnack],
        },
        {
          inkwell: heiheiBumblingRooster.cost + 1,
        },
      );

      const cardUnderTest = testStore.getCard(heiheiBumblingRooster);
      const target = testStore.getCard(heiheiBoatSnack);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();

      expect(target.zone).toEqual("inkwell");
      expect(target.ready).toEqual(false);
    });

    it("Opponent has same as you", () => {
      const testStore = new TestStore(
        {
          inkwell: heiheiBumblingRooster.cost,
          hand: [heiheiBumblingRooster],
          deck: [heiheiBoatSnack],
        },
        {
          inkwell: heiheiBumblingRooster.cost,
        },
      );

      const cardUnderTest = testStore.getCard(heiheiBumblingRooster);
      const target = testStore.getCard(heiheiBoatSnack);

      cardUnderTest.playFromHand();
      expect(testStore.stackLayers).toHaveLength(0);
      expect(target.zone).toEqual("deck");
    });
  });
});
