import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { mickeyMouseBraveLittleTailor } from "./115-mickey-mouse-brave-little-tailor";

describe("Mickey Mouse - Brave Little Tailor", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [mickeyMouseBraveLittleTailor],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittleTailor);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
