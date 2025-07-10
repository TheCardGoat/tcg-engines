/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pawpsicle", () => {
  it("**JUMBO POP** When you play this item, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: pawpsicle.cost,
      deck: 2,
      hand: [pawpsicle],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", pawpsicle.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 1, play: 1, discard: 0 }),
    );
  });

  it("**THAT'S REDWOOD** Banish this item − Remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      play: [pawpsicle, cinderellaBallroomSensation],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", pawpsicle.id);
    const damagedChar = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );
    damagedChar.updateCardMeta({ damage: 2 });
    expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 2 }));

    cardUnderTest.activate();
    testStore.resolveOptionalAbility();
    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

    testStore.resolveTopOfStack({ targets: [damagedChar] });
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);

    expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
  });
});
