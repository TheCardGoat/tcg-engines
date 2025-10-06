/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { beastHardheaded } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { dingleHopper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/items";

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
