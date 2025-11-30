import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { vanellopeVonSchweetzSpunkySpeedster } from "./124-vanellope-von-schweetz-spunky-speedster";

describe("Vanellope Von Schweetz - Spunky Speedster", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(vanellopeVonSchweetzSpunkySpeedster)).toBe(true);
  });
});
