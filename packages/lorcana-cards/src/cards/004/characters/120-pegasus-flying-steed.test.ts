import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { pegasusFlyingSteed } from "./120-pegasus-flying-steed";

describe("Pegasus - Flying Steed", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(pegasusFlyingSteed)).toBe(true);
  });
});
