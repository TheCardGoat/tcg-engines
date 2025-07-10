/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { helpingHand } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Helping Hand", () => {
  it.skip("Chosen character gains Support this turn. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: helpingHand.cost,
      play: [helpingHand],
      hand: [helpingHand],
    });

    await testEngine.playCard(helpingHand);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
