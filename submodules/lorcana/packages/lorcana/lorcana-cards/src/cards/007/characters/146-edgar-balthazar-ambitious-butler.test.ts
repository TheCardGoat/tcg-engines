import { describe, expect, it } from "bun:test";
import { edgarBalthazarAmbitiousButler } from "./146-edgar-balthazar-ambitious-butler";

describe("Edgar Balthazar - Ambitious Butler", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(edgarBalthazarAmbitiousButler.vanilla).toBe(true);
    expect(edgarBalthazarAmbitiousButler.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(edgarBalthazarAmbitiousButler.cost).toBe(5);
    expect(edgarBalthazarAmbitiousButler.strength).toBe(6);
    expect(edgarBalthazarAmbitiousButler.willpower).toBe(5);
    expect(edgarBalthazarAmbitiousButler.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(edgarBalthazarAmbitiousButler.cardType).toBe("character");
    expect(edgarBalthazarAmbitiousButler.inkType).toEqual(["ruby"]);
    expect(edgarBalthazarAmbitiousButler.inkable).toBe(true);
    expect(edgarBalthazarAmbitiousButler.classifications).toEqual(["Storyborn", "Villain"]);
    expect(edgarBalthazarAmbitiousButler.rarity).toBe("common");
  });
});
