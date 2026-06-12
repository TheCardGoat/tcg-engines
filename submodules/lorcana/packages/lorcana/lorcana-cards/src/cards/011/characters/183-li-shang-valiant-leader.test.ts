import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { liShangValiantLeader } from "./183-li-shang-valiant-leader";

describe("Li Shang - Valiant Leader", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [liShangValiantLeader],
    });

    const cardUnderTest = testEngine.getCardModel(liShangValiantLeader);
    expect(cardUnderTest.hasShift()).toBe(true);
  });
});
