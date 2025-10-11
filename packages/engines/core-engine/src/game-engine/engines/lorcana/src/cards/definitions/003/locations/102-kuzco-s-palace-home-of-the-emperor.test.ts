import { describe, it } from "bun:test";
import { kuzcosPalaceHomeOfTheEmperor } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kuzco's Palace - Home of the Emperor", () => {
  it.skip("**CITY WALLS** Whenever a character is challenged and banished while here, banish the challenging character.", () => {
    const testStore = new TestStore({
      inkwell: kuzcosPalaceHomeOfTheEmperor.cost,
      play: [kuzcosPalaceHomeOfTheEmperor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      kuzcosPalaceHomeOfTheEmperor.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
