/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { medallionWeights } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

describe("Medallion Weights", () => {
  it.skip("**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: medallionWeights.cost,
      play: [medallionWeights],
      hand: [medallionWeights],
    });

    await testEngine.playCard(medallionWeights);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
