import { describe, expect, it } from "bun:test";
import { candyDrift } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mockCharacterCard } from "~/game-engine/engines/lorcana/src/testing/mockCards";

describe("Candy Drift", () => {
  it("Draw a card. Chosen character of yours gets +5 {S} this turn.", async () => {
    const testCharacter = {
      ...mockCharacterCard,
      id: "test-char-candy-drift",
      strength: 3,
      willpower: 3,
    };

    const testEngine = new TestEngine({
      inkwell: candyDrift.cost,
      play: [testCharacter],
      hand: [candyDrift],
      deck: 10,
    });

    // Play the card - this will add abilities to the stack
    await testEngine.playCard(candyDrift);

    // Resolve the stack with target selection
    const targetCard = testEngine.getCardModel(testCharacter);
    testEngine.resolveTopOfStack({ targetId: targetCard.instanceId });

    // Verify the character received +5 strength
    expect(testEngine.getCardModel(testCharacter).strength).toBe(
      testCharacter.strength + 5,
    );

    // Verify a card was drawn
    expect(testEngine.getZonesCardCount().hand).toBe(1);

    // TODO: Test end-of-turn banish once triggered ability system is implemented
  });

  it("Draws a card without a target for rest of it", async () => {
    const testEngine = new TestEngine({
      inkwell: candyDrift.cost,
      play: [],
      hand: [candyDrift],
      deck: 10,
    });

    await testEngine.playCard(candyDrift);

    // Resolve the stack without selecting a target (targets are optional)
    testEngine.resolveTopOfStack();

    expect(testEngine.getZonesCardCount().hand).toBe(1);
  });
});
