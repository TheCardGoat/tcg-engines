import { describe, expect, it } from "bun:test";
import { tinkerBellFlyingAtFullSpeed } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tinker Bell - Flying at Full Speed", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [tinkerBellFlyingAtFullSpeed],
    });

    const cardUnderTest = testEngine.getCardModel(tinkerBellFlyingAtFullSpeed);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
