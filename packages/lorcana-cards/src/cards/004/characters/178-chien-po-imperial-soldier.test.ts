import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { chienpoImperialSoldier } from "./178-chien-po-imperial-soldier";

describe("Chien-Po - Imperial Soldier", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [chienpoImperialSoldier],
      },
    );

    const cardUnderTest = testEngine.getCardModel(chienpoImperialSoldier);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
