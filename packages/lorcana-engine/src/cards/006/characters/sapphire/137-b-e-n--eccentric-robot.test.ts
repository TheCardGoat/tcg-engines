/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { benEccentricRobot } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("B.E.N. - Eccentric Robot", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [benEccentricRobot],
    });

    const cardUnderTest = testEngine.getCardModel(benEccentricRobot);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
