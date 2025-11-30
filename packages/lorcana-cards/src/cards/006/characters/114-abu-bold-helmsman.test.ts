import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { abuBoldHelmsman } from "./114-abu-bold-helmsman";

describe("Abu - Bold Helmsman", () => {
  it("should have Rush ability", () => {
    expect(hasRush(abuBoldHelmsman)).toBe(true);
  });
});
