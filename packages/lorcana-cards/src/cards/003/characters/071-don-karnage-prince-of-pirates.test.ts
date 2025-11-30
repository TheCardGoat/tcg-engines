import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { donKarnagePrinceOfPirates } from "./071-don-karnage-prince-of-pirates";

describe("Don Karnage - Prince of Pirates", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [donKarnagePrinceOfPirates],
    });
    const cardUnderTest = testEngine.getCardModel(donKarnagePrinceOfPirates);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
