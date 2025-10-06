/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  liloMakingAWish,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import { auroraLoreGuardian } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
