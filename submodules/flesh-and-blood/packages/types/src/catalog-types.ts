import type { BaseCardDefinition, Printing } from "@tcg/card-model";

export interface FleshAndBloodFormatLegality {
  legal: boolean;
  banned: boolean;
  suspended: boolean;
  livingLegend: boolean;
  restricted: boolean;
}

/**
 * Whether a card may be registered in this format.
 * FAB Cube keeps `legal` separate from bans, suspensions, and Living Legend.
 * Living Legend rotates the card out of that format (TRP 7.1). Restricted
 * only lowers the copy limit.
 */
export function isFleshAndBloodFormatPlayable(
  legality: Pick<FleshAndBloodFormatLegality, "legal" | "banned" | "suspended" | "livingLegend">,
): boolean {
  return legality.legal && !legality.banned && !legality.suspended && !legality.livingLegend;
}

export interface FleshAndBloodLegality {
  blitz: FleshAndBloodFormatLegality;
  cc: FleshAndBloodFormatLegality;
  commoner: FleshAndBloodFormatLegality;
  ll: FleshAndBloodFormatLegality;
  silverAge: FleshAndBloodFormatLegality;
}

export interface FleshAndBloodPrinting extends Printing {
  boardImageUrl?: string;
  setPrintingId?: string;
  locale?: string;
  artists?: readonly string[];
  artVariationIds?: readonly string[];
  imageRotationDegrees?: number;
  finish: string;
  edition: string;
  expansionSlot: boolean;
  flavorText?: string;
}

/** Display/catalog record. Executable behavior belongs to FleshAndBloodCard. */
export interface FleshAndBloodCatalogCard extends BaseCardDefinition {
  printings: readonly FleshAndBloodPrinting[];
  functionalTextHtml?: string;
  functionalTextPlain?: string;
  typeText: string;
  playedHorizontally: boolean;
  legalities: FleshAndBloodLegality;
  cardsReferencedBy?: readonly string[];
}
