import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { kaaSuspiciousSerpent } from "./072-kaa-suspicious-serpent";

describe("Kaa - Suspicious Serpent", () => {
  it("should have Ward ability", () => {
    expect(hasWard(kaaSuspiciousSerpent)).toBe(true);
  });
});
