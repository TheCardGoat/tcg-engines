import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { montereyJackDefiantProtector } from "./188-monterey-jack-defiant-protector";

describe("Monterey Jack - Defiant Protector", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(montereyJackDefiantProtector)).toBe(true);
  });
});
