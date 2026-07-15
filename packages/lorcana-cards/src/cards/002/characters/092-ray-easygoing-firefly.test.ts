import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rayEasygoingFirefly } from "./092-ray-easygoing-firefly";

describe("Ray - Easygoing Firefly", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rayEasygoingFirefly],
    });

    const cardUnderTest = testEngine.getCardModel(rayEasygoingFirefly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
