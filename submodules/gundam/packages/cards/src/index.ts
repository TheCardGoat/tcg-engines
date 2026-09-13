export * from "./cards/index.ts";
export * from "./cards/source-titles.ts";
export { seedAggroPrintNPlayDeckList } from "./decks/seed-aggro-print-n-play-deck.ts";
export {
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_VERSION,
  GUNDAM_TOURNAMENT_ARCHETYPE_CLASSIFIER_THRESHOLDS_V1,
  classifyGundamTournamentArchetype,
  projectClassifiedGundamTournamentMetaDeckV1,
  projectGundamTournamentMetaDeckV1,
  type GundamArchetypeClassification,
  type GundamArchetypeClassificationEvidence,
  type GundamArchetypeClassifierConfig,
  type GundamArchetypeClassifierThresholds,
  type GundamArchetypeDeckDocument,
  type GundamArchetypeDeckEntry,
  type GundamArchetypeDeckSection,
  type GundamArchetypeDiagnosticCode,
  type GundamArchetypeMatchedCardEvidence,
  type GundamArchetypeThemeEvidence,
  type GundamTournamentMetaDeckProjectionV1,
  type GundamTournamentMetaProjectedCard,
} from "./meta/archetype-classifier.ts";
export {
  GUNDAM_TOURNAMENT_META_CONSTRUCTED_FORMAT_ID,
  GUNDAM_TOURNAMENT_META_METHODOLOGY_CANDIDATE_V1,
  GUNDAM_TOURNAMENT_META_V1_CONFIG,
  GUNDAM_TOURNAMENT_META_WINDOWS_V1,
} from "./meta/tournament-meta-v1.ts";
export {
  GUNDAM_CATALOG_REGION,
  GUNDAM_EDITORIAL_GAME_SLUG,
  GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES,
  GUNDAM_EN_US_PRODUCT_RELEASES,
  getGundamPrintingRelease,
  getGundamSetRelease,
  isGundamCanonicalCardReleaseEligible,
  isGundamPrintingReleased,
  isGundamSetReleased,
  type GundamCanonicalPrintingReference,
  type GundamCatalogRegion,
  type GundamCatalogReleaseState,
  type GundamEditorialCycleRole,
  type GundamEditorialReleaseCycle,
  type GundamPrintingSetReference,
  type GundamProductRelease,
  type GundamProductType,
  type GundamSetCodeReference,
  type GundamSetRelease,
} from "./catalog-release.ts";
export {
  reconcileGundamReleasedCatalog,
  type GundamCatalogReconciliationInput,
  type GundamCatalogReconciliationReport,
  type GundamObservedCatalogSnapshot,
  type GundamObservedPrinting,
  type GundamObservedProductGroup,
  type GundamReconciliationCard,
} from "./catalog-reconciliation.ts";
export {
  GUNDAM_ROLLING_SOURCE_NAMESPACES,
  getGundamRollingPrintingReleaseEvidence,
  type GundamPublisherReleaseEventEvidence,
  type GundamRollingSourceNamespace,
} from "./catalog-source-policy.ts";
export { GUNDAM_CARDS_RUNTIME } from "./runtime-fingerprint.ts";
export type { GundamCardsRuntimeFingerprint } from "./runtime-fingerprint.ts";
export {
  parseGundamNamedLinkRequirements,
  resolveGundamCardRelationships,
  type GundamCardRelationship,
  type GundamCardRelationshipDiagnostic,
  type GundamCardRelationshipDirection,
  type GundamCardRelationshipKind,
  type GundamCardRelationshipResolution,
  type GundamCardRelationshipTarget,
} from "./relationships.ts";

// Atelier (alt-art acquisition/rental) data projection for the platform
// deckbuilder + atelier backend. See `src/atelier.ts`.
export {
  GUNDAM_EX_BASE_CANONICAL_IDS,
  GUNDAM_EX_RESOURCE_CANONICAL_IDS,
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
