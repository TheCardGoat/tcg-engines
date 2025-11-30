import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { herculesTrueHero } from "./191-hercules-true-hero";

describe("Hercules - True Hero", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(herculesTrueHero)).toBe(true);
  });
});
