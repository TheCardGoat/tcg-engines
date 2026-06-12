import { describe, expect, it } from "bun:test";
import { sergeantTibbsCourageousCat } from "./124-sergeant-tibbs-courageous-cat";

describe("Sergeant Tibbs - Courageous Cat", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(sergeantTibbsCourageousCat.vanilla).toBe(true);
    expect(sergeantTibbsCourageousCat.abilities).toBeUndefined();
  });
});
