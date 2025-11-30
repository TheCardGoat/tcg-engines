import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { dellaDuckUnstoppableMom } from "./106-della-duck-unstoppable-mom";

describe("Della Duck - Unstoppable Mom", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(dellaDuckUnstoppableMom)).toBe(true);
  });
});
