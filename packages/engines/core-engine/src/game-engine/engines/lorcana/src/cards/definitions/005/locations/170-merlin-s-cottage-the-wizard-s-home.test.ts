/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { merlinsCottageTheWizardsHome } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";

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
