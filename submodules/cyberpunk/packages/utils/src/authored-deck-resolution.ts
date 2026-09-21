import { mergeDuplicateCards, structuredCards } from "@tcg/cyberpunk-cards";
import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { AuthoredBotLabDeckSpec } from "./authored-decks.ts";

export interface ResolvedAuthoredBotLabDeck {
  readonly id: string;
  readonly title: string;
  readonly legends: CardDefinition[];
  /** Repeated copies in spec insertion order — 40 cards for a legal list. */
  readonly mainDeck: CardDefinition[];
}

// Legend cards spell "Name: Subtitle" while deck lists may spell the same
// title with a dash; fold both separators to spaces so one normalized form
// matches every spelling, mirroring the ai-runner name matcher.
const TITLE_SEPARATOR_PATTERN = /[-‐‑‒–—―:]/g;

function normalizeDeckCardName(value: string): string {
  return value.toLowerCase().replace(TITLE_SEPARATOR_PATTERN, " ").replace(/\s+/g, " ").trim();
}

const cardsByName: ReadonlyMap<string, CardDefinition> = (() => {
  const map = new Map<string, CardDefinition>();
  for (const card of mergeDuplicateCards(structuredCards)) {
    for (const key of [card.displayName, card.name]) {
      if (key) map.set(normalizeDeckCardName(key), card);
    }
  }
  return map;
})();

/**
 * Resolve an authored bot-lab deck spec against the structured catalog.
 * Throws on any unknown card name so stale authored lists fail at
 * construction rather than producing a padded or silently trimmed deck.
 */
export function resolveAuthoredBotLabDeck(
  spec: AuthoredBotLabDeckSpec,
): ResolvedAuthoredBotLabDeck {
  const resolve = (name: string): CardDefinition => {
    const card = cardsByName.get(normalizeDeckCardName(name));
    if (!card) {
      throw new Error(`Authored bot-lab deck "${spec.id}" references unknown card "${name}"`);
    }
    return card;
  };
  return {
    id: spec.id,
    title: spec.title,
    legends: spec.legends.map(resolve),
    mainDeck: Object.entries(spec.mainDeck).flatMap(([name, count]) =>
      Array.from({ length: count }, () => resolve(name)),
    ),
  };
}
