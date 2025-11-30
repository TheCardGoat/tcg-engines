import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { simbaProtectiveCub } from "./020-simba-protective-cub";

describe("Simba - Protective Cub", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [simbaProtectiveCub],
    });
    const cardUnderTest = testEngine.getCardModel(simbaProtectiveCub);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
