import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { fidgetRatigansHenchman } from "./108-fidget-ratigans-henchman";

describe("Fidget - Ratigan's Henchman", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(fidgetRatigansHenchman)).toBe(true);
  });
});
