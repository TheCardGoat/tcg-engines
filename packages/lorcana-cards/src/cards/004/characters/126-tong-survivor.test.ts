import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { tongSurvivor } from "./126-tong-survivor";

describe("Tong - Survivor", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(tongSurvivor)).toBe(true);
  });
});
