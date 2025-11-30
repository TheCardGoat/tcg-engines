import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { thomasOmalleyFelineCharmer } from "./088-thomas-omalley-feline-charmer";

describe("Thomas O'Malley - Feline Charmer", () => {
  it("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [thomasOmalleyFelineCharmer],
    });
    const cardUnderTest = testEngine.getCardModel(thomasOmalleyFelineCharmer);
    expect(cardUnderTest.hasWard).toBe(true);
  });
});
