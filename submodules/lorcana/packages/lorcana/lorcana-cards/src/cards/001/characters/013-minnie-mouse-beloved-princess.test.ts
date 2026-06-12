import { describe, expect, it } from "bun:test";
import { minnieMouseBelovedPrincess } from "./013-minnie-mouse-beloved-princess";

describe("Minnie Mouse - Beloved Princess", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(minnieMouseBelovedPrincess.vanilla).toBe(true);
    expect(minnieMouseBelovedPrincess.abilities).toBeUndefined();
  });
});
