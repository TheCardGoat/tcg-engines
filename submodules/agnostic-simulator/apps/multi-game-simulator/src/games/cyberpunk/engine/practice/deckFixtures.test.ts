import { describe, expect, it } from "vitest";

import {
  DEFAULT_BOT_PRACTICE_DECK_ID,
  DEFAULT_PLAYER_PRACTICE_DECK_ID,
  PRACTICE_DECK_FIXTURES,
  getPracticeDeckFixture,
} from "./deckFixtures";
import { authoredBotLabDeckSpecs } from "@tcg/cyberpunk-utils";

describe("cyberpunk practice deck fixtures", () => {
  it("keeps the engine defaults first", () => {
    expect(PRACTICE_DECK_FIXTURES[0]?.id).toBe(DEFAULT_PLAYER_PRACTICE_DECK_ID);
    expect(PRACTICE_DECK_FIXTURES[1]?.id).toBe(DEFAULT_BOT_PRACTICE_DECK_ID);
  });

  it("exposes every authored bot-lab deck as a fixture", () => {
    for (const spec of authoredBotLabDeckSpecs) {
      const fixture = getPracticeDeckFixture(spec.id);
      expect(fixture, spec.id).toBeTruthy();
      expect(fixture?.label).toBe(spec.title);
      expect(fixture?.deck.legends).toHaveLength(3);
      expect(fixture?.deck.mainDeck).toHaveLength(40);
    }
  });

  it("keeps fixture ids unique", () => {
    const ids = PRACTICE_DECK_FIXTURES.map((fixture) => fixture.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
