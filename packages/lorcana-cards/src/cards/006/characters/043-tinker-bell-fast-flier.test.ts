import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { tinkerBellFastFlier } from "./043-tinker-bell-fast-flier";

describe("Tinker Bell - Fast Flier", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [tinkerBellFastFlier],
    });

    const cardUnderTest = testEngine.getCardModel(tinkerBellFastFlier);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
