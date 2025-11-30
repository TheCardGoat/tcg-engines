import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { ruttNorthernMoose } from "./004-rutt-northern-moose";

describe("Rutt - Northern Moose", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(ruttNorthernMoose, "Support")).toBe(true);
  });
});
