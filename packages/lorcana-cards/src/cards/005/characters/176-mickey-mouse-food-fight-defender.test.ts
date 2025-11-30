import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { mickeyMouseFoodFightDefender } from "./176-mickey-mouse-food-fight-defender";

describe("Mickey Mouse - Food Fight Defender", () => {
  it("should have Resist 1 ability", () => {
    expect(hasKeyword(mickeyMouseFoodFightDefender, "Resist")).toBe(true);
  });
});
