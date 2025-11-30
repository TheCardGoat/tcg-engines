import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { sleepySluggishKnight } from "./177-sleepy-sluggish-knight";

describe("Sleepy - Sluggish Knight", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(sleepySluggishKnight)).toBe(true);
  });
});
