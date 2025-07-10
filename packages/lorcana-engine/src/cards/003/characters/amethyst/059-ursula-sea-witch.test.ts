/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ursulaSeaWitch } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
