import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { bobbyPurplePigeon } from "./182-bobby-purple-pigeon";

describe("Bobby - Purple Pigeon", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [bobbyPurplePigeon],
    });

    const cardUnderTest = testEngine.getCardModel(bobbyPurplePigeon);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
