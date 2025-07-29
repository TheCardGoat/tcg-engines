import { describe, expect, it } from "bun:test";
import {
  cruellaDeVilMiserableAsUsual,
  dukeOfWeselton,
  genieTheEverImpressive,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { NnPuppies } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("99 Puppies", () => {
  it("Whenever one of your characters quests this turn, gain 1 lore.", () => {
    const cardsInPlay = [
      genieTheEverImpressive,
      dukeOfWeselton,
      cruellaDeVilMiserableAsUsual,
    ];
    const testStore = new TestStore({
      inkwell: NnPuppies.cost,
      hand: [NnPuppies],
      play: cardsInPlay,
    });

    const cardUnderTest = testStore.getCard(NnPuppies);

    cardUnderTest.playFromHand();

    expect(cardUnderTest.zone).toEqual("discard");

    cardsInPlay.forEach((card, index) => {
      const target = testStore.getCard(card);
      target.quest();

      expect(testStore.store.tableStore.getTable("player_one").lore).toBe(
        (index + 1) * 2,
      );
    });
  });
});
