import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { mickeyMouseBraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mickeyMouseBraveLittleTailor],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittleTailor);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
