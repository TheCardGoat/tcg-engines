import { describe, expect, it } from "bun:test";
import { lastDitchEffort } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Last-Ditch Effort", () => {
  it.skip("Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)", () => {
    const testStore = new TestStore({
      inkwell: lastDitchEffort.cost,
      hand: [lastDitchEffort],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", lastDitchEffort.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
