import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { tiggerWonderfulThing } from "./127-tigger-wonderful-thing";

describe("Tigger - Wonderful Thing", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [tiggerWonderfulThing],
    });
    const cardUnderTest = testEngine.getCardModel(tiggerWonderfulThing);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
