/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { undermine } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
