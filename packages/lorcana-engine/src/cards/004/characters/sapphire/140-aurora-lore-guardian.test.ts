/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { auroraLoreGuardian } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Aurora - Lore Guardian", () => {
  it("**ROYAL ASSORTMENT** {E} one of your items – look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
    const testEngine = new TestEngine({
      play: [auroraLoreGuardian, pawpsicle],
      deck: [liloMakingAWish, stichtNewDog],
    });

    const cardUnderTest = testEngine.getCardModel(auroraLoreGuardian);
    const itemToPayCost = testEngine.getCardModel(pawpsicle);
    const first = testEngine.getCardModel(liloMakingAWish);

    await testEngine.activateCard(cardUnderTest, {
      ability: "ROYAL INVENTORY",
      costs: [itemToPayCost],
    });

    await testEngine.resolveTopOfStack({ scry: { bottom: [liloMakingAWish] } });

    const deck = testEngine.store.tableStore.getPlayerZoneCards(
      "player_one",
      "deck",
    );

    expect(deck[0]).toEqual(first);
  });
});
