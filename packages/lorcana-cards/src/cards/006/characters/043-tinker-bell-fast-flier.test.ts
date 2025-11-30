import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { tinkerBellFastFlier } from "./043-tinker-bell-fast-flier";

describe("Tinker Bell - Fast Flier", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(tinkerBellFastFlier)).toBe(true);
  });
});
