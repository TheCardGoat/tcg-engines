/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dalmatianPuppyTailWagger } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
