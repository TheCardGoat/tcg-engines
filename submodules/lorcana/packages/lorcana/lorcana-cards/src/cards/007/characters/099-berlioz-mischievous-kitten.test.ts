import { describe, expect, it } from "bun:test";
import { berliozMischievousKitten } from "./099-berlioz-mischievous-kitten";

describe("Berlioz - Mischievous Kitten", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(berliozMischievousKitten.vanilla).toBe(true);
    expect(berliozMischievousKitten.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(berliozMischievousKitten.cost).toBe(3);
    expect(berliozMischievousKitten.strength).toBe(2);
    expect(berliozMischievousKitten.willpower).toBe(5);
    expect(berliozMischievousKitten.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(berliozMischievousKitten.cardType).toBe("character");
    expect(berliozMischievousKitten.inkType).toEqual(["emerald"]);
    expect(berliozMischievousKitten.inkable).toBe(true);
    expect(berliozMischievousKitten.classifications).toEqual(["Storyborn", "Ally"]);
    expect(berliozMischievousKitten.rarity).toBe("common");
  });
});
