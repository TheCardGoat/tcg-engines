export * from "./cards/index.ts";
export * from "./cards/source-titles.ts";
export { GUNDAM_CARDS_RUNTIME } from "./runtime-fingerprint.ts";
export type { GundamCardsRuntimeFingerprint } from "./runtime-fingerprint.ts";

// Atelier (alt-art acquisition/rental) data projection for the platform
// deckbuilder + atelier backend. See `src/atelier.ts`.
export {
  GUNDAM_RARITY_RANK,
  GUNDAM_RARITY_TO_CODE,
  defaultGundamPrintingId,
  getGundamCanonicalForCardId,
  getGundamCardDisplay,
  getGundamPrintingInfo,
  getGundamPrintingInfosForCanonical,
  gundamPrintingEffectiveRarityCode,
  gundamRarityCode,
  isGundamAlternateArtPrinting,
  isGundamPrintingOfCanonical,
  listGundamCanonicalIds,
  type AltArtRarityCode,
  type GundamPrintingInfo,
} from "./atelier.ts";
