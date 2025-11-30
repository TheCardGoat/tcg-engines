import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { tukTukWreckingBall } from "./128-tuk-tuk-wrecking-ball";

describe("Tuk Tuk - Wrecking Ball", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(tukTukWreckingBall)).toBe(true);
  });
});
