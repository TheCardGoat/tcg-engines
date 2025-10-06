/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { annaBravingTheStorm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
