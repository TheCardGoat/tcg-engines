import { describe, it } from "bun:test";
import { herculesDivineHero } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
