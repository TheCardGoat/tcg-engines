import { describe, expect, it } from "bun:test";
import { drizellaSpoiledStepsister } from "./085-drizella-spoiled-stepsister";

describe("Drizella - Spoiled Stepsister", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(drizellaSpoiledStepsister.vanilla).toBe(true);
    expect(drizellaSpoiledStepsister.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(drizellaSpoiledStepsister.cost).toBe(4);
    expect(drizellaSpoiledStepsister.strength).toBe(4);
    expect(drizellaSpoiledStepsister.willpower).toBe(4);
    expect(drizellaSpoiledStepsister.lore).toBe(1);
  });

  it("has correct properties", () => {
    expect(drizellaSpoiledStepsister.cardType).toBe("character");
    expect(drizellaSpoiledStepsister.inkType).toEqual(["emerald"]);
    expect(drizellaSpoiledStepsister.inkable).toBe(true);
    expect(drizellaSpoiledStepsister.classifications).toEqual(["Storyborn", "Ally"]);
    expect(drizellaSpoiledStepsister.rarity).toBe("common");
  });
});
