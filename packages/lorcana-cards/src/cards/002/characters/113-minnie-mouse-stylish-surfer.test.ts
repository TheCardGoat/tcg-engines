import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { minnieMouseStylishSurfer } from "./113-minnie-mouse-stylish-surfer";

describe("Minnie Mouse - Stylish Surfer", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(minnieMouseStylishSurfer)).toBe(true);
  });
});
