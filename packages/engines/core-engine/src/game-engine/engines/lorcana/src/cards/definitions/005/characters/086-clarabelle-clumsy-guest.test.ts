/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { clarabelleClumsyGuest } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Clarabelle - Clumsy Guest", () => {
  it.skip("**BUTTERFINGER** When you play this character, you may pay to {I} to banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: clarabelleClumsyGuest.cost,
      hand: [clarabelleClumsyGuest],
    });

    const cardUnderTest = testStore.getCard(clarabelleClumsyGuest);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
