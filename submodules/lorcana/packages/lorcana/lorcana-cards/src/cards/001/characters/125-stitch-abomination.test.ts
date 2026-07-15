import { describe, expect, it } from "bun:test";
import { stitchAbomination } from "./125-stitch-abomination";

describe("Stitch - Abomination", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(stitchAbomination.vanilla).toBe(true);
    expect(stitchAbomination.abilities).toBeUndefined();
  });
});
