import { describe, expect, it } from "bun:test";
import { worldsGreatestCriminalMind } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  goofyKnightForADay,
  pachaVillageLeader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("World's Greatest Criminal Mind", () => {
  it("Banish chosen character with 5 {S} or more.", () => {
    const testStore = new TestStore({
      inkwell: worldsGreatestCriminalMind.cost,
      hand: [worldsGreatestCriminalMind],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      worldsGreatestCriminalMind.id,
    );
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
  });

  it("Can't banish  character with less than 5 {S}.", () => {
    const testStore = new TestStore({
      inkwell: worldsGreatestCriminalMind.cost,
      hand: [worldsGreatestCriminalMind],
      play: [pachaVillageLeader],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      worldsGreatestCriminalMind.id,
    );
    const target = testStore.getByZoneAndId("play", pachaVillageLeader.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("play");
  });
});
