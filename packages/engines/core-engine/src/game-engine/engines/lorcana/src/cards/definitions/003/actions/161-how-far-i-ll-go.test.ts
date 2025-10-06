import { describe, expect, it } from "bun:test";
import {
  chiefTui,
  heiheiBoatSnack,
  moanaOfMotunui,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { shieldOfVirtue } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items";
import { howFarIllGo } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("How Far I'll Go", () => {
  it("Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: howFarIllGo.cost,
      hand: [howFarIllGo],
      deck: [shieldOfVirtue, heiheiBoatSnack, chiefTui, moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", howFarIllGo.id);
    const first = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
    const second = testStore.getByZoneAndId("deck", chiefTui.id);
    const third = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
    const fourth = testStore.getByZoneAndId("deck", shieldOfVirtue.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({ scry: { inkwell: [first], hand: [second] } });

    const deck = testStore.store.tableStore
      .getPlayerZoneCards("player_one", "deck")
      .map((card) => card.lorcanitoCard?.name);

    expect(first.zone).toEqual("inkwell");
    expect(first.ready).toEqual(false);

    expect(second.zone).toEqual("hand");

    expect(deck).toEqual([
      fourth.lorcanitoCard?.name,
      third.lorcanitoCard?.name,
    ]);
  });
});
