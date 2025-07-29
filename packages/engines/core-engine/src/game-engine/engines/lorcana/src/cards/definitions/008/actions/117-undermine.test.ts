import { describe, expect, it } from "bun:test";
import { undermine } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Undermine", () => {
  it.skip("Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: undermine.cost,
      play: [undermine],
      hand: [undermine],
    });

    await testEngine.playCard(undermine);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
