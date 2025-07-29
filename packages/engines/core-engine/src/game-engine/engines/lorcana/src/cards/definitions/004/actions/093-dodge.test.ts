/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { dodge } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
