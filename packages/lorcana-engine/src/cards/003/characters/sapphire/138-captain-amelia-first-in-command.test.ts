/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { captainAmeliaFirstInCommand } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Captain Amelia - First in Command", () => {
  it.skip("**DISCIPLINE** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      inkwell: captainAmeliaFirstInCommand.cost,
      play: [captainAmeliaFirstInCommand],
    });

    const cardUnderTest = testStore.getCard(captainAmeliaFirstInCommand);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
