export {
  GUNDAM_MAIN_DECK_SIZE,
  GUNDAM_RESOURCE_DECK_SIZE,
  GUNDAM_MAX_COPIES_PER_CARD,
  GUNDAM_MAX_DECK_COLORS,
  GUNDAM_SIDEBOARD_SIZE,
  validateDeckList,
  isDeckListToken,
} from "./deck-list.ts";
export type {
  DeckList,
  DeckListEntry,
  DeckListResourceEntry,
  DeckValidationOptions,
  DeckValidationResult,
  DeckValidationViolation,
  BaseDeckValidationViolation,
  BaseDeckValidationViolationCode,
  DeckListZone,
  GundamDeckConstructionFormat,
} from "./deck-list.ts";

export {
  evaluateGundamFormatLegality,
  selectGundamFormatLegalityPolicy,
} from "./format-legality.ts";

export {
  GUNDAM_EN_US_APRIL_2026_POLICY_URL,
  GUNDAM_EN_US_CONSTRUCTED_FORMAT_ID,
  GUNDAM_EN_US_CURRENT_POLICY_URL,
  GUNDAM_EN_US_JULY_2026_ANNOUNCEMENT_URL,
  GUNDAM_EN_US_JULY_2026_VANILLA_UNIT_GROUP,
  GUNDAM_EN_US_OFFICIAL_FORMAT_POLICIES,
} from "./official-format-policies.ts";
export type {
  AppliedFormatPolicy,
  DeckCardIdentityCount,
  FormatLegalityReport,
  FormatLegalityViolation,
  GundamBannedCardRestriction,
  GundamCompositionRestriction,
  GundamCopyRestriction,
  GundamFormatLegalityContext,
  GundamFormatLegalityPolicy,
  GundamRegisteredLineup,
  GundamRegisteredLineupEntry,
  GundamUnchangedLineupException,
  GundamUnresolvedPolicyException,
} from "./format-legality.ts";

export { expandDeck } from "./expand-deck.ts";
export type { ExpandDeckOptions, ExpandedDeck } from "./expand-deck.ts";
