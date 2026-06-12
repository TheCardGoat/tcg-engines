import { describe, expect, it } from "bun:test";
import { johnSilverTerrorOfTheRealm } from "./148-john-silver-terror-of-the-realm";

describe("John Silver - Terror of the Realm", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(johnSilverTerrorOfTheRealm.vanilla).toBe(true);
    expect(johnSilverTerrorOfTheRealm.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(johnSilverTerrorOfTheRealm.cost).toBe(8);
    expect(johnSilverTerrorOfTheRealm.strength).toBe(8);
    expect(johnSilverTerrorOfTheRealm.willpower).toBe(8);
    expect(johnSilverTerrorOfTheRealm.lore).toBe(3);
  });

  it("is inkable", () => {
    expect(johnSilverTerrorOfTheRealm.inkable).toBe(true);
  });
});
