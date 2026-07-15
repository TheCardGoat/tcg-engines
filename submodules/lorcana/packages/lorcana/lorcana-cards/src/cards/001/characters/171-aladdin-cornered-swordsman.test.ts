import { describe, expect, it } from "bun:test";
import { aladdinCorneredSwordsman } from "./171-aladdin-cornered-swordsman";

describe("Aladdin - Cornered Swordsman", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(aladdinCorneredSwordsman.vanilla).toBe(true);
    expect(aladdinCorneredSwordsman.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(aladdinCorneredSwordsman.cost).toBe(2);
    expect(aladdinCorneredSwordsman.strength).toBe(2);
    expect(aladdinCorneredSwordsman.willpower).toBe(1);
    expect(aladdinCorneredSwordsman.lore).toBe(2);
  });

  it("is inkable", () => {
    expect(aladdinCorneredSwordsman.inkable).toBe(true);
  });
});
