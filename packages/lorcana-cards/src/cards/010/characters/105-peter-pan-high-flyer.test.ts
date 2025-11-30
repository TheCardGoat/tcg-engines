import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { peterPanHighFlyer } from "./105-peter-pan-high-flyer";

describe("Peter Pan - High Flyer", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(peterPanHighFlyer)).toBe(true);
  });
});
