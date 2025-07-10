/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { iWontGiveIn } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("I Won't Give In", () => {
  it.skip("(A character with cost 2 or more can {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      inkwell: iWontGiveIn.cost,
      play: [iWontGiveIn],
      hand: [iWontGiveIn],
    });

    await testEngine.playCard(iWontGiveIn);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Return a character card with cost 2 or less from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: iWontGiveIn.cost,
      play: [iWontGiveIn],
      hand: [iWontGiveIn],
    });

    await testEngine.playCard(iWontGiveIn);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
