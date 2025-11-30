import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { auroraTranquilPrincess } from "./154-aurora-tranquil-princess";

describe("Aurora - Tranquil Princess", () => {
  it("should have Ward ability", () => {
    expect(hasWard(auroraTranquilPrincess)).toBe(true);
  });
});
