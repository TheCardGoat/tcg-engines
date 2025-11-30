import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { joshuaSweetTheDoctor } from "./005-joshua-sweet-the-doctor";

describe("Joshua Sweet - The Doctor", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(joshuaSweetTheDoctor)).toBe(true);
  });
});
