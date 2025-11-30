import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { abuBoldHelmsman } from "./114-abu-bold-helmsman";

describe("Abu - Bold Helmsman", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [abuBoldHelmsman],
    });

    const cardUnderTest = testEngine.getCardModel(abuBoldHelmsman);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
