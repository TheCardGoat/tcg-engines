import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { jafarWickedSorcerer } from "./045-jafar-wicked-sorcerer";

describe("Jafar - Wicked Sorcerer", () => {
  it("should have Challenger 3 ability", () => {
    expect(hasKeyword(jafarWickedSorcerer, "Challenger")).toBe(true);
  });
});
