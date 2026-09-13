import type { BaseCardDefinition, Printing } from "@tcg/card-model";

export interface FleshAndBloodFormatLegality {
  legal: boolean;
  banned: boolean;
  suspended: boolean;
  livingLegend: boolean;
  restricted: boolean;
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
