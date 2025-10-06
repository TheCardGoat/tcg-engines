/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { lefouInstigator } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  argesTheCyclops,
  lefouOpportunisticFlunky,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lefou - Opportunistic Flunky", () => {
  it("**I LEARNED FROM THE BEST** During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [lefouOpportunisticFlunky, lefouInstigator],
      },
      {
        play: [argesTheCyclops],
      },
    );

    await testEngine.tapCard(argesTheCyclops);

    const cardUnderTest = testEngine.getCardModel(lefouOpportunisticFlunky);

    expect(cardUnderTest.cost).toEqual(lefouOpportunisticFlunky.cost);

    await testEngine.challenge({
      attacker: lefouInstigator,
      defender: argesTheCyclops,
    });

    expect(cardUnderTest.cost).toEqual(0);
  });
});
