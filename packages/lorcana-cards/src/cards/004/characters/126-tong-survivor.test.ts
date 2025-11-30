import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { tongSurvivor } from "./126-tong-survivor";

describe("Tong - Survivor", () => {
  it.skip("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [tongSurvivor],
    });

    const cardUnderTest = testEngine.getCardModel(tongSurvivor);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
