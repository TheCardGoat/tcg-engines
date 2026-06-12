import type { OPCard } from "@tcg/op-types";
import { RecordCardCatalog } from "@tcg/op-types";
import * as cardDefinitions from "./cards/index.ts";

function isCardDefinition(value: unknown): value is OPCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OPCard>;
  return typeof candidate.id === "string" && typeof candidate.cardType === "string";
}

const uniqueCards = new Map<string, OPCard>();
for (const value of Object.values(cardDefinitions)) {
  if (!isCardDefinition(value)) {
    continue;
  }

  uniqueCards.set(value.id, value);
}

export const allCards = Object.freeze(
  [...uniqueCards.values()].sort((left, right) => left.id.localeCompare(right.id)),
);

export const cardCatalog = new RecordCardCatalog<OPCard>(
  "one-piece-card-catalog",
  Object.fromEntries(allCards.map((card) => [card.id, card])),
);

export function getCard(id: string): OPCard {
  const card = cardCatalog.get(id);

  if (!card) {
    throw new Error(`Unknown One Piece card: ${id}`);
  }

  return card;
}

export function getAllCards(): readonly OPCard[] {
  return allCards;
}

export function hasCard(id: string): boolean {
  return cardCatalog.has(id);
}

export * from "./cards/index.ts";
