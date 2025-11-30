import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { boltDependableFriend } from "./018-bolt-dependable-friend";

describe("Bolt - Dependable Friend", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [boltDependableFriend],
    });

    const cardUnderTest = testEngine.getCardModel(boltDependableFriend);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
