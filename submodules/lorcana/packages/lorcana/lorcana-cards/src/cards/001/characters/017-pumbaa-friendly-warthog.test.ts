import { describe, expect, it } from "bun:test";
import { pumbaaFriendlyWarthog } from "./017-pumbaa-friendly-warthog";

describe("Pumbaa - Friendly Warthog", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(pumbaaFriendlyWarthog.vanilla).toBe(true);
    expect(pumbaaFriendlyWarthog.abilities).toBeUndefined();
  });
});
