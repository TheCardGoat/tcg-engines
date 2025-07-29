import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { ringTheBell } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ring The Bell", () => {
  it("Banish chosen damaged character.", () => {
    const testStore = new TestStore({
      inkwell: ringTheBell.cost,
      hand: [ringTheBell],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ringTheBell.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    target.updateCardDamage(1);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(target.zone).toEqual("discard");
  });

  it("doest NOT Banish non damaged character", () => {
    const testStore = new TestStore({
      inkwell: ringTheBell.cost,
      hand: [ringTheBell],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ringTheBell.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(target.zone).toEqual("play");
  });
});
