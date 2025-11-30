import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { tiggerWonderfulThing } from "./127-tigger-wonderful-thing";

describe("Tigger - Wonderful Thing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [tiggerWonderfulThing],
      },
    );

    const cardUnderTest = testEngine.getCardModel(tiggerWonderfulThing);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
