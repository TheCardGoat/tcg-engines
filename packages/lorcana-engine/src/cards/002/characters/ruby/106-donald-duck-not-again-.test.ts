/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { donaldDuckNotAgain } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
