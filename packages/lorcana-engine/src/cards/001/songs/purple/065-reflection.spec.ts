/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  chiefTui,
  heiheiBoatSnack,
  liloMakingAWish,
  moanaOfMotunui,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { reflection } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";

describe("Reflection", () => {
  it("Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.", () => {
    const testStore = new TestStore({
      deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
      hand: [reflection],
      inkwell: reflection.cost,
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", reflection.id);
    const one = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
    const two = testStore.getByZoneAndId("deck", chiefTui.id);
    const three = testStore.getByZoneAndId("deck", moanaOfMotunui.id);

    cardUnderTest.playFromHand();

    const top: CardModel[] = [two, one, three];

    testStore.resolveTopOfStack({ scry: { top } });

    expect(
      testStore.store.tableStore
        .getPlayerZoneCards("player_one", "deck")
        .map((card) => card.lorcanitoCard?.name),
    ).toEqual([
      liloMakingAWish.name,
      ...top.map((card) => card.lorcanitoCard?.name),
    ]);
  });
});
