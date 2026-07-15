import { describe, expect, it } from "bun:test";
import { donaldDuckBoisterousFowl } from "./108-donald-duck-boisterous-fowl";

describe("Donald Duck - Boisterous Fowl", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(donaldDuckBoisterousFowl.vanilla).toBe(true);
    expect(donaldDuckBoisterousFowl.abilities).toBeUndefined();
  });
});
