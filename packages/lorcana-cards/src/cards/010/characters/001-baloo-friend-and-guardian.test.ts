import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { balooFriendAndGuardian } from "./001-baloo-friend-and-guardian";

describe("Baloo - Friend and Guardian", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [balooFriendAndGuardian],
    });
    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });

  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [balooFriendAndGuardian],
    });
    const cardUnderTest = testEngine.getCardModel(balooFriendAndGuardian);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
