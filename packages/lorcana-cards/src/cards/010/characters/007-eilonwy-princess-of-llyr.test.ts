import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { eilonwyPrincessOfLlyr } from "./007-eilonwy-princess-of-llyr";

describe("Eilonwy - Princess of Llyr", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [eilonwyPrincessOfLlyr],
      },
    );

    const cardUnderTest = testEngine.getCardModel(eilonwyPrincessOfLlyr);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
