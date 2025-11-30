import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { scuttleBirdbrained } from "./147-scuttle-birdbrained";

describe("Scuttle - Birdbrained", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [scuttleBirdbrained],
    });

    const cardUnderTest = testEngine.getCardModel(scuttleBirdbrained);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
