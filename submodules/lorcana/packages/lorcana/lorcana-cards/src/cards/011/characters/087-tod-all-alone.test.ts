import { describe, expect, it } from "bun:test";
import { todAllAlone } from "./087-tod-all-alone";

describe("Tod - All Alone", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(todAllAlone.vanilla).toBe(true);
    expect(todAllAlone.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(todAllAlone.cost).toBe(1);
    expect(todAllAlone.strength).toBe(2);
    expect(todAllAlone.willpower).toBe(2);
    expect(todAllAlone.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(todAllAlone.cardType).toBe("character");
    expect(todAllAlone.inkType).toEqual(["emerald"]);
    expect(todAllAlone.inkable).toBe(true);
    expect(todAllAlone.classifications).toEqual(["Storyborn", "Hero"]);
    expect(todAllAlone.rarity).toBe("common");
  });
});
