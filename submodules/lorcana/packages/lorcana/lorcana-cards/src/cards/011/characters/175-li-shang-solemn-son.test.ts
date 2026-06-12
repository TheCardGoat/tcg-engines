import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { liShangSolemnSon } from "./175-li-shang-solemn-son";

describe("Li Shang - Solemn Son", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [liShangSolemnSon],
    });

    const cardUnderTest = testEngine.getCardModel(liShangSolemnSon);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
