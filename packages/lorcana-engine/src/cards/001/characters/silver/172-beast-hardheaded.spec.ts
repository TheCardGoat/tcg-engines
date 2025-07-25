/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { beastHardheaded } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Beast - Hardheaded", () => {
  it("**DESTRUCTION** When you play this character, you may banish chosen item card.", () => {
    const testStore = new TestStore({
      inkwell: beastHardheaded.cost,
      hand: [beastHardheaded],
      play: [dingleHopper],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", beastHardheaded.id);
    const target = testStore.getByZoneAndId("play", dingleHopper.id);

    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("discard");
  });
});
