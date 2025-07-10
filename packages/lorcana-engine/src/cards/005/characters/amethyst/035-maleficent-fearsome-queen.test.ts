/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  cogsworthIlluminaryWatchman,
  maleficentFearsomeQueen,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Maleficent - Fearsome Queen", () => {
  // TODO: Fix the card, it's broken dynamicAmount.ts is not calculating correctly the amount of targets
  // And also the filter lte 3 on the property cost is not working correctly
  it.skip("**EVERYONE LISTEN** When you play this character, for each character named Maleficent you have in play, return chosen opposing character, item, or location of cost 3 or less to their player's hand.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: maleficentFearsomeQueen.cost,
        hand: [maleficentFearsomeQueen],
      },
      {
        play: [cogsworthIlluminaryWatchman],
      },
    );

    await testEngine.playCard(maleficentFearsomeQueen);
    await testEngine.resolveTopOfStack({
      targets: [cogsworthIlluminaryWatchman],
    });

    expect(testEngine.getCardModel(cogsworthIlluminaryWatchman).zone).toBe(
      "hand",
    );
  });
});
