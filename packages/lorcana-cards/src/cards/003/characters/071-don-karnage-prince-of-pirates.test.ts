import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { donKarnagePrinceOfPirates } from "./071-don-karnage-prince-of-pirates";

describe("Don Karnage - Prince of Pirates", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [donKarnagePrinceOfPirates],
    });

    const cardUnderTest = testEngine.getCardModel(donKarnagePrinceOfPirates);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
