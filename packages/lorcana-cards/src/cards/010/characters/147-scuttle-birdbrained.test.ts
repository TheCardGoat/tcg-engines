import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { scuttleBirdbrained } from "./147-scuttle-birdbrained";

describe("Scuttle - Birdbrained", () => {
  it("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [scuttleBirdbrained],
    });
    const cardUnderTest = testEngine.getCardModel(scuttleBirdbrained);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
