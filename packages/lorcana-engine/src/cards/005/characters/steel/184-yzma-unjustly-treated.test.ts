/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { yzmaUnjustlyTreated } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Yzma - Unjustly Treated", () => {
  it.skip("**I'M WARNING YOU!** During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.", () => {
    const testStore = new TestStore({
      inkwell: yzmaUnjustlyTreated.cost,
      play: [yzmaUnjustlyTreated],
    });

    const cardUnderTest = testStore.getCard(yzmaUnjustlyTreated);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
