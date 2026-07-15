import { describe, expect, it } from "bun:test";
import { jasmineDisguised } from "./148-jasmine-disguised";

describe("Jasmine - Disguised", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(jasmineDisguised.vanilla).toBe(true);
    expect(jasmineDisguised.abilities).toBeUndefined();
  });
});
