import { describe, it } from "bun:test";
import { annaBravingTheStorm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Anna - Braving the Storm", () => {
  it.skip("**I WAS BORN READY** If you have another Hero character in play, this character gets +1 {L}.", () => {
    const testStore = new TestStore({
      inkwell: annaBravingTheStorm.cost,
      play: [annaBravingTheStorm],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      annaBravingTheStorm.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
