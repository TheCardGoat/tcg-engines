import { describe, expect, it } from "bun:test";
import {
  bibbidiBobbidiBoo,
  hypnotize,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hypnotize", () => {
  it("Each opponent chooses and discards a card. Draw a card.", () => {
    const testStore = new TestStore(
      {
        deck: 2,
        inkwell: hypnotize.cost,
        hand: [hypnotize],
      },
      {
        deck: 2,
        hand: [bibbidiBobbidiBoo],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", hypnotize.id);
    const target = testStore.getByZoneAndId(
      "hand",
      bibbidiBobbidiBoo.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({ targets: [target] });

    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 0,
        deck: 2,
        discard: 1,
      }),
    );
    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });

  it("Opponent no cards in hand, should still draw", () => {
    const testEngine = new TestEngine(
      {
        deck: 2,
        inkwell: hypnotize.cost,
        hand: [hypnotize],
      },
      {
        deck: 2,
        hand: [],
      },
    );

    testEngine.playCard(hypnotize);

    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 0,
        deck: 2,
        discard: 0,
      }),
    );
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });
});
