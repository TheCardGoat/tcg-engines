import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { wasabiAlwaysPrepared } from "./158-wasabi-always-prepared";

describe("Wasabi - Always Prepared", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(wasabiAlwaysPrepared, "Support")).toBe(true);
  });
});
