/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  beastWounded,
  herculesClumsyKid,
  zeusMrLightningBolts,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Zeus - Mr. Lightning Bolts", () => {
  it("**TARGET PRACTICE** Whenever this character challenges another character, he gets + {S} equal to the {S} of chosen character this turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [zeusMrLightningBolts],
      },
      {
        play: [beastWounded, herculesClumsyKid],
      },
    );

    const cardUnderTest = testEngine.getCardModel(zeusMrLightningBolts);

    await testEngine.challenge({
      attacker: zeusMrLightningBolts,
      defender: beastWounded,
      exertDefender: true,
    });

    expect(cardUnderTest.strength).toBe(zeusMrLightningBolts.strength);
    await testEngine.resolveTopOfStack({ targets: [herculesClumsyKid] });
    expect(cardUnderTest.strength).toBe(
      zeusMrLightningBolts.strength + herculesClumsyKid.strength,
    );

    await testEngine.passTurn();
    expect(cardUnderTest.strength).toBe(zeusMrLightningBolts.strength);
  });
});
