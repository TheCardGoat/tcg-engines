import { describe, expect, it } from "bun:test";
import { kronkRighthandMan } from "./183-kronk-right-hand-man";

describe("Kronk - Right-Hand Man", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(kronkRighthandMan.vanilla).toBe(true);
    expect(kronkRighthandMan.abilities).toBeUndefined();
  });
});
