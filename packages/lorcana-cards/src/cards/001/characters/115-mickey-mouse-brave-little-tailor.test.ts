import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { MickeyMouseBraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [MickeyMouseBraveLittleTailor],
    });

    const cardUnderTest = testEngine.getCardModel(MickeyMouseBraveLittleTailor);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
