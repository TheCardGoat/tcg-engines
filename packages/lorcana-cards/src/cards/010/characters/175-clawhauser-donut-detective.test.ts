import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { clawhauserDonutDetective } from "./175-clawhauser-donut-detective";

describe("Clawhauser - Donut Detective", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(clawhauserDonutDetective, "Challenger")).toBe(true);
  });
});
