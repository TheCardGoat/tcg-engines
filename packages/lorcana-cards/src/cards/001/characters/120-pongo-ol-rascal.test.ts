import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { pongoOlRascal } from "./120-pongo-ol-rascal";

describe("Pongo - Ol’ Rascal", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(pongoOlRascal)).toBe(true);
  });
});
