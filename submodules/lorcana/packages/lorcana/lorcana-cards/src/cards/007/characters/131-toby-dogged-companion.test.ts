import { describe, expect, it } from "bun:test";
import { tobyDoggedCompanion } from "./131-toby-dogged-companion";

describe("Toby - Dogged Companion", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(tobyDoggedCompanion.vanilla).toBe(true);
    expect(tobyDoggedCompanion.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(tobyDoggedCompanion.cost).toBe(1);
    expect(tobyDoggedCompanion.strength).toBe(3);
    expect(tobyDoggedCompanion.willpower).toBe(1);
    expect(tobyDoggedCompanion.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(tobyDoggedCompanion.cardType).toBe("character");
    expect(tobyDoggedCompanion.inkType).toEqual(["ruby"]);
    expect(tobyDoggedCompanion.inkable).toBe(false);
    expect(tobyDoggedCompanion.classifications).toEqual(["Storyborn", "Ally"]);
    expect(tobyDoggedCompanion.rarity).toBe("common");
  });
});
