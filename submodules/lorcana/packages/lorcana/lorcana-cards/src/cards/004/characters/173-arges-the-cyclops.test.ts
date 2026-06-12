import { describe, expect, it } from "bun:test";
import { argesTheCyclops } from "./173-arges-the-cyclops";

describe("Arges - The Cyclops", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(argesTheCyclops.vanilla).toBe(true);
    expect(argesTheCyclops.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(argesTheCyclops.cost).toBe(2);
    expect(argesTheCyclops.strength).toBe(4);
    expect(argesTheCyclops.willpower).toBe(1);
    expect(argesTheCyclops.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(argesTheCyclops.inkable).toBe(true);
  });
});
