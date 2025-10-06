/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cleansingRainwater } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import { agrabahMarketplace } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations";
import {
  aladdinBraveRescuer,
  aladdinResoluteSwordsman,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
