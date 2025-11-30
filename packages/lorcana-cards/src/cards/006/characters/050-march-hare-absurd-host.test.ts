import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { marchHareAbsurdHost } from "./050-march-hare-absurd-host";

describe("March Hare - Absurd Host", () => {
  it("should have Rush ability", () => {
    expect(hasRush(marchHareAbsurdHost)).toBe(true);
  });
});
