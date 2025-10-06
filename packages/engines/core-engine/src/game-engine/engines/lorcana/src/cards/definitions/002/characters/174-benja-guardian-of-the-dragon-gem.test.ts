/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { benjaGuardianOfTheDragonGem } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { mouseArmor } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Benja- Guardian of the Dragon Gem", () => {
  it("**WE HAVE A CHOICE** When you play this character, you may banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: benjaGuardianOfTheDragonGem.cost,
      hand: [benjaGuardianOfTheDragonGem],
      play: [mouseArmor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      benjaGuardianOfTheDragonGem.id,
    );
    const target = testStore.getByZoneAndId("play", mouseArmor.id);

    cardUnderTest.playFromHand();

    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({
      targetId: target.instanceId,
    });

    expect(target.zone).toEqual("discard");
  });
});
