/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { guntherInteriorDesigner } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gunther - Interior Designer", () => {
  it.skip("**SAD-EYED PUPPY** When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.", () => {
    const testStore = new TestStore({
      inkwell: guntherInteriorDesigner.cost,
      play: [guntherInteriorDesigner],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      guntherInteriorDesigner.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
