import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { sisuInHerElement } from "./039-sisu-in-her-element";

describe("Sisu - In Her Element", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [sisuInHerElement],
      },
    );

    const cardUnderTest = testEngine.getCardModel(sisuInHerElement);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
