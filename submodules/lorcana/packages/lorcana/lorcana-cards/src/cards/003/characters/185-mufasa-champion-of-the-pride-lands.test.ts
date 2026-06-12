import { describe, expect, it } from "bun:test";
import { mufasaChampionOfThePrideLands } from "./185-mufasa-champion-of-the-pride-lands";

describe("Mufasa - Champion of the Pride Lands", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(mufasaChampionOfThePrideLands.vanilla).toBe(true);
    expect(mufasaChampionOfThePrideLands.abilities).toBeUndefined();
  });
});
