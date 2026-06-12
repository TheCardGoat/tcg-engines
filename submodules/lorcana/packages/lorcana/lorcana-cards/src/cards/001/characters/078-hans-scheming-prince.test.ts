import { describe, expect, it } from "bun:test";
import { hansSchemingPrince } from "./078-hans-scheming-prince";

describe("Hans - Scheming Prince", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(hansSchemingPrince.vanilla).toBe(true);
    expect(hansSchemingPrince.abilities).toBeUndefined();
  });
});
