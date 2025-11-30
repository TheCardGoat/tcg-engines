import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tongSurvivor } from "./126-tong-survivor";

describe("Tong - Survivor", () => {
  it("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [tongSurvivor],
    });
    const cardUnderTest = testEngine.getCardModel(tongSurvivor);
    expect(cardUnderTest.hasReckless).toBe(true);
  });
});
