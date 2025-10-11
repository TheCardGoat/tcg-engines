import { describe, expect, it } from "bun:test";
import {
  mickeyBraveLittleTailor,
  mickeyMouseDetective,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  mickeyMouseFriendlyFace,
  princeCharmingHeirToTheThrone,
  princeJohnGreediestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { princeJohnsMirror } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince John's Mirror", () => {
  it("**YOU LOOK REGAL** If you have a character named Prince John in play, you pay 1 {I} less to play this item.", () => {
    const testStore = new TestStore({
      inkwell: princeJohnsMirror.cost - 1,
      hand: [princeJohnsMirror],
      play: [princeJohnGreediestOfAll],
    });

    const cardUnderTest = testStore.getCard(princeJohnsMirror);

    cardUnderTest.playFromHand();

    expect(cardUnderTest.zone).toEqual("play");
  });

  describe("**A FEELING OF POWER** At the end of each opponent’s turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.", () => {
    it("Opponent owns the mirror", () => {
      const testStore = new TestStore(
        {
          hand: [
            mickeyMouseTrueFriend,
            mickeyBraveLittleTailor,
            mickeyMouseDetective,
            mickeyMouseFriendlyFace,
            princeCharmingHeirToTheThrone,
          ],
          deck: 5,
        },
        {
          play: [princeJohnsMirror],
          deck: 5,
        },
      );

      testStore.passTurn();
      expect(testStore.store.turnCount).toBe(0);
      expect(testStore.stackLayers).toHaveLength(1);

      const cardToDiscard = testStore.getCard(mickeyMouseFriendlyFace);
      const anotherCardToDiscard = testStore.getCard(mickeyMouseDetective);

      testStore.resolveTopOfStack({
        targets: [cardToDiscard, anotherCardToDiscard],
      });

      expect(testStore.stackLayers).toHaveLength(0);
      expect(testStore.store.turnCount).toBe(1);

      expect(cardToDiscard.zone).toEqual("discard");
      expect(anotherCardToDiscard.zone).toEqual("discard");
    });

    it("Player owns the mirror", () => {
      const testStore = new TestStore(
        {
          hand: [princeJohnGreediestOfAll],
          play: [princeJohnsMirror],
          deck: 5,
        },
        {
          hand: [
            mickeyMouseTrueFriend,
            mickeyBraveLittleTailor,
            mickeyMouseDetective,
            mickeyMouseFriendlyFace,
          ],
          deck: 5,
        },
      );

      const cardToDiscard = testStore.getCard(mickeyMouseFriendlyFace);
      const anotherCardToDiscard = testStore.getCard(mickeyMouseDetective);

      testStore.passTurn();
      expect(testStore.store.turnCount).toBe(1);
      expect(testStore.stackLayers).toHaveLength(0);

      testStore.passTurn();
      expect(testStore.store.turnCount).toBe(1);
      expect(testStore.stackLayers).toHaveLength(1);

      testStore.changePlayer("player_two");
      testStore.resolveTopOfStack({
        targets: [cardToDiscard, anotherCardToDiscard],
      });

      expect(testStore.stackLayers).toHaveLength(0);
      expect(testStore.store.turnCount).toBe(2);

      expect(cardToDiscard.zone).toEqual("discard");
      expect(anotherCardToDiscard.zone).toEqual("discard");
    });
  });
});
