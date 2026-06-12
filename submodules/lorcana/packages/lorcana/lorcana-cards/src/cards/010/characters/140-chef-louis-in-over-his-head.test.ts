import { describe, expect, it } from "bun:test";
import { chefLouisInOverHisHead } from "./140-chef-louis-in-over-his-head";

describe("Chef Louis - In Over His Head", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(chefLouisInOverHisHead.vanilla).toBe(true);
    expect(chefLouisInOverHisHead.abilities).toBeUndefined();
  });
});
