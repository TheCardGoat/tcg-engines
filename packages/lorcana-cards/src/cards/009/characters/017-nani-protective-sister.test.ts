import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { naniProtectiveSister } from "./017-nani-protective-sister";

describe("Nani - Protective Sister", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [naniProtectiveSister],
    });

    const cardUnderTest = testEngine.getCardModel(naniProtectiveSister);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
