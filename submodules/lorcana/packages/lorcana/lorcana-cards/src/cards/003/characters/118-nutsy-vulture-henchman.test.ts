import { describe, expect, it } from "bun:test";
import { nutsyVultureHenchman } from "./118-nutsy-vulture-henchman";

describe("Nutsy - Vulture Henchman", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(nutsyVultureHenchman.vanilla).toBe(true);
    expect(nutsyVultureHenchman.abilities).toBeUndefined();
  });
});
