import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { deweyShowyNephew } from "./139-dewey-showy-nephew";

describe("Dewey - Showy Nephew", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [deweyShowyNephew],
    });

    const cardUnderTest = testEngine.getCardModel(deweyShowyNephew);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
