/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { scrump } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
