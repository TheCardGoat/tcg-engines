import { describe, expect, it } from "bun:test";
import { flixMadrigalFunlovingFamilyMan } from "./009-flix-madrigal-fun-loving-family-man";

describe("Félix Madrigal - Fun-Loving Family Man", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(flixMadrigalFunlovingFamilyMan.vanilla).toBe(true);
    expect(flixMadrigalFunlovingFamilyMan.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(flixMadrigalFunlovingFamilyMan.cost).toBe(3);
    expect(flixMadrigalFunlovingFamilyMan.strength).toBe(2);
    expect(flixMadrigalFunlovingFamilyMan.willpower).toBe(4);
    expect(flixMadrigalFunlovingFamilyMan.lore).toBe(2);
  });

  it("is inkable", () => {
    expect(flixMadrigalFunlovingFamilyMan.inkable).toBe(true);
  });

  it("has correct classifications", () => {
    expect(flixMadrigalFunlovingFamilyMan.classifications).toContain("Storyborn");
    expect(flixMadrigalFunlovingFamilyMan.classifications).toContain("Ally");
    expect(flixMadrigalFunlovingFamilyMan.classifications).toContain("Madrigal");
  });
});
