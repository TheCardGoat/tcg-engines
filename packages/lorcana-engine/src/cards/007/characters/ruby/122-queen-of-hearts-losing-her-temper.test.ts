/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { queenOfHeartsLosingHerTemper } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Queen Of Hearts - Losing Her Temper", () => {
  it("ROYAL PAIN While this character has damage, she gets +3 {S}.", async () => {
    const testEngine = new TestEngine({
      play: [queenOfHeartsLosingHerTemper],
    });

    expect(testEngine.getCardModel(queenOfHeartsLosingHerTemper).strength).toBe(
      queenOfHeartsLosingHerTemper.strength,
    );

    await testEngine.setCardDamage(queenOfHeartsLosingHerTemper, 1);

    expect(testEngine.getCardModel(queenOfHeartsLosingHerTemper).strength).toBe(
      queenOfHeartsLosingHerTemper.strength + 3,
    );
  });
});
