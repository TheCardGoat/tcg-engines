/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { aurelianGyrosensor } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";

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
