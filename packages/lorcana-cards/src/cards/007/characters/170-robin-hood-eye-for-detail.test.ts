import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { robinHoodEyeForDetail } from "./170-robin-hood-eye-for-detail";

describe("Robin Hood - Eye for Detail", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(robinHoodEyeForDetail, "Support")).toBe(true);
  });
});
