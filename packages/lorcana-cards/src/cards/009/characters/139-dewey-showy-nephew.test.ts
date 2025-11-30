import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { deweyShowyNephew } from "./139-dewey-showy-nephew";

describe("Dewey - Showy Nephew", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [deweyShowyNephew],
    });
    const cardUnderTest = testEngine.getCardModel(deweyShowyNephew);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
