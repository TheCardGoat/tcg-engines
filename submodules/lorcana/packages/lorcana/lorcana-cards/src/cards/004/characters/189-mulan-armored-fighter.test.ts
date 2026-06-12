import { describe, expect, it } from "bun:test";
import { mulanArmoredFighter } from "./189-mulan-armored-fighter";

describe("Mulan - Armored Fighter", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(mulanArmoredFighter.vanilla).toBe(true);
    expect(mulanArmoredFighter.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(mulanArmoredFighter.cost).toBe(4);
    expect(mulanArmoredFighter.strength).toBe(3);
    expect(mulanArmoredFighter.willpower).toBe(6);
    expect(mulanArmoredFighter.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(mulanArmoredFighter.inkable).toBe(true);
  });

  it("has correct classifications", () => {
    expect(mulanArmoredFighter.classifications).toEqual(["Storyborn", "Hero", "Princess"]);
  });
});
