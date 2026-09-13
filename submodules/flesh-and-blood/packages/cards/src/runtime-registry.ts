import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { getFleshAndBloodPhysicalCanonicalId } from "./catalog.ts";
import { closeCreatedObjectDependencies } from "./created-object-dependencies.ts";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "./generated/card-registry.generated.ts";
import { firstClassDoubleFacedCards } from "./double-faced-layouts.ts";

export const PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID = firstClassDoubleFacedCards(
  STRUCTURED_CARDS_BY_CANONICAL_ID.values(),
);

/** Return structured cards from the generated, statically imported registry. */
export async function loadFleshAndBloodStructuredCards(
  cardIds: readonly string[],
): Promise<ReadonlyMap<string, FleshAndBloodCard>> {
  const requestedCanonicalIds = new Set(
    cardIds
      .map(getFleshAndBloodPhysicalCanonicalId)
      .filter((canonicalId): canonicalId is string => canonicalId !== undefined),
  );
  const cards = new Map(
    [...requestedCanonicalIds].flatMap((canonicalId) => {
      const card = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(canonicalId);
      return card ? [[canonicalId, card] as const] : [];
    }),
  );
  if (cards.size === 0) return cards;

  return closeCreatedObjectDependencies(cards, PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID);
}

/** Localized authored face for deterministic card QA, before physical face pairing. */
export function getFleshAndBloodAuthoredFace(canonicalId: string): FleshAndBloodCard | undefined {
  return STRUCTURED_CARDS_BY_CANONICAL_ID.get(canonicalId);
}
