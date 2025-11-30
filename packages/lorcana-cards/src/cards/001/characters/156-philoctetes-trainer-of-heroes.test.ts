import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { philoctetesTrainerOfHeroes } from "./156-philoctetes-trainer-of-heroes";

describe("Philoctetes - Trainer of Heroes", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [philoctetesTrainerOfHeroes],
    });

    const cardUnderTest = testEngine.getCardModel(philoctetesTrainerOfHeroes);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
