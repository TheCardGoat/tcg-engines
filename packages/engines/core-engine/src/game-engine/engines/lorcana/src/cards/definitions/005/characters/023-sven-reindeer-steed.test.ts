/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { svenReindeerSteed } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Sven - Reindeer Steed", () => {
  it.skip("**REINDEER GAMES** When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: svenReindeerSteed.cost,
      hand: [svenReindeerSteed],
    });

    const cardUnderTest = testStore.getCard(svenReindeerSteed);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
