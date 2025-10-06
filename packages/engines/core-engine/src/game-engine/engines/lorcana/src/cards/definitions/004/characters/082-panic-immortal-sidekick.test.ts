/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { panicImmortalSidekick } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Panic - Immortal Sidekick", () => {
  it.skip("**REPORTING FOR DUTY** While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.", () => {
    const testStore = new TestStore({
      inkwell: panicImmortalSidekick.cost,
      play: [panicImmortalSidekick],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      panicImmortalSidekick.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
