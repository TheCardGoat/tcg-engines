import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { peterPanFearlessFighter } from "./119-peter-pan-fearless-fighter";

describe("Peter Pan - Fearless Fighter", () => {
  it("should have Rush ability", () => {
    expect(hasRush(peterPanFearlessFighter)).toBe(true);
  });
});
