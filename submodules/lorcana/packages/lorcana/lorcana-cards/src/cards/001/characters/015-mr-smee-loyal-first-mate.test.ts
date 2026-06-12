import { describe, expect, it } from "bun:test";
import { mrSmeeLoyalFirstMate } from "./015-mr-smee-loyal-first-mate";

describe("Mr. Smee - Loyal First Mate", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(mrSmeeLoyalFirstMate.vanilla).toBe(true);
    expect(mrSmeeLoyalFirstMate.abilities).toBeUndefined();
  });
});
