import { describe, expect, it } from "bun:test";
import { stealFromRich } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  cruellaDeVilMiserableAsUsual,
  dukeOfWeselton,
  genieTheEverImpressive,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Steal from the Rich", () => {
  it("Whenever one of your characters quests this turn, each opponent loses 1 lore.", () => {
    const cardsInPlay = [
      genieTheEverImpressive,
      dukeOfWeselton,
      cruellaDeVilMiserableAsUsual,
    ];
    const testStore = new TestStore({
      inkwell: stealFromRich.cost,
      hand: [stealFromRich],
      play: cardsInPlay,
    });

    testStore.store.tableStore.getTable("player_two").lore = 3;

    const cardUnderTest = testStore.getByZoneAndId("hand", stealFromRich.id);

    cardUnderTest.playFromHand();

    expect(cardUnderTest.zone).toEqual("discard");

    cardsInPlay.forEach((card, index) => {
      const target = testStore.getByZoneAndId("play", card.id);
      target.quest();

      expect(testStore.store.tableStore.getTable("player_one").lore).toBe(
        index + 1,
      );
      expect(testStore.store.tableStore.getTable("player_two").lore).toBe(
        2 - index,
      );
    });
  });
});
