import { describe, expect, it } from "bun:test";
import { glean } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Glaner", () => {
  it.skip("Choisissez un objet et bannissez-le. Son propriétaire gagne 2 éclats de Lore.", () => {
    const testStore = new TestStore({
      inkwell: glean.cost,
      hand: [glean],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", glean.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
