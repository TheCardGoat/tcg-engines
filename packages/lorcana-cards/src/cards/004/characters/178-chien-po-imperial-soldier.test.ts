import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { chienpoImperialSoldier } from "./178-chien-po-imperial-soldier";

describe("Chien-Po - Imperial Soldier", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [chienpoImperialSoldier],
    });
    const cardUnderTest = testEngine.getCardModel(chienpoImperialSoldier);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
