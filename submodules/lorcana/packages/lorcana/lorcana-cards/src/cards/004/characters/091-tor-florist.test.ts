import { describe, expect, it } from "bun:test";
import { torFlorist } from "./091-tor-florist";

describe("Tor - Florist", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(torFlorist.vanilla).toBe(true);
    expect(torFlorist.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(torFlorist.cost).toBe(5);
    expect(torFlorist.strength).toBe(4);
    expect(torFlorist.willpower).toBe(7);
    expect(torFlorist.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(torFlorist.inkable).toBe(true);
  });

  it("has correct classifications", () => {
    expect(torFlorist.classifications).toContain("Dreamborn");
    expect(torFlorist.classifications).toContain("Ally");
  });
});
