/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  cruellaDeVilMiserableAsUsual,
  dukeOfWeselton,
  genieTheEverImpressive,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { NnPuppies } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
