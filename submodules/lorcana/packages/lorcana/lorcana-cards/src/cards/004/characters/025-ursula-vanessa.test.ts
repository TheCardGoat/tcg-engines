import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { ursulaVanessa } from "./025-ursula-vanessa";

describe("Ursula - Vanessa", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });

  it("should have singer cost of 4", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ursulaVanessa],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaVanessa);
    expect(cardUnderTest.singerCost).toBe(4);
  });
});
