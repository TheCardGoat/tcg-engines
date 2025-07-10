/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { makeSomeMagic } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Make Some Magic", () => {
  it.skip("Move 1 damage counter from chosen character to chosen opposing character. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: makeSomeMagic.cost,
      play: [makeSomeMagic],
      hand: [makeSomeMagic],
    });

    await testEngine.playCard(makeSomeMagic);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
