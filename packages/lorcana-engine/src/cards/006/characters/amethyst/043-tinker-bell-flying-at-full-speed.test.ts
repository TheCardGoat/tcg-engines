/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tinkerBellFlyingAtFullSpeed } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Tinker Bell - Flying at Full Speed", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tinkerBellFlyingAtFullSpeed],
    });

    const cardUnderTest = testEngine.getCardModel(tinkerBellFlyingAtFullSpeed);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
