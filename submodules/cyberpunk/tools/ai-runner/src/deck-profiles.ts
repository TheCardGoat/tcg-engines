/**
 * Authored deck strategy profiles now live in `@tcg/cyberpunk-utils` next to
 * the lists they describe. Re-exported here so existing bench imports stay
 * stable.
 */
export {
  allDeckStrategyProfiles,
  authoredDeckStrategyProfiles,
  deckProfileFor,
  DECK_ARCHETYPE_SIGNATURES,
  matchDeckProfile,
  resolveDeckProfile,
} from "@tcg/cyberpunk-utils";
export type {
  AuthoredBotLabDeckId,
  AuthoredDeckStrategyProfile,
  DeckArchetypeSignature,
} from "@tcg/cyberpunk-utils";
