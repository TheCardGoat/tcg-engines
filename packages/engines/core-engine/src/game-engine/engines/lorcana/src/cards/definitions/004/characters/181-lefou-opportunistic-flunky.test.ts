/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { lefouInstigator } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  argesTheCyclops,
  lefouOpportunisticFlunky,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
