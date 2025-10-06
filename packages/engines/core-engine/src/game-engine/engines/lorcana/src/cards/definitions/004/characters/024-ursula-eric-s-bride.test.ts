/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { ursulaEricsBride } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Eric's Bride", () => {
  it.skip("**Shift: Discard a song card** _(You may discard a song card to play this on top of one of your characters named Ursula.)_**VANESSA'S DESIGN** Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.", () => {
    const testStore = new TestStore({
      inkwell: ursulaEricsBride.cost,
      play: [ursulaEricsBride],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", ursulaEricsBride.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
