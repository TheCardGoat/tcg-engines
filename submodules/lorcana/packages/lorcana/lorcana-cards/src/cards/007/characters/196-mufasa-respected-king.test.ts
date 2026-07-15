import { describe, expect, it } from "bun:test";
import { mufasaRespectedKing } from "./196-mufasa-respected-king";

describe("Mufasa - Respected King", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(mufasaRespectedKing.vanilla).toBe(true);
    expect(mufasaRespectedKing.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(mufasaRespectedKing.cost).toBe(4);
    expect(mufasaRespectedKing.strength).toBe(4);
    expect(mufasaRespectedKing.willpower).toBe(4);
    expect(mufasaRespectedKing.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(mufasaRespectedKing.cardType).toBe("character");
    expect(mufasaRespectedKing.inkType).toEqual(["steel"]);
    expect(mufasaRespectedKing.inkable).toBe(true);
    expect(mufasaRespectedKing.classifications).toEqual(["Storyborn", "Mentor", "King"]);
    expect(mufasaRespectedKing.rarity).toBe("uncommon");
  });
});
