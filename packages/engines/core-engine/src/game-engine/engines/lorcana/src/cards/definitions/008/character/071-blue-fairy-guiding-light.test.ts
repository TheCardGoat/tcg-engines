/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { blueFairyGuidingLight } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Blue Fairy - Guiding Light", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [blueFairyGuidingLight],
    });

    const cardUnderTest = testEngine.getCardModel(blueFairyGuidingLight);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [blueFairyGuidingLight],
    });

    const cardUnderTest = testEngine.getCardModel(blueFairyGuidingLight);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
