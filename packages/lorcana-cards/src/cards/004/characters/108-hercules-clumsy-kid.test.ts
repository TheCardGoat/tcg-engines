import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { herculesClumsyKid } from "./108-hercules-clumsy-kid";

describe("Hercules - Clumsy Kid", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [herculesClumsyKid],
      },
    );

    const cardUnderTest = testEngine.getCardModel(herculesClumsyKid);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
