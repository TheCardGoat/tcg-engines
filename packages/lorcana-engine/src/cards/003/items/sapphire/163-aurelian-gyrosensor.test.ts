/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { aurelianGyrosensor } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Aurelian Gyrosensor", () => {
  it.skip("**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    const testStore = new TestStore({
      inkwell: aurelianGyrosensor.cost,
      play: [aurelianGyrosensor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      aurelianGyrosensor.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
