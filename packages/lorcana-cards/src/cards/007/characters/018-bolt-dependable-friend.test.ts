import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { boltDependableFriend } from "./018-bolt-dependable-friend";

describe("Bolt - Dependable Friend", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [boltDependableFriend],
    });

    const cardUnderTest = testEngine.getCardModel(boltDependableFriend);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
