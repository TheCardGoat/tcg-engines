import { describe, expect, it } from "bun:test";
import { hasVanish } from "@tcg/lorcana";
import { rajahGhostlyTiger } from "./062-rajah-ghostly-tiger";

describe("Rajah - Ghostly Tiger", () => {
  it("should have Vanish ability", () => {
    expect(hasVanish(rajahGhostlyTiger)).toBe(true);
  });
});
