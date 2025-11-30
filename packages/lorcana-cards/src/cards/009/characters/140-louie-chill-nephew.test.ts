import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { louieChillNephew } from "./140-louie-chill-nephew";

describe("Louie - Chill Nephew", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [louieChillNephew],
    });
    const cardUnderTest = testEngine.getCardModel(louieChillNephew);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
