import { describe, expect, it } from "bun:test";
import { aladdinResoluteSwordsman } from "./172-aladdin-resolute-swordsman";

describe("Aladdin - Resolute Swordsman", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(aladdinResoluteSwordsman.vanilla).toBe(true);
    expect(aladdinResoluteSwordsman.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(aladdinResoluteSwordsman.cost).toBe(1);
    expect(aladdinResoluteSwordsman.strength).toBe(1);
    expect(aladdinResoluteSwordsman.willpower).toBe(3);
    expect(aladdinResoluteSwordsman.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(aladdinResoluteSwordsman.inkable).toBe(true);
  });
});
