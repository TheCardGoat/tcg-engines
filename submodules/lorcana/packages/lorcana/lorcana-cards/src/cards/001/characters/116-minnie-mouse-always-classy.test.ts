import { describe, expect, it } from "bun:test";
import { minnieMouseAlwaysClassy } from "./116-minnie-mouse-always-classy";

describe("Minnie Mouse - Always Classy", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(minnieMouseAlwaysClassy.vanilla).toBe(true);
    expect(minnieMouseAlwaysClassy.abilities).toBeUndefined();
  });
});
