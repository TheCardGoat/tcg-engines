/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { noiAcrobaticBaby } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Noi - Acrobatic Baby", () => {
  it.skip("**FANCY FOOTWORK** Whenever you play an action, this character takes no damage from challenges this turn.", () => {
    const testStore = new TestStore({
      inkwell: noiAcrobaticBaby.cost,
      play: [noiAcrobaticBaby],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", noiAcrobaticBaby.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
