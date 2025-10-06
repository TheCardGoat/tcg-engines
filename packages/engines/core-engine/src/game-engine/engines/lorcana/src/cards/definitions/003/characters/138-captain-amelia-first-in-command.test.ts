/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { captainAmeliaFirstInCommand } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
