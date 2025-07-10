/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { kidaCreativeThinker } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Kida - Creative Thinker", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [kidaCreativeThinker],
    });

    const cardUnderTest = testEngine.getCardModel(kidaCreativeThinker);
    expect(cardUnderTest.hasWard).toBe(true);
  });

  it.skip("KEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: kidaCreativeThinker.cost,
      play: [kidaCreativeThinker],
      hand: [kidaCreativeThinker],
    });

    await testEngine.playCard(kidaCreativeThinker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
