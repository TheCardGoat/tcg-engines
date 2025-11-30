import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { donaldDuckStruttingHisStuff } from "./144-donald-duck-strutting-his-stuff";

describe("Donald Duck - Strutting His Stuff", () => {
  it("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [donaldDuckStruttingHisStuff],
    });
    const cardUnderTest = testEngine.getCardModel(donaldDuckStruttingHisStuff);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
