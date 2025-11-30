import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { herculesClumsyKid } from "./108-hercules-clumsy-kid";

describe("Hercules - Clumsy Kid", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [herculesClumsyKid],
    });
    const cardUnderTest = testEngine.getCardModel(herculesClumsyKid);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
