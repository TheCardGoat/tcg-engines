/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { chiFuImperialAdvisor } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Chi-Fu - Imperial Advisor", () => {
  it.skip("**OVERLY CAUTIOUS** While this character has no damage, he gets +2 {L}.", () => {
    const testStore = new TestStore({
      inkwell: chiFuImperialAdvisor.cost,
      play: [chiFuImperialAdvisor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      chiFuImperialAdvisor.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
