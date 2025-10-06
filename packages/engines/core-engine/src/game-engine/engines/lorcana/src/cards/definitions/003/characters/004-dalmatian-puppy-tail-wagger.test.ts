/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { dalmatianPuppyTailWagger } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dalmatian Puppy - Tail Wagger", () => {
  it.skip("**WHERE DID THEY ALL COME FROM?** You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.", () => {
    const testStore = new TestStore({
      inkwell: dalmatianPuppyTailWagger.cost,
      play: [dalmatianPuppyTailWagger],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      dalmatianPuppyTailWagger.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
