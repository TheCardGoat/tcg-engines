/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { yokaiScientificSupervillain } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Yokai - Scientific Supervillain", () => {
  it.skip("Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Yokai.)", async () => {
    const testEngine = new TestEngine({
      play: [yokaiScientificSupervillain],
    });

    const cardUnderTest = testEngine.getCardModel(yokaiScientificSupervillain);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("NEUROTRANSMITTER You may play items named Microbots for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: yokaiScientificSupervillain.cost,
      play: [yokaiScientificSupervillain],
      hand: [yokaiScientificSupervillain],
    });

    await testEngine.playCard(yokaiScientificSupervillain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("TECHNICAL GAIN Whenever this character quests, draw a card for each opposing character with {S}.", async () => {
    const testEngine = new TestEngine({
      inkwell: yokaiScientificSupervillain.cost,
      play: [yokaiScientificSupervillain],
      hand: [yokaiScientificSupervillain],
    });

    await testEngine.playCard(yokaiScientificSupervillain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
