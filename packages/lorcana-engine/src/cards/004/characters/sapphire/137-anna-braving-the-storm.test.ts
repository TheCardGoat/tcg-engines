/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { annaBravingTheStorm } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Anna - Braving the Storm", () => {
  it.skip("**I WAS BORN READY** If you have another Hero character in play, this character gets +1 {L}.", () => {
    const testStore = new TestStore({
      inkwell: annaBravingTheStorm.cost,
      play: [annaBravingTheStorm],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      annaBravingTheStorm.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
