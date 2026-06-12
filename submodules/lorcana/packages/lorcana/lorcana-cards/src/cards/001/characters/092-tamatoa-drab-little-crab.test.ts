import { describe, expect, it } from "bun:test";
import { tamatoaDrabLittleCrab } from "./092-tamatoa-drab-little-crab";

describe("Tamatoa - Drab Little Crab", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(tamatoaDrabLittleCrab.vanilla).toBe(true);
    expect(tamatoaDrabLittleCrab.abilities).toBeUndefined();
  });
});
