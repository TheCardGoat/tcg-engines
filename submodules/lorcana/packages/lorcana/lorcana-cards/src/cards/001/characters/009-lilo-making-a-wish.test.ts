import { describe, expect, it } from "bun:test";
import { liloMakingAWish } from "./009-lilo-making-a-wish";

describe("Lilo - Making a Wish", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(liloMakingAWish.vanilla).toBe(true);
    expect(liloMakingAWish.abilities).toBeUndefined();
  });
});
