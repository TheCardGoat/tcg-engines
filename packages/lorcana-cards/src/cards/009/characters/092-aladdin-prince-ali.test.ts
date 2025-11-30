import { describe, expect, it } from "bun:test";
import { hasWard } from "@tcg/lorcana";
import { aladdinPrinceAli } from "./092-aladdin-prince-ali";

describe("Aladdin - Prince Ali", () => {
  it("should have Ward ability", () => {
    expect(hasWard(aladdinPrinceAli)).toBe(true);
  });
});
