import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { markowskiSpaceTrooper } from "./113-markowski-space-trooper";

describe("Markowski - Space Trooper", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(markowskiSpaceTrooper)).toBe(true);
  });
});
