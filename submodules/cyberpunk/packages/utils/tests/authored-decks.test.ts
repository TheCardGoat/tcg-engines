import { describe, expect, it } from "vite-plus/test";

import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";
import { resolveAuthoredBotLabDeck } from "../src/authored-deck-resolution.ts";

describe("authored bot-lab deck specs", () => {
  it("resolves every authored deck against the structured catalog", () => {
    expect(authoredBotLabDeckSpecs.length).toBeGreaterThan(0);
    for (const spec of authoredBotLabDeckSpecs) {
      const resolved = resolveAuthoredBotLabDeck(spec);
      expect(resolved.legends).toHaveLength(3);
      expect(resolved.mainDeck).toHaveLength(40);
      expect(resolved.legends.every((card) => card.type === "legend")).toBe(true);
      expect(resolved.mainDeck.every((card) => card.type !== "legend")).toBe(true);
    }
  });

  it("keeps authored deck ids unique", () => {
    const ids = authoredBotLabDeckSpecs.map((spec) => spec.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("expands repeated cards in insertion order", () => {
    const spec = authoredBotLabDeckSpecs[0];
    if (!spec) throw new Error("authored bot-lab deck specs must not be empty");
    const resolved = resolveAuthoredBotLabDeck(spec);
    const firstEntry = Object.entries(spec.mainDeck)[0];
    if (!firstEntry) throw new Error("authored bot-lab deck main deck must not be empty");
    const [firstName, count] = firstEntry;
    for (let index = 0; index < count; index++) {
      const card = resolved.mainDeck[index];
      expect(card?.name === firstName || card?.displayName === firstName).toBe(true);
    }
  });
});
