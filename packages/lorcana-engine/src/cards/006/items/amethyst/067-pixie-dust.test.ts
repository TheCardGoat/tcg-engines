/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pixieDust } from "@lorcanito/lorcana-engine/cards/006/items/items";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Pixie Dust", () => {
  it.skip("FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: pixieDust.cost,
      play: [pixieDust],
      hand: [pixieDust],
    });

    await testEngine.playCard(pixieDust);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
