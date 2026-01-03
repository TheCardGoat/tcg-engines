import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { balooFriendAndGuardian } from "./001-baloo-friend-and-guardian";

describe("Baloo - Friend and Guardian", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [balooFriendAndGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [balooFriendAndGuardian],
    });

    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
