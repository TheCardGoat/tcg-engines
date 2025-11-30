import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { benEccentricRobot } from "./137-ben-eccentric-robot";

describe("B.E.N. - Eccentric Robot", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(benEccentricRobot, "Support")).toBe(true);
  });
});
