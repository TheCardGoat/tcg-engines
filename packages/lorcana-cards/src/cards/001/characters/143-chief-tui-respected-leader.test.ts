import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { chiefTuirespectedLeader } from "./143-chief-tui-respected-leader";

describe("Chief Tui - Respected Leader", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [chiefTuirespectedLeader],
    });

    const cardUnderTest = testEngine.getCardModel(chiefTuirespectedLeader);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
