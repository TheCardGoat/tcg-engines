import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { thomasOmalleyFelineCharmer } from "./088-thomas-omalley-feline-charmer";

describe("Thomas O'Malley - Feline Charmer", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [thomasOmalleyFelineCharmer],
    });

    const cardUnderTest = testEngine.getCardModel(thomasOmalleyFelineCharmer);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
