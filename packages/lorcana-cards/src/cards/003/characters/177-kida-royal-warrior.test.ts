import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { kidaRoyalWarrior } from "./177-kida-royal-warrior";

describe("Kida - Royal Warrior", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(kidaRoyalWarrior)).toBe(true);
  });
});
