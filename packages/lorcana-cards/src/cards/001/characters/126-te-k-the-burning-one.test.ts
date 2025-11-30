import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { teKTheBurningOne } from "./126-te-k-the-burning-one";

describe("Te Kā - The Burning One", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(teKTheBurningOne)).toBe(true);
  });
});
