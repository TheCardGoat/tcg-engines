import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { zazuAdvisorToMufasa } from "./072-zazu-advisor-to-mufasa";

describe("Zazu - Advisor to Mufasa", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(zazuAdvisorToMufasa)).toBe(true);
  });
});
