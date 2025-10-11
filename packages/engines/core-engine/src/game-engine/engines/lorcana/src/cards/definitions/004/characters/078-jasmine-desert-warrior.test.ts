import { describe, it } from "bun:test";
import { jasmineDesertWarrior } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jasmine - Desert Warrior", () => {
  it.skip("**SMART MANEUVER** When you play this character and each time she is challenged, each opponent chooses and discards a card.", () => {
    const testStore = new TestStore({
      inkwell: jasmineDesertWarrior.cost,
      hand: [jasmineDesertWarrior],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      jasmineDesertWarrior.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
