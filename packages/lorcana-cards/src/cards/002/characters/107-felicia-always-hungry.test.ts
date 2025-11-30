import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { feliciaAlwaysHungry } from "./107-felicia-always-hungry";

describe("Felicia - Always Hungry", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(feliciaAlwaysHungry)).toBe(true);
  });
});
