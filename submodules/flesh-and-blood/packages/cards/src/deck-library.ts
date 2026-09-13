import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";

import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";
import { fleshAndBloodStructuredCardsByCanonicalId } from "./cards/index.ts";

export interface FleshAndBloodDeckLibraryCard {
  readonly canonicalId: string;
  readonly slug: string;
  readonly name: string;
  readonly runtime: FleshAndBloodCard;
}

/** Caller-owned bridge from display naming to authored executable identity. */
export const fleshAndBloodDeckCardLibrary: readonly FleshAndBloodDeckLibraryCard[] =
  fleshAndBloodCatalog.cards.flatMap((card) => {
    const runtime = fleshAndBloodStructuredCardsByCanonicalId.get(card.canonicalId);
    return runtime
      ? [{ canonicalId: card.canonicalId, slug: card.slug, name: card.name, runtime }]
      : [];
  });
