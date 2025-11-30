import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { sirHissAggravatingAsp } from "./086-sir-hiss-aggravating-asp";

describe("Sir Hiss - Aggravating Asp", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(sirHissAggravatingAsp)).toBe(true);
  });
});
