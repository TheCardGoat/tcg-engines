import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { rafikiMysteriousSage } from "./054-rafiki-mysterious-sage";

describe("Rafiki - Mysterious Sage", () => {
  it("should have Rush ability", () => {
    expect(hasRush(rafikiMysteriousSage)).toBe(true);
  });
});
