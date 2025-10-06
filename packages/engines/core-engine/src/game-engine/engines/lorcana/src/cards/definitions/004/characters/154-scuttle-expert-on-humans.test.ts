/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cleansingRainwater } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import {
  aladdinResoluteSwordsman,
  scuttleExpertOnHumans,
  sisuWiseFriend,
  tukTukCuriousPartner,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scuttle - Expert on Humans", () => {
  it("**LET ME SEE** When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it in your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: scuttleExpertOnHumans.cost,
      hand: [scuttleExpertOnHumans],
      deck: [
        sisuWiseFriend,
        tukTukCuriousPartner,
        aladdinResoluteSwordsman,
        cleansingRainwater,
      ],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      scuttleExpertOnHumans.id,
    );
    const targetCard = testStore.getByZoneAndId("deck", cleansingRainwater.id);
    const otherCards = [
      testStore.getByZoneAndId("deck", sisuWiseFriend.id),
      testStore.getByZoneAndId("deck", aladdinResoluteSwordsman.id),
      testStore.getByZoneAndId("deck", tukTukCuriousPartner.id),
    ];
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      scry: { bottom: otherCards, hand: [targetCard] },
    });

    expect(targetCard.zone).toBe("hand");
    expect(
      testStore.store.tableStore
        .getPlayerZoneCards("player_one", "deck")
        .map((card) => card.lorcanitoCard?.name),
    ).toEqual([
      sisuWiseFriend.name,
      aladdinResoluteSwordsman.name,
      tukTukCuriousPartner.name,
    ]);
  });
});
