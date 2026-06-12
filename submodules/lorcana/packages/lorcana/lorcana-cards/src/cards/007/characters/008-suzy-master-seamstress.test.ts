import { describe, expect, it } from "bun:test";
import { suzyMasterSeamstress } from "./008-suzy-master-seamstress";

describe("Suzy - Master Seamstress", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(suzyMasterSeamstress.vanilla).toBe(true);
    expect(suzyMasterSeamstress.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(suzyMasterSeamstress.cost).toBe(4);
    expect(suzyMasterSeamstress.strength).toBe(3);
    expect(suzyMasterSeamstress.willpower).toBe(4);
    expect(suzyMasterSeamstress.lore).toBe(2);
  });

  it("has correct properties", () => {
    expect(suzyMasterSeamstress.cardType).toBe("character");
    expect(suzyMasterSeamstress.inkType).toEqual(["amber"]);
    expect(suzyMasterSeamstress.inkable).toBe(true);
    expect(suzyMasterSeamstress.classifications).toEqual(["Storyborn", "Ally"]);
    expect(suzyMasterSeamstress.rarity).toBe("common");
  });
});
