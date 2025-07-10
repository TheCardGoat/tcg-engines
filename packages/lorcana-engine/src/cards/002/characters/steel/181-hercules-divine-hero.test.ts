/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { herculesDivineHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Hercules- Divine Hero", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: herculesDivineHero.cost,

      hand: [herculesDivineHero],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      herculesDivineHero.id,
    );

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({});
  });
});
