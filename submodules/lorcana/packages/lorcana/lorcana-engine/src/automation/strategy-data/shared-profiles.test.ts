import { describe, expect, it } from "bun:test";
import { validateCardHeuristicProfile } from "@tcg/bot-core";

import { BEST_AI_CARD_PROFILES } from "./cards";
import { BEST_AI_SHARED_CARD_PROFILES } from "./shared-profiles";

describe("shared Lorcana card heuristic profiles", () => {
  it("converts every legacy profile into the shared bounded format", () => {
    expect(BEST_AI_SHARED_CARD_PROFILES).toHaveLength(BEST_AI_CARD_PROFILES.length);
    for (const profile of BEST_AI_SHARED_CARD_PROFILES) {
      expect(validateCardHeuristicProfile(profile)).toEqual([]);
      expect(profile.rationale.length).toBeGreaterThan(0);
    }
  });
});
