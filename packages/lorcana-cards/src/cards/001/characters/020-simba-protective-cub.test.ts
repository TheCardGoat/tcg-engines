import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { simbaProtectiveCub } from "./020-simba-protective-cub";

describe("Simba - Protective Cub", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(simbaProtectiveCub)).toBe(true);
  });
});
