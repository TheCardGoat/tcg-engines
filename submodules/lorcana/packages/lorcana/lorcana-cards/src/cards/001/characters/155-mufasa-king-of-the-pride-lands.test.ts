import { describe, expect, it } from "bun:test";
import { mufasaKingOfThePrideLands } from "./155-mufasa-king-of-the-pride-lands";

describe("Mufasa - King of the Pride Lands", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(mufasaKingOfThePrideLands.vanilla).toBe(true);
    expect(mufasaKingOfThePrideLands.abilities).toBeUndefined();
  });
});
