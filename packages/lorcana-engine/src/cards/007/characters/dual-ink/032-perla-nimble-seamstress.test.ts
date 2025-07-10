/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { perlaNimbleSeamstress } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Perla - Nimble Seamstress", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [perlaNimbleSeamstress],
    });

    const cardUnderTest = testEngine.getCardModel(perlaNimbleSeamstress);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [perlaNimbleSeamstress],
    });

    const cardUnderTest = testEngine.getCardModel(perlaNimbleSeamstress);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
