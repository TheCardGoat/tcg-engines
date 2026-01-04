import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tiggerwonderfulThing } from "./127-tigger-wonderful-thing";

describe("Tigger - Wonderful Thing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tiggerwonderfulThing],
    });

    const cardUnderTest = testEngine.getCardModel(tiggerwonderfulThing);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
