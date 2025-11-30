import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { pascalGardenChameleon } from "./019-pascal-garden-chameleon";

describe("Pascal - Garden Chameleon", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [pascalGardenChameleon],
    });
    const cardUnderTest = testEngine.getCardModel(pascalGardenChameleon);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
