/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { vanellopeVonSchweetzSpunkySpeedster } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

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
