import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { drFacilierCharlatan } from "./038-dr-facilier-charlatan";

describe("Dr. Facilier - Charlatan", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(drFacilierCharlatan, "Challenger")).toBe(true);
  });
});
