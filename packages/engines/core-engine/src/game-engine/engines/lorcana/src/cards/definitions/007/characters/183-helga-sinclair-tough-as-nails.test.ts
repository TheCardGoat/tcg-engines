/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { helgaSinclairToughAsNails } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Helga Sinclair - Tough as Nails", () => {
  it.skip("Challenger +3 (While challenging, this character gets +3 {S}).", async () => {
    const testEngine = new TestEngine({
      play: [helgaSinclairToughAsNails],
    });

    const cardUnderTest = testEngine.getCardModel(helgaSinclairToughAsNails);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it.skip("QUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      inkwell: helgaSinclairToughAsNails.cost,
      play: [helgaSinclairToughAsNails],
      hand: [helgaSinclairToughAsNails],
    });

    await testEngine.playCard(helgaSinclairToughAsNails);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
