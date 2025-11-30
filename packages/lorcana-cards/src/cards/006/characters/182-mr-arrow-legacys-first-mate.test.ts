import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { mrArrowLegacysFirstMate } from "./182-mr-arrow-legacys-first-mate";

describe("Mr. Arrow - Legacy's First Mate", () => {
  it("should have Resist 1 ability", () => {
    expect(hasKeyword(mrArrowLegacysFirstMate, "Resist")).toBe(true);
  });
});
