/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { donaldDuckNotAgain } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Donald Duck - Not Again!", () => {
  it("Evasive", () => {
    const testStore = new TestStore({
      inkwell: donaldDuckNotAgain.cost,
      play: [donaldDuckNotAgain],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      donaldDuckNotAgain.id,
    );

    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("**PHOOEY!** This character gets +1 {L} for each 1 damage on him.", async () => {
    const testEngine = new TestEngine({
      inkwell: donaldDuckNotAgain.cost,
      play: [donaldDuckNotAgain],
    });

    await testEngine.setCardDamage(donaldDuckNotAgain, 4);
    expect(testEngine.getPlayerLore()).toBe(0);
    await testEngine.questCard(donaldDuckNotAgain);
    expect(testEngine.getPlayerLore()).toBe(5);
  });
});
