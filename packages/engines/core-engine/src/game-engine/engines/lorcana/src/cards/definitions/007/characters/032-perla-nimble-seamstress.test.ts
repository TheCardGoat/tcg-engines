import { describe, expect, it } from "bun:test";
import { perlaNimbleSeamstress } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
