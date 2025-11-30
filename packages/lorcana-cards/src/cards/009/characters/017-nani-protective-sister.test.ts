import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { naniProtectiveSister } from "./017-nani-protective-sister";

describe("Nani - Protective Sister", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(naniProtectiveSister)).toBe(true);
  });
});
