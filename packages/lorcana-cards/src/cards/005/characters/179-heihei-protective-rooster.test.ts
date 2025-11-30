import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { heiheiProtectiveRooster } from "./179-heihei-protective-rooster";

describe("HeiHei - Protective Rooster", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(heiheiProtectiveRooster)).toBe(true);
  });
});
