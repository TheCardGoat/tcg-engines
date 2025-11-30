import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { kitCloudkickerSpunkyBearCub } from "./148-kit-cloudkicker-spunky-bear-cub";

describe("Kit Cloudkicker - Spunky Bear Cub", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [kitCloudkickerSpunkyBearCub],
    });

    const cardUnderTest = testEngine.getCardModel(kitCloudkickerSpunkyBearCub);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
