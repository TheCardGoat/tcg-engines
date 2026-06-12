import { describe, expect, it } from "bun:test";
import { horaceNogoodScoundrel } from "./079-horace-no-good-scoundrel";

describe("Horace - No-Good Scoundrel", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(horaceNogoodScoundrel.vanilla).toBe(true);
    expect(horaceNogoodScoundrel.abilities).toBeUndefined();
  });
});
