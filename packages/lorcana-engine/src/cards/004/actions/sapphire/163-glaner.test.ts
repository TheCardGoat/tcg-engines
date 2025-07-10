/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { glaner } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Glaner", () => {
  it.skip("Choisissez un objet et bannissez-le. Son propriétaire gagne 2 éclats de Lore.", () => {
    const testStore = new TestStore({
      inkwell: glaner.cost,
      hand: [glaner],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", glaner.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
