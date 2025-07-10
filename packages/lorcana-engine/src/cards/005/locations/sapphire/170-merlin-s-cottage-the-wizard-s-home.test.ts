/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { merlinsCottageTheWizardsHome } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
