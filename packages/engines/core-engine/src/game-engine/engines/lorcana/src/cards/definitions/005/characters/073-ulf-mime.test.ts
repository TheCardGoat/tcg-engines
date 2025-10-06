/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ulfMime } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Ulf - Mime", () => {
  it.skip("**SILENT PERFORMANCE** This character can't {E} to sing songs.", () => {
    const testStore = new TestStore({
      inkwell: ulfMime.cost,
      play: [ulfMime],
    });

    const cardUnderTest = testStore.getCard(ulfMime);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
