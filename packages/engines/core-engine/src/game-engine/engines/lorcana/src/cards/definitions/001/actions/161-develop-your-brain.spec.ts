import { describe, expect, it } from "bun:test";
import { developYourBrain } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  chiefTui,
  heiheiBoatSnack,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Develop Your Brain", () => {
  it("Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.", () => {
    const testStore = new TestStore({
      inkwell: developYourBrain.cost,
      hand: [developYourBrain],
      deck: [shieldOfVirtue, heiheiBoatSnack, chiefTui, moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", developYourBrain.id);
    const first = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
    const second = testStore.getByZoneAndId("deck", chiefTui.id);
    const third = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
    const fourth = testStore.getByZoneAndId("deck", shieldOfVirtue.id);

    cardUnderTest.playFromHand();

    const bottom = [first];

    testStore.resolveTopOfStack({ scry: { bottom, hand: [second] } });

    const deck = testStore.store.tableStore
      .getPlayerZoneCards("player_one", "deck")
      .map((card) => card.lorcanitoCard?.name);

    expect(second.zone).toEqual("hand");
    expect(deck).toEqual([
      first.lorcanitoCard?.name,
      fourth.lorcanitoCard?.name,
      third.lorcanitoCard?.name,
    ]);
  });
});
