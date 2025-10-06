/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { fredMascotByDay } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Fred - Mascot by Day", () => {
  it.skip("**HOW COOL IS THAT** Whenever this character is challenged, gain 2 lore.", () => {
    const testStore = new TestStore({
      inkwell: fredMascotByDay.cost,
      play: [fredMascotByDay],
    });

    const cardUnderTest = testStore.getCard(fredMascotByDay);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
