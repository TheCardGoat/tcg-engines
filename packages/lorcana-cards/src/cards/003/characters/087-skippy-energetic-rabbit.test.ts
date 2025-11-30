import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { skippyEnergeticRabbit } from "./087-skippy-energetic-rabbit";

describe("Skippy - Energetic Rabbit", () => {
  it("should have Ward ability", () => {
    expect(hasWard(skippyEnergeticRabbit)).toBe(true);
  });
});
