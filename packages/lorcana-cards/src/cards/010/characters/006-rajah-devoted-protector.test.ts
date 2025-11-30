import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { rajahDevotedProtector } from "./006-rajah-devoted-protector";

describe("Rajah - Devoted Protector", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(rajahDevotedProtector)).toBe(true);
  });
});
