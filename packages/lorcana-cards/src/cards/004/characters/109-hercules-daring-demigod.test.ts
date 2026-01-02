import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { herculesDaringDemigod } from "./109-hercules-daring-demigod";

describe("Hercules - Daring Demigod", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDaringDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDaringDemigod);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [herculesDaringDemigod],
    });

    const cardUnderTest = testEngine.getCardModel(herculesDaringDemigod);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
