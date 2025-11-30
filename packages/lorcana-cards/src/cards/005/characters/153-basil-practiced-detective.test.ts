import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { basilPracticedDetective } from "./153-basil-practiced-detective";

describe("Basil - Practiced Detective", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [basilPracticedDetective],
    });

    const cardUnderTest = testEngine.getCardModel(basilPracticedDetective);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
