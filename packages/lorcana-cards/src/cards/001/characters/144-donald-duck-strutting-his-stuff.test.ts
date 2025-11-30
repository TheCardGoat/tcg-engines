import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { donaldDuckStruttingHisStuff } from "./144-donald-duck-strutting-his-stuff";

describe("Donald Duck - Strutting His Stuff", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [donaldDuckStruttingHisStuff],
    });

    const cardUnderTest = testEngine.getCardModel(donaldDuckStruttingHisStuff);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
