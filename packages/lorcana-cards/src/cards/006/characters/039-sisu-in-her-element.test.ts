import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { sisuInHerElement } from "./039-sisu-in-her-element";

describe("Sisu - In Her Element", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [sisuInHerElement],
    });

    const cardUnderTest = testEngine.getCardModel(sisuInHerElement);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
