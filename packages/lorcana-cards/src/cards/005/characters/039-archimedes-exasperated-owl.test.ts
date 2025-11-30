import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { archimedesExasperatedOwl } from "./039-archimedes-exasperated-owl";

describe("Archimedes - Exasperated Owl", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(archimedesExasperatedOwl)).toBe(true);
  });
});
