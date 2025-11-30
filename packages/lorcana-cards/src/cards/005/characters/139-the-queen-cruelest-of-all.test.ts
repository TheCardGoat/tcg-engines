import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { theQueenCruelestOfAll } from "./139-the-queen-cruelest-of-all";

describe("The Queen - Cruelest of All", () => {
  it("should have Ward ability", () => {
    expect(hasWard(theQueenCruelestOfAll)).toBe(true);
  });
});
