import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { violetSabrewingSeniorJuniorWoodchuck } from "./044-violet-sabrewing-senior-junior-woodchuck";

describe("Violet Sabrewing - Senior Junior Woodchuck", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(violetSabrewingSeniorJuniorWoodchuck)).toBe(true);
  });
});
