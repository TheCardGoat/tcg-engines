import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { drFacilierSavvyOpportunist } from "./038-dr-facilier-savvy-opportunist";

describe("Dr. Facilier - Savvy Opportunist", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(drFacilierSavvyOpportunist)).toBe(true);
  });
});
