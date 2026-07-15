import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { sinaVigilantParent } from "./142-sina-vigilant-parent";

describe("Sina - Vigilant Parent", () => {
  it("should have alert ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sinaVigilantParent],
    });

    const cardUnderTest = testEngine.getCardModel(sinaVigilantParent);
    expect(cardUnderTest.hasAlert()).toBe(true);
  });
});
