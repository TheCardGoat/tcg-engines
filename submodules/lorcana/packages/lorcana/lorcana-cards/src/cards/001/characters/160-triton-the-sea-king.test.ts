import { describe, expect, it } from "bun:test";
import { tritonTheSeaKing } from "./160-triton-the-sea-king";

describe("Triton - The Sea King", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(tritonTheSeaKing.vanilla).toBe(true);
    expect(tritonTheSeaKing.abilities).toBeUndefined();
  });
});
