/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tinkerBellFlyingAtFullSpeed } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Tinker Bell - Flying at Full Speed", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tinkerBellFlyingAtFullSpeed],
    });

    const cardUnderTest = testEngine.getCardModel(tinkerBellFlyingAtFullSpeed);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
