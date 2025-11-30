import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { auroraTranquilPrincess } from "./154-aurora-tranquil-princess";

describe("Aurora - Tranquil Princess", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [auroraTranquilPrincess],
    });

    const cardUnderTest = testEngine.getCardModel(auroraTranquilPrincess);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
