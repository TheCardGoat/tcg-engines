import { describe, expect, it } from "bun:test";
import { archimedesHighlyEducatedOwl } from "./036-archimedes-highly-educated-owl";

describe("Archimedes - Highly Educated Owl", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(archimedesHighlyEducatedOwl.vanilla).toBe(true);
    expect(archimedesHighlyEducatedOwl.abilities).toBeUndefined();
  });
});
