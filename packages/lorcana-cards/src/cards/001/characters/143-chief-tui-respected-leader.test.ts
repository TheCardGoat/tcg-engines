import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ChiefTuiRespectedLeader } from "./143-chief-tui-respected-leader";

describe("Chief Tui - Respected Leader", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ChiefTuiRespectedLeader],
    });

    const cardUnderTest = testEngine.getCardModel(ChiefTuiRespectedLeader);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
