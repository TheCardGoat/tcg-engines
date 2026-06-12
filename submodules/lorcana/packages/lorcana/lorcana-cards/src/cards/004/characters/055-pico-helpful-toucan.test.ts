import { describe, expect, it } from "bun:test";
import { picoHelpfulToucan } from "./055-pico-helpful-toucan";

describe("Pico - Helpful Toucan", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(picoHelpfulToucan.vanilla).toBe(true);
    expect(picoHelpfulToucan.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(picoHelpfulToucan.cost).toBe(2);
    expect(picoHelpfulToucan.strength).toBe(3);
    expect(picoHelpfulToucan.willpower).toBe(2);
    expect(picoHelpfulToucan.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(picoHelpfulToucan.inkable).toBe(true);
  });

  it("has correct classifications", () => {
    expect(picoHelpfulToucan.classifications).toContain("Storyborn");
    expect(picoHelpfulToucan.classifications).toContain("Ally");
  });
});
