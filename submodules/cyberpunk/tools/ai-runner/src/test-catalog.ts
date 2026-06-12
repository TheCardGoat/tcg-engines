import type { CardCatalog, DeckList, PlayerSetup } from "@tcg/cyberpunk-engine";
import { createPlayerId } from "@tcg/cyberpunk-engine";

/**
 * Minimal hand-rolled catalog used by the CLI smoke harness. Mirrors the
 * fixture used in `packages/engine/tests/automation/fixtures.ts` so behaviour
 * is consistent. A future iteration can swap in the real `@tcg/cyberpunk-cards`
 * catalogue and a curated competitive deck list.
 */
export function createTestCatalog(): CardCatalog {
  const cards = new Map<string, unknown>();
  const makeCard = (
    id: string,
    type: string,
    cost: number,
    power: number,
    extra: Record<string, unknown> = {},
  ) => {
    cards.set(id, {
      id,
      type,
      cost,
      power,
      color: "blue",
      keywords: [],
      classifications: [],
      hasSellTag: false,
      abilities: [],
      ...extra,
    });
  };

  makeCard("legend-1", "legend", 5, 8, { hasSellTag: true });
  makeCard("legend-2", "legend", 4, 6, { hasSellTag: true });
  makeCard("legend-3", "legend", 3, 5, { hasSellTag: true });
  for (let i = 1; i <= 40; i++) {
    makeCard(`unit-${i}`, "unit", 2 + (i % 4), 2 + (i % 5), {
      hasSellTag: i % 2 === 0,
    });
  }

  return {
    get(id: string) {
      return cards.get(id) as never;
    },
    *entries() {
      yield* cards.entries() as IterableIterator<[string, never]>;
    },
    get size() {
      return cards.size;
    },
  };
}

export function createTestDeckList(playerId: string): DeckList {
  const mainDeck: string[] = [];
  for (let i = 1; i <= 40; i++) mainDeck.push(`unit-${i}`);
  return {
    playerId,
    playerName: `Player ${playerId}`,
    legends: ["legend-1", "legend-2", "legend-3"],
    mainDeck,
  };
}

export function createTestPlayers(): [PlayerSetup, PlayerSetup] {
  return [
    { id: createPlayerId("p1"), name: "Player 1" },
    { id: createPlayerId("p2"), name: "Player 2" },
  ];
}

export function createTestDecks(): [DeckList, DeckList] {
  return [createTestDeckList("p1"), createTestDeckList("p2")];
}
