import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { arthurNoviceSparrow } from "./121-arthur-novice-sparrow";

describe("Arthur - Novice Sparrow", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(arthurNoviceSparrow)).toBe(true);
  });
});
