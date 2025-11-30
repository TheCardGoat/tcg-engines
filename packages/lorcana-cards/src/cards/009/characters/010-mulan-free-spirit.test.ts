import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { mulanFreeSpirit } from "./010-mulan-free-spirit";

describe("Mulan - Free Spirit", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(mulanFreeSpirit, "Support")).toBe(true);
  });
});
