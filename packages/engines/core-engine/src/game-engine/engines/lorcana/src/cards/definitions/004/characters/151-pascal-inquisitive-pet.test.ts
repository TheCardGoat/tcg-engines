/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { pascalInquisitivePet } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Pascal - Inquisitive Pet", () => {
  it.skip("**COLORFUL TACTICS** When you play this character, look at the top 3 cards of your deck and put them back in any order.", () => {
    const testStore = new TestStore({
      inkwell: pascalInquisitivePet.cost,
      hand: [pascalInquisitivePet],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      pascalInquisitivePet.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
