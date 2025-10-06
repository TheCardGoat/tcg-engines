/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { merlinsCottageTheWizardsHome } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin's Cottage - The Wizard's Home", () => {
  it.skip("**KNOWLEDGE IS POWER** Each player plays with the top card of their deck face up.", () => {
    const testStore = new TestStore({
      inkwell: merlinsCottageTheWizardsHome.cost,
      play: [merlinsCottageTheWizardsHome],
    });

    const cardUnderTest = testStore.getCard(merlinsCottageTheWizardsHome);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
