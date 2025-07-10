/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { worldsGreatestCriminalMind } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import {
  goofyKnightForADay,
  pachaVillageLeader,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
