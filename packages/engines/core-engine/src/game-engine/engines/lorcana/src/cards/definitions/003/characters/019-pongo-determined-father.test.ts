import { describe, expect, it } from "bun:test";
import {
  plutoFriendlyPooch,
  pongoDeterminedFather,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pongo - Determined Father", () => {
  it("**TWILIGHT BARK** Once per turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.", () => {
    const testStore = new TestStore({
      inkwell: 3,
      play: [pongoDeterminedFather],
      deck: [plutoFriendlyPooch],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      pongoDeterminedFather.id,
    );
    const target = testStore.getCard(plutoFriendlyPooch);
    cardUnderTest.activate("TWILIGHT BARK");
    testStore.resolveTopOfStack({ scry: { hand: [target], bottom: [] } });
    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ deck: 0, hand: 1 }),
    );
    expect(
      testStore.store.tableStore.getTable("player_one").inkAvailable(),
    ).toEqual(1);
  });
});
