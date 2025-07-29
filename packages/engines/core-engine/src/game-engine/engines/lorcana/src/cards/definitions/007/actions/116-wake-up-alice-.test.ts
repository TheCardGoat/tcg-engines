/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { wakeUpAlice } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Wake Up, Alice!", () => {
  it.skip("Return chosen damaged character to their player's hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: wakeUpAlice.cost,
      play: [wakeUpAlice],
      hand: [wakeUpAlice],
    });

    await testEngine.playCard(wakeUpAlice);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
