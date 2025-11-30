import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { mirabelMadrigalProphecyFinder } from "./019-mirabel-madrigal-prophecy-finder";

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(mirabelMadrigalProphecyFinder, "Support")).toBe(true);
  });
});
