import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { teKLavaMonster } from "./058-te-k-lava-monster";

describe("Te Kā - Lava Monster", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [teKLavaMonster],
    });
    const cardUnderTest = testEngine.getCardModel(teKLavaMonster);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
