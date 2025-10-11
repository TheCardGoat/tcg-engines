import { describe, expect, it } from "bun:test";
import { vanellopeVonSchweetzSpunkySpeedster } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Vanellope Von Schweetz - Spunky Speedster", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [vanellopeVonSchweetzSpunkySpeedster],
    });

    const cardUnderTest = testEngine.getCardModel(
      vanellopeVonSchweetzSpunkySpeedster,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
