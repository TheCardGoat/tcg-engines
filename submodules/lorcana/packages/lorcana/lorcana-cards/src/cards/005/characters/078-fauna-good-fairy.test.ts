import { describe, expect, it } from "bun:test";
import { faunaGoodFairy } from "./078-fauna-good-fairy";

describe("Fauna - Good Fairy", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(faunaGoodFairy.vanilla).toBe(true);
    expect(faunaGoodFairy.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(faunaGoodFairy.cost).toBe(5);
    expect(faunaGoodFairy.strength).toBe(3);
    expect(faunaGoodFairy.willpower).toBe(7);
    expect(faunaGoodFairy.lore).toBe(2);
  });

  it("has correct properties", () => {
    expect(faunaGoodFairy.cardType).toBe("character");
    expect(faunaGoodFairy.inkType).toEqual(["emerald"]);
    expect(faunaGoodFairy.inkable).toBe(true);
    expect(faunaGoodFairy.classifications).toEqual(["Storyborn", "Ally", "Fairy"]);
    expect(faunaGoodFairy.rarity).toBe("common");
  });
});
