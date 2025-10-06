/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { simbaRightfulKing } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Simba - Rightful King", () => {
  it.skip("**TRIUMPHANT STANCE** During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.", () => {
    const testStore = new TestStore({
      inkwell: simbaRightfulKing.cost,
      play: [simbaRightfulKing],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      simbaRightfulKing.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
