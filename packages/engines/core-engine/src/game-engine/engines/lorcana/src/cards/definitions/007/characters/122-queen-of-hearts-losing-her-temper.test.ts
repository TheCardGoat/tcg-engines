import { describe, expect, it } from "bun:test";
import { queenOfHeartsLosingHerTemper } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
