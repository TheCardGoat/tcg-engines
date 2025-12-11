import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { wendyDarlingAuthorityOnPeterPan } from "./158-wendy-darling-authority-on-peter-pan";

describe("Wendy Darling - Authority on Peter Pan", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testEngine.getCardModel(
      wendyDarlingAuthorityOnPeterPan,
    );
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [wendyDarlingAuthorityOnPeterPan],
    });

    const cardUnderTest = testEngine.getCardModel(
      wendyDarlingAuthorityOnPeterPan,
    );
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
