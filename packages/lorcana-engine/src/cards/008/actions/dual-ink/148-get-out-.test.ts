/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { getOut } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Get Out!", () => {
  it.skip("Banish chosen character, then return an item card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: getOut.cost,
      play: [getOut],
      hand: [getOut],
    });

    await testEngine.playCard(getOut);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
