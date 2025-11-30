import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { captainHookForcefulDuelist } from "./186-captain-hook-forceful-duelist";

describe("Captain Hook - Forceful Duelist", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(captainHookForcefulDuelist, "Challenger")).toBe(true);
  });
});
