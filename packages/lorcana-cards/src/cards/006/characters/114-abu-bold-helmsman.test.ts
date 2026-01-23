import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { abuBoldHelmsman } from "./114-abu-bold-helmsman";

describe("Abu - Bold Helmsman", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [abuBoldHelmsman],
    });

    const cardUnderTest = testEngine.getCardModel(abuBoldHelmsman);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
