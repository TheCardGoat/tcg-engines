/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { scroogeMcduckUncleMoneybags } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Scrooge McDuck - Uncle Moneybags", () => {
  it.skip("TREASURE FINDER  Whenever this character quests, you pay 1 {I} less for the next item you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: scroogeMcduckUncleMoneybags.cost,
      play: [scroogeMcduckUncleMoneybags],
    });

    const cardUnderTest = testStore.getCard(scroogeMcduckUncleMoneybags);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
