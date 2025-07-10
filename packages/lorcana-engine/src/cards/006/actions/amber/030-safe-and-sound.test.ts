/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { safeAndSound } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Safe And Sound", () => {
  it.skip("Chosen character of yours can’t be challenged until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: safeAndSound.cost,
      play: [safeAndSound],
      hand: [safeAndSound],
    });

    await testEngine.playCard(safeAndSound);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
