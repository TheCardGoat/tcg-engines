import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { heiheiBoatSnack } from "./007-heihei-boat-snack";

describe("HeiHei - Boat Snack", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(heiheiBoatSnack, "Support")).toBe(true);
  });
});
