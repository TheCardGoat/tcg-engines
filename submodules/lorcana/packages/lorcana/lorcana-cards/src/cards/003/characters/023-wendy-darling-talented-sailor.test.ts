import { describe, expect, it } from "bun:test";
import { wendyDarlingTalentedSailor } from "./023-wendy-darling-talented-sailor";

describe("Wendy Darling - Talented Sailor", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(wendyDarlingTalentedSailor.vanilla).toBe(true);
    expect(wendyDarlingTalentedSailor.abilities).toBeUndefined();
  });
});
