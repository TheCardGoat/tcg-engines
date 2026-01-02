import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { pascalGardenChameleon } from "./019-pascal-garden-chameleon";

describe("Pascal - Garden Chameleon", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pascalGardenChameleon],
    });

    const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
