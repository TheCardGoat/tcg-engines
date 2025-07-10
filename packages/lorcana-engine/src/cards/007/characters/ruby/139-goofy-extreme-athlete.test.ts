/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyExtremeAthlete } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Goofy - Extreme Athlete", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [goofyExtremeAthlete],
    });

    const cardUnderTest = testEngine.getCardModel(goofyExtremeAthlete);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("STAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: goofyExtremeAthlete.cost,
      play: [goofyExtremeAthlete],
      hand: [goofyExtremeAthlete],
    });

    await testEngine.playCard(goofyExtremeAthlete);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
