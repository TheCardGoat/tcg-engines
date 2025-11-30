import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { princeEricSeafaringPrince } from "./021-prince-eric-seafaring-prince";

describe("Prince Eric - Seafaring Prince", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(princeEricSeafaringPrince)).toBe(true);
  });
});
