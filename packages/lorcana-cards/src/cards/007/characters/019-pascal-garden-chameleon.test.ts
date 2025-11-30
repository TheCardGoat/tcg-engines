import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { pascalGardenChameleon } from "./019-pascal-garden-chameleon";

describe("Pascal - Garden Chameleon", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [pascalGardenChameleon],
    });

    const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
