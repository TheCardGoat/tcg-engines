/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { theBeastIsMine } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
