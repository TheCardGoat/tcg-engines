import { describe, it } from "bun:test";
import { scrump } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scrump", () => {
  it.skip("I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: scrump.cost,
      play: [scrump],
      hand: [scrump],
    });

    await testEngine.playCard(scrump);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
