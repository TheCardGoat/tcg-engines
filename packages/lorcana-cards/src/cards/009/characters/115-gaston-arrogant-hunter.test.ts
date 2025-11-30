import { describe, expect, it } from "bun:test";
import { hasReckless } from "@tcg/lorcana";
import { gastonArrogantHunter } from "./115-gaston-arrogant-hunter";

describe("Gaston - Arrogant Hunter", () => {
  it("should have Reckless ability", () => {
    expect(hasReckless(gastonArrogantHunter)).toBe(true);
  });
});
