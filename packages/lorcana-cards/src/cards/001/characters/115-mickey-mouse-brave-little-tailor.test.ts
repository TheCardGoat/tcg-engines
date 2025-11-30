import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mickeyMouseBraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [mickeyMouseBraveLittleTailor],
    });
    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittleTailor);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
