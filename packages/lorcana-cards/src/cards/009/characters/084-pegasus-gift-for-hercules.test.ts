import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { pegasusGiftForHercules } from "./084-pegasus-gift-for-hercules";

describe("Pegasus - Gift for Hercules", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(pegasusGiftForHercules)).toBe(true);
  });
});
