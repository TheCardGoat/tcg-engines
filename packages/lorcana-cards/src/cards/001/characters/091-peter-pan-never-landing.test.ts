import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { peterPanNeverLanding } from "./091-peter-pan-never-landing";

describe("Peter Pan - Never Landing", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(peterPanNeverLanding)).toBe(true);
  });
});
