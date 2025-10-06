/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { medalOfHeroes } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Medal of Heroes", () => {
  it.skip("**CONGRATULATIONS, SOLDIER**{E}, 2 {I}, Banish this item − Chosen character of yours gets +2 {L} this turn.", () => {
    const testStore = new TestStore({
      inkwell: medalOfHeroes.cost,
      play: [medalOfHeroes],
    });

    const cardUnderTest = testStore.getCard(medalOfHeroes);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
