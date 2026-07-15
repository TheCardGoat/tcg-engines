import { describe, expect, it } from "bun:test";
import { tukTukCuriousPartner } from "./161-tuk-tuk-curious-partner";

describe("Tuk Tuk - Curious Partner", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(tukTukCuriousPartner.vanilla).toBe(true);
    expect(tukTukCuriousPartner.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(tukTukCuriousPartner.cost).toBe(2);
    expect(tukTukCuriousPartner.strength).toBe(2);
    expect(tukTukCuriousPartner.willpower).toBe(3);
    expect(tukTukCuriousPartner.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(tukTukCuriousPartner.inkable).toBe(true);
  });
});
