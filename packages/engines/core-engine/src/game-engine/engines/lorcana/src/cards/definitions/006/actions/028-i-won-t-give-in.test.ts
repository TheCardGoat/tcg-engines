import { describe, expect, it } from "bun:test";
import { iWontGiveIn } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
