/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { herculesTrueHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { theQueenCruelestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import { queensSensorCoreItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

describe("Queen's Sensor Core - Item", () => {
  describe("**SYMBOL OF NOBILITY** At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.", () => {
    it("Should gain 1 lore if you have a Princess or Queen character in play", () => {
      const testStore = new TestStore(
        {},
        {
          play: [queensSensorCoreItem, theQueenCruelestOfAll],
          deck: 1,
        },
      );

      testStore.passTurn();

      expect(testStore.getPlayerLore("player_two")).toBe(1);
    });

    it("Should not gain 1 lore if you do not have a Princess or Queen character in play", () => {
      const testStore = new TestStore(
        {},
        {
          play: [queensSensorCoreItem, herculesTrueHero],
          deck: 1,
        },
      );

      testStore.passTurn();

      expect(testStore.getPlayerLore("player_two")).toBe(0);
    });
  });

  it("**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it’s a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.", () => {
    const testStore = new TestStore({
      inkwell: 2,
      play: [queensSensorCoreItem],
      deck: [theQueenCruelestOfAll],
    });

    const cardUnderTest = testStore.getCard(queensSensorCoreItem);
    const topCard = testStore.getCard(theQueenCruelestOfAll);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ scry: { hand: [topCard] } });

    expect(cardUnderTest.meta.exerted).toBe(true);
    expect(topCard.zone).toBe("hand");
  });
});
