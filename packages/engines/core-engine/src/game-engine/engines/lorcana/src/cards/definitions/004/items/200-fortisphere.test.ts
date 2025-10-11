import { describe, expect, it } from "bun:test";
import { peteRottenGuy } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { fortisphere } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fortisphere", () => {
  describe("**RESOURCEFUL** When you play this item, you may draw a card.", () => {
    it("should allow the player to draw a card when played", () => {
      const testStore = new TestStore({
        inkwell: fortisphere.cost,
        hand: [fortisphere],
        deck: 2,
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", fortisphere.id);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          hand: 1,
          deck: 1,
          play: 1,
        }),
      );
    });
  });

  describe("**EXTRACT OF STEEL** 1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
    it("should allow the player to banish the item and give a character Bodyguard", () => {
      const testStore = new TestStore(
        {
          inkwell: 1,
          play: [fortisphere, peteRottenGuy],
          deck: 2,
        },
        { deck: 2 },
      );

      const cardUnderTest = testStore.getByZoneAndId("play", fortisphere.id);
      const target = testStore.getByZoneAndId("play", peteRottenGuy.id);
      expect(target.hasBodyguard()).toBeFalsy();

      cardUnderTest.activate();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(cardUnderTest.zone).toEqual("discard");
      expect(target.hasBodyguard()).toBeTruthy();

      testStore.passTurn();
      expect(target.hasBodyguard()).toBeTruthy();

      testStore.passTurn();
      expect(target.hasBodyguard()).toBeFalsy();
    });
  });
});
