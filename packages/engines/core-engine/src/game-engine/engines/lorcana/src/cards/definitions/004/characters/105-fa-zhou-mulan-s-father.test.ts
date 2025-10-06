/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { faZhouMulansFather } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fa Zhou - Mulan's Father", () => {
  it.skip("**WAR WOUND** This character cannot challenge.**HEAD OF FAMILY** {E} - Ready chosen character named Mulan. They can’t quest for the rest of the turn.", () => {
    const testStore = new TestStore({
      inkwell: faZhouMulansFather.cost,
      play: [faZhouMulansFather],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      faZhouMulansFather.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
