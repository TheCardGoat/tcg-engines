import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { teKLavaMonster } from "./058-te-k-lava-monster";

describe("Te Kā - Lava Monster", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [teKLavaMonster],
      },
    );

    const cardUnderTest = testEngine.getCardModel(teKLavaMonster);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
