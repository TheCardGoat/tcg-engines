/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  beastWounded,
  herculesClumsyKid,
  zeusMrLightningBolts,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
