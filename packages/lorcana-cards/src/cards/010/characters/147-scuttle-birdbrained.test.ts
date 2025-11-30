import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { scuttleBirdbrained } from "./147-scuttle-birdbrained";

describe("Scuttle - Birdbrained", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [scuttleBirdbrained],
      },
    );

    const cardUnderTest = testEngine.getCardModel(scuttleBirdbrained);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
