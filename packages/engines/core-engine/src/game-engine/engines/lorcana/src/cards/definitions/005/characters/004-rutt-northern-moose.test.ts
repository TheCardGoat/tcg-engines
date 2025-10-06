/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ruttNorthernMoose } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Rutt - Northern Moose", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: ruttNorthernMoose.cost,
      play: [ruttNorthernMoose],
    });

    const cardUnderTest = testStore.getCard(ruttNorthernMoose);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
