import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { TiggerWonderfulThing } from "./127-tigger-wonderful-thing";

describe("Tigger - Wonderful Thing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [TiggerWonderfulThing],
    });

    const cardUnderTest = testEngine.getCardModel(TiggerWonderfulThing);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
