import { describe, expect, it } from "bun:test";
import { akelaWolfPackElder } from "./182-akela-wolf-pack-elder";

describe("Akela - Wolf Pack Elder", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(akelaWolfPackElder.vanilla).toBe(true);
    expect(akelaWolfPackElder.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(akelaWolfPackElder.cost).toBe(2);
    expect(akelaWolfPackElder.strength).toBe(3);
    expect(akelaWolfPackElder.willpower).toBe(2);
    expect(akelaWolfPackElder.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(akelaWolfPackElder.cardType).toBe("character");
    expect(akelaWolfPackElder.inkType).toEqual(["steel"]);
    expect(akelaWolfPackElder.inkable).toBe(true);
    expect(akelaWolfPackElder.classifications).toEqual(["Storyborn", "Ally"]);
    expect(akelaWolfPackElder.rarity).toBe("common");
  });
});
