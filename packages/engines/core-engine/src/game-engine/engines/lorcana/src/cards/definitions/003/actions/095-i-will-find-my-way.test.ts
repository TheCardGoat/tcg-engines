import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { iWillFindMyWay } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("I Will Find My Way", () => {
  it("_(A character with cost 1 or more can {E} to sing this song for free.)_Chosen character of yours gets +2 {S} this turn. They may move to a location for free.", () => {
    const testStore = new TestStore({
      inkwell: iWillFindMyWay.cost,
      hand: [iWillFindMyWay],
      play: [mickeyBraveLittleTailor],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", iWillFindMyWay.id);
    const targetCharacter = testStore.getByZoneAndId(
      "play",
      mickeyBraveLittleTailor.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [targetCharacter] });

    expect(testStore.getZonesCardCount().discard).toBe(1); // I Will Find My Way goes to discard
  });
});
