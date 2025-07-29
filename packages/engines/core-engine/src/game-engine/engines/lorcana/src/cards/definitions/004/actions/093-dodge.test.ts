import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { dodge } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dodge!", () => {
  it("Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_", () => {
    const testStore = new TestStore({
      inkwell: dodge.cost,
      hand: [dodge],
      play: [mickeyBraveLittleTailor],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", dodge.id);
    const targetCharacter = testStore.getByZoneAndId(
      "play",
      mickeyBraveLittleTailor.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [targetCharacter] });

    expect(testStore.getZonesCardCount().discard).toBe(1); // Dodge! goes to discard
  });
});
