import { describe, expect, it } from "bun:test";
import { trialsAndTribulations } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mockCharacterCard } from "~/game-engine/engines/lorcana/src/testing/mockCards";

describe("Trials And Tribulations", () => {
  it.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
    // TODO: Requires sing mechanism implementation
    const testEngine = new TestEngine({
      inkwell: trialsAndTribulations.cost,
      play: [trialsAndTribulations],
      hand: [trialsAndTribulations],
    });

    await testEngine.playCard(trialsAndTribulations);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it("Chosen character gets -4 {S} until the start of your next turn.", async () => {
    const testCharacter = {
      ...mockCharacterCard,
      id: "test-char-trials",
      strength: 5,
      willpower: 3,
    };

    const testEngine = new TestEngine({
      inkwell: trialsAndTribulations.cost,
      play: [testCharacter],
      hand: [trialsAndTribulations],
    });

    // Verify initial strength
    expect(testEngine.getCardModel(testCharacter).strength).toBe(5);

    // Play the card - this will add abilities to the stack
    await testEngine.playCard(trialsAndTribulations);

    // Resolve the stack with target selection
    await testEngine.resolveTopOfStack({ targets: [testCharacter] });

    // Verify strength decreased by 4 (5 - 4 = 1)
    expect(testEngine.getCardModel(testCharacter).strength).toBe(1);
  });
});
