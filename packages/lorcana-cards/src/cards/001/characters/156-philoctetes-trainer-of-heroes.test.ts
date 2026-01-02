import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { philoctetesTrainerOfHeroes } from "./156-philoctetes-trainer-of-heroes";

describe("Philoctetes - Trainer of Heroes", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [philoctetesTrainerOfHeroes],
    });

    const cardUnderTest = testEngine.getCardModel(philoctetesTrainerOfHeroes);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
