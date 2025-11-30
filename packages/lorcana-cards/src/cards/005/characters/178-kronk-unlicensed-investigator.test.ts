import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { kronkUnlicensedInvestigator } from "./178-kronk-unlicensed-investigator";

describe("Kronk - Unlicensed Investigator", () => {
  it("should have Challenger 1 ability", () => {
    expect(hasKeyword(kronkUnlicensedInvestigator, "Challenger")).toBe(true);
  });
});
