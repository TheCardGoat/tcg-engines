import { describe, expect, it } from "bun:test";
import { simbaScrappyCub } from "./123-simba-scrappy-cub";

describe("Simba - Scrappy Cub", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(simbaScrappyCub.vanilla).toBe(true);
    expect(simbaScrappyCub.abilities).toBeUndefined();
  });
});
