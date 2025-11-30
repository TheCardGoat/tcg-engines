import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { chiefTuiRespectedLeader } from "./143-chief-tui-respected-leader";

describe("Chief Tui - Respected Leader", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [chiefTuiRespectedLeader],
    });
    const cardUnderTest = testEngine.getCardModel(chiefTuiRespectedLeader);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
