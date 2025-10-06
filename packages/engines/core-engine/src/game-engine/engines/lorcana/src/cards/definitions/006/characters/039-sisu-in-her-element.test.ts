/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { sisuInHerElement } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Sisu - In Her Element", () => {
  it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_", () => {
    const testStore = new TestStore({
      inkwell: sisuInHerElement.cost,
      play: [sisuInHerElement],
    });

    const cardUnderTest = testStore.getCard(sisuInHerElement);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
