import type { Card } from "@tcg/gundam-types";
import type { CardCatalog, CardsMaps } from "../types/base-card.ts";
import type { PlayerId } from "../types/branded.ts";

export interface Player {
  id: PlayerId;
  name: string;
  deck: string[]; // definition IDs — 50-card main deck
  resourceDeck: string[]; // definition IDs — 10-card resource deck
}

export interface MatchStaticResources<TCard extends Card = Card> {
  catalog: CardCatalog;
  cardsMaps: CardsMaps;
  players: Player[];
  getDefinition: (definitionId: string) => TCard | undefined;
}

export function createStaticResources<TCard extends Card>(
  players: Player[],
  catalog: CardCatalog,
): MatchStaticResources<TCard> {
  const instancesMap = new Map<string, { definitionId: string; ownerID: string }>();
  const definitionsMap = new Map<string, Card>();

  function registerCards(playerId: PlayerId, cardIds: string[], prefix: string): void {
    for (let i = 0; i < cardIds.length; i++) {
      const definitionId = cardIds[i];
      const instanceId = `${playerId}_${prefix}_${definitionId}_${i}`;
      instancesMap.set(instanceId, { definitionId, ownerID: playerId });

      if (!definitionsMap.has(definitionId)) {
        const def = catalog.get(definitionId);
        if (def) {
          definitionsMap.set(definitionId, def);
        }
      }
    }
  }

  for (const player of players) {
    registerCards(player.id, player.deck, "deck");
    registerCards(player.id, player.resourceDeck, "resourceDeck");
  }

  const cardsMaps: CardsMaps = {
    instances: {
      entries(): IterableIterator<{ instanceId: string; definitionId: string; ownerID: string }> {
        const entries = instancesMap.entries();
        return (function* () {
          for (const [instanceId, value] of entries) {
            yield { instanceId, ...value };
          }
        })();
      },
      get(instanceId: string) {
        return instancesMap.get(instanceId);
      },
      register(instanceId: string, entry: { definitionId: string; ownerID: string }): void {
        instancesMap.set(instanceId, entry);
      },
      delete(instanceId: string): void {
        instancesMap.delete(instanceId);
      },
      get size() {
        return instancesMap.size;
      },
    },
    definitions: definitionsMap,
  };

  return {
    catalog,
    cardsMaps,
    players,
    getDefinition(definitionId: string): TCard | undefined {
      // Runtime-registered definitions (e.g. setup tokens spawned by
      // `framework.cards.registerDefinition`) live in `cardsMaps.definitions`
      // keyed by their synthetic instance id, not in the static `catalog`
      // (which is keyed by printed cardNumber). Check the runtime map first
      // so the view filter can resolve those tokens; fall back to the
      // catalog for ordinary deck cards.
      return (definitionsMap.get(definitionId) ?? catalog.get(definitionId)) as TCard | undefined;
    },
  };
}
