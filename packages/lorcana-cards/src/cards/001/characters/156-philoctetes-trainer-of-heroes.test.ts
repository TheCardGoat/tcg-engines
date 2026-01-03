import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { PhiloctetesTrainerOfHeroes } from "./156-philoctetes-trainer-of-heroes";

describe("Philoctetes - Trainer of Heroes", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [PhiloctetesTrainerOfHeroes],
    });

    const cardUnderTest = testEngine.getCardModel(PhiloctetesTrainerOfHeroes);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
