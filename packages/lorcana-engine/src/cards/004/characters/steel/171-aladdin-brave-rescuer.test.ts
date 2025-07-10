/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { agrabahMarketplace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
import {
  aladdinBraveRescuer,
  aladdinResoluteSwordsman,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Aladdin - Brave Rescuer", () => {
  it("**Shift: Discard a location card** _(You may discard a location card to play this on top of one of your characters named Aladdin.)_", () => {
    const testStore = new TestStore({
      inkwell: 0,
      play: [aladdinResoluteSwordsman],
      hand: [agrabahMarketplace, aladdinBraveRescuer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      aladdinBraveRescuer.id,
    );
    const cardToDiscard = testStore.getByZoneAndId(
      "hand",
      agrabahMarketplace.id,
    );
    const shiftTarget = testStore.getByZoneAndId(
      "play",
      aladdinResoluteSwordsman.id,
    );

    cardUnderTest.shift(shiftTarget, [cardToDiscard]);

    expect(cardUnderTest.zone).toBe("play");
    expect(cardToDiscard.zone).toBe("discard");
  });

  it("**CRASHING THROUGH** Whenever this character quests, you may banish chosen item.", () => {
    const testStore = new TestStore({
      play: [aladdinBraveRescuer, cleansingRainwater],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      aladdinBraveRescuer.id,
    );
    const target = testStore.getByZoneAndId("play", cleansingRainwater.id);
    cardUnderTest.updateCardMeta({ exerted: false });

    cardUnderTest.quest();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("discard");
  });
});
