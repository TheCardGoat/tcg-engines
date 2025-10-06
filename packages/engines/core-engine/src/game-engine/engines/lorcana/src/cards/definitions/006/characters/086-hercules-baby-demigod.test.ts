/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { herculesBabyDemigod } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hercules - Baby Demigod", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [herculesBabyDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesBabyDemigod);
    expect(cardUnderTest.hasWard).toBe(true);
  });

  it.skip("STRONG LIKE HIS DAD 3 {I} - Deal 1 damage to chosen damaged character.", async () => {
    const testEngine = new TestEngine({
      inkwell: herculesBabyDemigod.cost,
      play: [herculesBabyDemigod],
      hand: [herculesBabyDemigod],
    });

    await testEngine.playCard(herculesBabyDemigod);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
