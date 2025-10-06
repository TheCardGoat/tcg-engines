/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { hydrosIceTitan } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hydros - Ice Titan", () => {
  it.skip("**BLIZZARD** {E} − Exert chosen character.", () => {
    const testStore = new TestStore({
      inkwell: hydrosIceTitan.cost,
      play: [hydrosIceTitan],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", hydrosIceTitan.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
