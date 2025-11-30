import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { jimDearBelovedHusband } from "./012-jim-dear-beloved-husband";

describe("Jim Dear - Beloved Husband", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(jimDearBelovedHusband)).toBe(true);
  });
});
