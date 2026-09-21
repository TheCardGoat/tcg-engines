export { validateDeck } from "./deck-validation.ts";
export type { DeckValidationError, DeckValidationErrorCode } from "./deck-validation.ts";
export { authoredBotLabDeckSpecs } from "./authored-decks.ts";
export type { AuthoredBotLabDeckSpec } from "./authored-decks.ts";
export { resolveAuthoredBotLabDeck } from "./authored-deck-resolution.ts";
export type { ResolvedAuthoredBotLabDeck } from "./authored-deck-resolution.ts";
export {
  authoredDeckStrategyProfiles,
  allDeckStrategyProfiles,
  deckProfileFor,
} from "./deck-profiles.ts";
export type {
  AuthoredBotLabDeckId,
  AuthoredDeckStrategyProfile,
  AuthoredDeckMulliganTuning,
  GearHostPreferType,
} from "./deck-profiles.ts";
export {
  DECK_ARCHETYPE_SIGNATURES,
  matchDeckProfile,
  resolveDeckProfile,
} from "./deck-archetype-match.ts";
export type { DeckArchetypeSignature } from "./deck-archetype-match.ts";
