/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { medalOfHeroes } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";

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
