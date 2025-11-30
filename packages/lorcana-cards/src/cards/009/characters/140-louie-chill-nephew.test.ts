import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { louieChillNephew } from "./140-louie-chill-nephew";

describe("Louie - Chill Nephew", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [louieChillNephew],
    });

    const cardUnderTest = testEngine.getCardModel(louieChillNephew);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
