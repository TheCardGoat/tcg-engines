/**
 * Example: Test Template for Lorcana Cards
 *
 * This template shows how to structure tests for different card ability types.
 */

import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { cardToTest } from "./card-to-test.ts";
import { supportCard } from "./support-card.ts";

describe("Card Name - Card Title", () => {
  // Test 1: Basic on-play trigger
  it("triggers ability when played", () => {
    // ARRANGE: Set up the game state
    const testEngine = new TestEngine({
      hand: [cardToTest],
    });

    // ACT: Play the card
    testEngine.playCard(cardToTest);

    // ASSERT: Verify the effect
    expect(/* result */).toBe(/* expected */);
  });

  // Test 2: Conditional ability - positive case
  it("gains keyword when condition is met", () => {
    const testEngine = new TestEngine({
      play: [cardToTest, supportCard], // Condition is met
    });

    const card = testEngine.getByName("cardToTest");
    expect(card.hasKeyword("support")).toBe(true);
  });

  // Test 3: Conditional ability - negative case
  it("does not gain keyword when condition is not met", () => {
    const testEngine = new TestEngine({
      play: [cardToTest], // Condition not met
    });

    const card = testEngine.getByName("cardToTest");
    expect(card.hasKeyword("support")).toBe(false);
  });

  // Test 4: Optional ability - choose to activate
  it("can choose to activate optional ability", () => {
    const testEngine = new TestEngine({
      hand: [cardToTest],
    });

    testEngine.playCard(cardToTest, {
      chooseOptional: true,
    });

    expect(/* effect happened */).toBe(true);
  });

  // Test 5: Optional ability - choose not to activate
  it("can choose not to activate optional ability", () => {
    const testEngine = new TestEngine({
      hand: [cardToTest],
    });

    testEngine.playCard(cardToTest, {
      chooseOptional: false,
    });

    expect(/* effect did not happen */).toBe(true);
  });

  // Test 6: Targeting ability
  it("applies effect to chosen target", () => {
    const testEngine = new TestEngine({
      hand: [cardToTest],
      play: [targetCard],
    });

    testEngine.playCard(cardToTest, {
      targets: [targetCard],
    });

    expect(targetCard.strength).toBe(/* expected value */);
  });

  // Test 7: Quest trigger
  it("triggers ability when character quests", () => {
    const testEngine = new TestEngine({
      play: [cardToTest],
    });

    const card = testEngine.getByName("cardToTest");
    testEngine.quest(card);

    expect(/* effect result */).toBe(/* expected */);
  });
});
