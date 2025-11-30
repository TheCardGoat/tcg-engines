import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { fixitFelixJrTrustyBuilder } from "./010-fix-it-felix-jr-trusty-builder";

describe("Fix-It Felix, Jr. - Trusty Builder", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [fixitFelixJrTrustyBuilder],
    });

    const cardUnderTest = testEngine.getCardModel(fixitFelixJrTrustyBuilder);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
