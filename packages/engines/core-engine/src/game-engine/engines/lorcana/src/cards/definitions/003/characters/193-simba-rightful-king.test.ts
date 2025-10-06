/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { simbaRightfulKing } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
