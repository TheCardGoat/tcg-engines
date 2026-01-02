import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { louieChillNephew } from "./140-louie-chill-nephew";

describe("Louie - Chill Nephew", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [louieChillNephew],
    });

    const cardUnderTest = testEngine.getCardModel(louieChillNephew);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
