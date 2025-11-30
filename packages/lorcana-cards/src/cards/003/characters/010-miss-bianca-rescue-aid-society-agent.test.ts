import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { missBiancaRescueAidSocietyAgent } from "./010-miss-bianca-rescue-aid-society-agent";

describe("Miss Bianca - Rescue Aid Society Agent", () => {
  it("should have Singer 4 ability", () => {
    expect(hasKeyword(missBiancaRescueAidSocietyAgent, "Singer")).toBe(true);
  });
});
