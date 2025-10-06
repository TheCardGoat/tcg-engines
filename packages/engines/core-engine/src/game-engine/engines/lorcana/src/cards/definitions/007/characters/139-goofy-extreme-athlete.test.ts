/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyExtremeAthlete } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
