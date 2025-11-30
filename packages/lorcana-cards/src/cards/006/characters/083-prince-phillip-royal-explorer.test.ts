import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { princePhillipRoyalExplorer } from "./083-prince-phillip-royal-explorer";

describe("Prince Phillip - Royal Explorer", () => {
  it("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [princePhillipRoyalExplorer],
    });
    const cardUnderTest = testEngine.getCardModel(princePhillipRoyalExplorer);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
