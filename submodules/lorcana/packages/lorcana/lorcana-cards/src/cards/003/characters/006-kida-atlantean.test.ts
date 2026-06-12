import { describe, expect, it } from "bun:test";
import { kidaAtlantean } from "./006-kida-atlantean";

describe("Kida - Atlantean", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(kidaAtlantean.vanilla).toBe(true);
    expect(kidaAtlantean.abilities).toBeUndefined();
  });
});
