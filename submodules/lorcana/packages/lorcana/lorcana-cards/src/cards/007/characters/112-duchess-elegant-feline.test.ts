import { describe, expect, it } from "bun:test";
import { duchessElegantFeline } from "./112-duchess-elegant-feline";

describe("Duchess - Elegant Feline", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(duchessElegantFeline.vanilla).toBe(true);
    expect(duchessElegantFeline.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(duchessElegantFeline.cost).toBe(2);
    expect(duchessElegantFeline.strength).toBe(3);
    expect(duchessElegantFeline.willpower).toBe(2);
    expect(duchessElegantFeline.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(duchessElegantFeline.cardType).toBe("character");
    expect(duchessElegantFeline.inkType).toEqual(["emerald"]);
    expect(duchessElegantFeline.inkable).toBe(true);
    expect(duchessElegantFeline.classifications).toEqual(["Storyborn", "Hero"]);
    expect(duchessElegantFeline.rarity).toBe("uncommon");
  });
});
