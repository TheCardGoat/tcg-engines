import { describe, it } from "bun:test";
import { fredMascotByDay } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
