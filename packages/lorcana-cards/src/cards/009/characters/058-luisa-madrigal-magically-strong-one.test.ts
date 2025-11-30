import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { luisaMadrigalMagicallyStrongOne } from "./058-luisa-madrigal-magically-strong-one";

describe("Luisa Madrigal - Magically Strong One", () => {
  it("should have Rush ability", () => {
    expect(hasRush(luisaMadrigalMagicallyStrongOne)).toBe(true);
  });
});
