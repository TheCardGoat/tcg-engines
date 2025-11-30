import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { montereyJackDefiantProtector } from "./188-monterey-jack-defiant-protector";

describe("Monterey Jack - Defiant Protector", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [montereyJackDefiantProtector],
    });

    const cardUnderTest = testEngine.getCardModel(montereyJackDefiantProtector);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
