import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { theHeadlessHorsemanRelentlessSpirit } from "./194-the-headless-horseman-relentless-spirit";

describe("The Headless Horseman - Relentless Spirit", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [theHeadlessHorsemanRelentlessSpirit],
    });

    const cardUnderTest = testEngine.getCardModel(
      theHeadlessHorsemanRelentlessSpirit,
    );
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
