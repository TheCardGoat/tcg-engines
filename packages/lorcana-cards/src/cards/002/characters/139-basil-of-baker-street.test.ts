import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { basilOfBakerStreet } from "./139-basil-of-baker-street";

describe("Basil - Of Baker Street", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(basilOfBakerStreet, "Support")).toBe(true);
  });
});
