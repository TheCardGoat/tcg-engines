import { describe, expect, it } from "bun:test";
import { theBeastIsMine } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Beast is Mine!", () => {
  it("Chosen character gains **Reckless** during their next turn.", () => {
    const testStore = new TestStore(
      {
        inkwell: theBeastIsMine.cost,
        hand: [theBeastIsMine],
        play: [moanaOfMotunui],
      },
      {
        deck: 1,
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", theBeastIsMine.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.hasReckless).toEqual(false);

    testStore.store.passTurn(testStore.store.turnPlayer);

    expect(target.hasReckless).toEqual(true);
  });
});
