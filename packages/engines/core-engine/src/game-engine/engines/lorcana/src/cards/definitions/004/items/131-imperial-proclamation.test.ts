/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { imperialProclamation } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";

describe("Imperial Proclamation", () => {
  it.skip("**CALL TO THE FRONT** Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: imperialProclamation.cost,
      play: [imperialProclamation],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      imperialProclamation.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
