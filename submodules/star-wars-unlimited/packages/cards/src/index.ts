import type { SwuCard } from "@tcg/star-wars-unlimited-types";
import { allCards } from "./generated.ts";

export { allCardDefinitions } from "./cards/index.ts";

export {
  allCards,
  allNonLeaderCardTitles,
  cardCatalogData,
  cardMap,
  leaderNames,
  playableCardTitles,
  setCodeMap,
} from "./generated.ts";

export { createSwuPackSimulator, SwuPackSimulator } from "./pack-simulator/index.ts";
export type { SwuPackSimulatorOptions } from "./pack-simulator/index.ts";
export {
  defaultSwuPrintingId,
  getSwuCanonicalForCardId,
  getSwuPrintingInfo,
  getSwuPrintingInfosForCanonical,
  isSwuPrintingOfCanonical,
  type SwuPrintingIdentityInfo,
} from "./identity.ts";

export function getCard(id: string): SwuCard {
  const card = allCardsById.get(id);
  if (!card) {
    throw new Error(`Unknown Star Wars Unlimited card: ${id}`);
  }
  return card;
}

export function hasCard(id: string): boolean {
  return allCardsById.has(id);
}

const allCardsById: ReadonlyMap<string, SwuCard> = new Map(allCards.map((card) => [card.id, card]));

/**
 * Get all SWU cards.
 */
export function getAllCards(): SwuCard[] {
  return [...allCards];
}

/**
 * Get all SWU cards keyed by id.
 */
export function getAllCardsById(): Record<string, SwuCard> {
  const byId: Record<string, SwuCard> = {};
  for (const card of allCards) {
    byId[card.id] = card;
  }
  return byId;
}
