import { describe, expect, it } from "bun:test";
import { kingLouieBandleader } from "./146-king-louie-bandleader";

describe("King Louie - Bandleader", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(kingLouieBandleader.vanilla).toBe(true);
    expect(kingLouieBandleader.abilities).toBeUndefined();
  });
});
