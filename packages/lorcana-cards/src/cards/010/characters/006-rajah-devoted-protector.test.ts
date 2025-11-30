import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { rajahDevotedProtector } from "./006-rajah-devoted-protector";

describe("Rajah - Devoted Protector", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rajahDevotedProtector],
    });

    const cardUnderTest = testEngine.getCardModel(rajahDevotedProtector);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
