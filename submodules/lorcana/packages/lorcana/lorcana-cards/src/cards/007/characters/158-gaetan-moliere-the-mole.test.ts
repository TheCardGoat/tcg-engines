import { describe, expect, it } from "bun:test";
import { gaetanMoliereTheMole } from "./158-gaetan-moliere-the-mole";

describe("Gaetan Moliere - The Mole", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(gaetanMoliereTheMole.vanilla).toBe(true);
    expect(gaetanMoliereTheMole.abilities).toBeUndefined();
    expect(gaetanMoliereTheMole.cost).toBe(3);
    expect(gaetanMoliereTheMole.strength).toBe(3);
    expect(gaetanMoliereTheMole.willpower).toBe(4);
    expect(gaetanMoliereTheMole.lore).toBe(1);
    expect(gaetanMoliereTheMole.inkable).toBe(true);
  });
});
