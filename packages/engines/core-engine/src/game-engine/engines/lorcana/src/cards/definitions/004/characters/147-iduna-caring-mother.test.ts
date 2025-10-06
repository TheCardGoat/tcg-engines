/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { idunaCaringMother } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Iduna - Caring Mother", () => {
  it.skip("**ENDURING LOVE** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
    const testStore = new TestStore({
      inkwell: idunaCaringMother.cost,
      play: [idunaCaringMother],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      idunaCaringMother.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
