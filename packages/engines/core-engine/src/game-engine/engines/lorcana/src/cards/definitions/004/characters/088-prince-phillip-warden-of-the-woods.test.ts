/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { princePhillipWardenOfTheWoods } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Prince Phillip - Warden of the Woods", () => {
  it.skip("**SHINING BEACON** Your other Hero characters gain **Ward**. _(Opponents can't chose them except to challenge.)_", () => {
    const testStore = new TestStore({
      inkwell: princePhillipWardenOfTheWoods.cost,
      play: [princePhillipWardenOfTheWoods],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      princePhillipWardenOfTheWoods.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
