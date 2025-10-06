/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { herculesDivineHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
