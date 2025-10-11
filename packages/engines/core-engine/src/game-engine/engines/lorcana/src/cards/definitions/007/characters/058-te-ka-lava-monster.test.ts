import { describe, expect, it } from "bun:test";
import { teKaLavaMonster } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Te Ka - Lava Monster", () => {
  it.skip("Challenger +2 (While challenging, this character gets +2 {S}).", async () => {
    const testEngine = new TestEngine({
      play: [teKaLavaMonster],
    });

    const cardUnderTest = testEngine.getCardModel(teKaLavaMonster);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
