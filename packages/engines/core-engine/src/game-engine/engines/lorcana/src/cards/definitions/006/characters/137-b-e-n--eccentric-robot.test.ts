/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { benEccentricRobot } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("B.E.N. - Eccentric Robot", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [benEccentricRobot],
    });

    const cardUnderTest = testEngine.getCardModel(benEccentricRobot);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
