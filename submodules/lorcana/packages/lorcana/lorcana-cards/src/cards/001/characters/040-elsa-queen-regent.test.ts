import { describe, expect, it } from "bun:test";
import { elsaQueenRegent } from "./040-elsa-queen-regent";

describe("Elsa - Queen Regent", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(elsaQueenRegent.vanilla).toBe(true);
    expect(elsaQueenRegent.abilities).toBeUndefined();
  });
});
