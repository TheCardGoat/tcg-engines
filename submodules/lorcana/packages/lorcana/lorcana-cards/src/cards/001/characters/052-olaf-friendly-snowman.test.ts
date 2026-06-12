import { describe, expect, it } from "bun:test";
import { olafFriendlySnowman } from "./052-olaf-friendly-snowman";

describe("Olaf - Friendly Snowman", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(olafFriendlySnowman.vanilla).toBe(true);
    expect(olafFriendlySnowman.abilities).toBeUndefined();
  });
});
