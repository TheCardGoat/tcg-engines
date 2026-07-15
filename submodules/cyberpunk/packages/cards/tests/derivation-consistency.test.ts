import { describe, expect, it } from "vite-plus/test";

import { deriveKeywords, deriveTimingTriggers, structuredCards } from "../src/index.ts";

describe("hand-authored card surface matches derivation", () => {
  it("timingTriggers on every card equals deriveTimingTriggers(abilities)", () => {
    const mismatches: Array<{ slug: string; authored: string[]; derived: string[] }> = [];
    for (const card of structuredCards) {
      const derived = deriveTimingTriggers(card.abilities);
      const authored = card.timingTriggers;
      const sameLength = authored.length === derived.length;
      const sameMembers = sameLength && authored.every((t) => derived.includes(t));
      if (!sameMembers) {
        mismatches.push({ slug: card.slug, authored: [...authored], derived });
      }
    }
    expect(mismatches).toEqual([]);
  });

  it("keywords on every card equals deriveKeywords(abilities)", () => {
    const mismatches: Array<{ slug: string; authored: string[]; derived: string[] }> = [];
    for (const card of structuredCards) {
      const derived = deriveKeywords(card.abilities);
      const authored = card.keywords;
      const sameLength = authored.length === derived.length;
      const sameMembers = sameLength && authored.every((k) => derived.includes(k));
      if (!sameMembers) {
        mismatches.push({ slug: card.slug, authored: [...authored], derived });
      }
    }
    expect(mismatches).toEqual([]);
  });
});
