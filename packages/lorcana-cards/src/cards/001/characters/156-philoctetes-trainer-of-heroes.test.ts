import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { philoctetestrainerOfHeroes } from "./156-philoctetes-trainer-of-heroes";

describe("Philoctetes - Trainer of Heroes", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [philoctetestrainerOfHeroes],
    });

    const cardUnderTest = testEngine.getCardModel(philoctetestrainerOfHeroes);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
