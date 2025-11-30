import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { simbaProtectiveCub } from "./020-simba-protective-cub";

describe("Simba - Protective Cub", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [simbaProtectiveCub],
    });

    const cardUnderTest = testEngine.getCardModel(simbaProtectiveCub);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
