import { describe, expect, it } from "bun:test";
import { benjaBoldUniter } from "./104-benja-bold-uniter";

describe("Benja - Bold Uniter", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(benjaBoldUniter.vanilla).toBe(true);
    expect(benjaBoldUniter.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(benjaBoldUniter.cost).toBe(4);
    expect(benjaBoldUniter.strength).toBe(5);
    expect(benjaBoldUniter.willpower).toBe(3);
    expect(benjaBoldUniter.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(benjaBoldUniter.inkable).toBe(true);
  });
});
