/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madamMimTinyAdversary } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Madam Mim - Tiny Adversary", () => {
  it.skip("Challenger +1 (While challenging, this character gets +1 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [madamMimTinyAdversary],
    });

    const cardUnderTest = testEngine.getCardModel(madamMimTinyAdversary);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it.skip("ZIM ZABBERIM ZIM Your other characters gain Challenger +1.", async () => {
    const testEngine = new TestEngine({
      inkwell: madamMimTinyAdversary.cost,
      play: [madamMimTinyAdversary],
      hand: [madamMimTinyAdversary],
    });

    await testEngine.playCard(madamMimTinyAdversary);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
