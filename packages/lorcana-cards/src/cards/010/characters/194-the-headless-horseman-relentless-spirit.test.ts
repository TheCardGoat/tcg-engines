import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { theHeadlessHorsemanRelentlessSpirit } from "./194-the-headless-horseman-relentless-spirit";

describe("The Headless Horseman - Relentless Spirit", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [theHeadlessHorsemanRelentlessSpirit],
    });
    const cardUnderTest = testEngine.getCardModel(
      theHeadlessHorsemanRelentlessSpirit,
    );
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
