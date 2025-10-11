import { describe, expect, it } from "bun:test";
import { markowskiSpaceTrooper } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Markowski - Space Trooper", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [markowskiSpaceTrooper],
    });

    const cardUnderTest = testEngine.getCardModel(markowskiSpaceTrooper);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
