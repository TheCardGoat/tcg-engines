import { describe, expect, it } from "bun:test";
import { slugify } from "./utils";

describe("slugify", () => {
  it("preserves base letters when folding diacritics", () => {
    expect(slugify("Gilded Matón")).toBe("gilded-maton");
    expect(slugify("Crème Brûlée")).toBe("creme-brulee");
  });
});
