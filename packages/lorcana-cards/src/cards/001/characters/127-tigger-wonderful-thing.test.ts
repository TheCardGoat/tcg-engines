import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { tiggerWonderfulThing } from "./127-tigger-wonderful-thing";

describe("Tigger - Wonderful Thing", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [tiggerWonderfulThing],
    });

    const cardUnderTest = testEngine.getCardModel(tiggerWonderfulThing);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
