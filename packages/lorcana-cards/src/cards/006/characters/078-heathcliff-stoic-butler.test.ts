import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { heathcliffStoicButler } from "./078-heathcliff-stoic-butler";

describe("Heathcliff - Stoic Butler", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [heathcliffStoicButler],
    });

    const cardUnderTest = testEngine.getCardModel(heathcliffStoicButler);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
