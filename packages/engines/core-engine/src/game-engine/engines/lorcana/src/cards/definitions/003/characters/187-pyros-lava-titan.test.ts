/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { pyrosLavaTitan } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pyros - Lava Titan", () => {
  it.skip("**ERUPTION** During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.", () => {
    const testStore = new TestStore({
      inkwell: pyrosLavaTitan.cost,
      play: [pyrosLavaTitan],
    });

    const cardUnderTest = testStore.getCard(pyrosLavaTitan);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
