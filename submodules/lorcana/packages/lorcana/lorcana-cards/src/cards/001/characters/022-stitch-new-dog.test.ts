import { describe, expect, it } from "bun:test";
import { stitchNewDog } from "./022-stitch-new-dog";

describe("Stitch - New Dog", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(stitchNewDog.vanilla).toBe(true);
    expect(stitchNewDog.abilities).toBeUndefined();
  });
});
