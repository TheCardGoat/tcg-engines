import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { kaaSecretiveSnake } from "./212-kaa-secretive-snake";

describe("Kaa - Secretive Snake", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(kaaSecretiveSnake)).toBe(true);
  });
});
