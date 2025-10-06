/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { ursulaSeaWitch } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ursula - Sea Witch", () => {
  it.skip("**YOU'RE TOO LATE** Whenever this character quests, chosen opposing character can't ready at the start of their next turn.", () => {
    const testStore = new TestStore({
      inkwell: ursulaSeaWitch.cost,
      play: [ursulaSeaWitch],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", ursulaSeaWitch.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
