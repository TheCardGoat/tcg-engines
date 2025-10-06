/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { gyroGearlooseGadgetGenius } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Gyro Gearloose - Gadget Genius", () => {
  it.skip("**FOLLOW THE TWISTS OF MY GENIUS BRAIN** {E} - Put an item card from your discard to the top of your deck.", () => {
    const testStore = new TestStore({
      inkwell: gyroGearlooseGadgetGenius.cost,
      play: [gyroGearlooseGadgetGenius],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      gyroGearlooseGadgetGenius.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
