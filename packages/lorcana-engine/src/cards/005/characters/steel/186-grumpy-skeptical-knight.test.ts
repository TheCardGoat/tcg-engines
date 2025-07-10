/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { grumpySkepticalKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Grumpy - Skeptical Knight", () => {
  it.skip("**BOON OF RESILIENCE** While one of your Knight characters is at a location, that character gains Resist +2. _(Damage dealt to them is reduced by 2)._", () => {
    const testStore = new TestStore({
      inkwell: grumpySkepticalKnight.cost,
      play: [grumpySkepticalKnight],
    });

    const cardUnderTest = testStore.getCard(grumpySkepticalKnight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      inkwell: grumpySkepticalKnight.cost,
      play: [grumpySkepticalKnight],
    });

    const cardUnderTest = testStore.getCard(grumpySkepticalKnight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
