import { describe, expect, it } from "bun:test";
import { hasBodyguard, hasKeyword } from "@tcg/lorcana";
import { balooFriendAndGuardian } from "./001-baloo-friend-and-guardian";

describe("Baloo - Friend and Guardian", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(balooFriendAndGuardian)).toBe(true);
  });

  it("should have Support ability", () => {
    expect(hasKeyword(balooFriendAndGuardian, "Support")).toBe(true);
  });
});
