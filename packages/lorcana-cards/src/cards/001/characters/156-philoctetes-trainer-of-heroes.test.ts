import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { philoctetesTrainerOfHeroes } from "./156-philoctetes-trainer-of-heroes";

describe("Philoctetes - Trainer of Heroes", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [philoctetesTrainerOfHeroes],
    });
    const cardUnderTest = testEngine.getCardModel(philoctetesTrainerOfHeroes);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
