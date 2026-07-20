export type {
  CardsMaps,
  DeckEntry,
  DeckBuildInput,
  DeckCard,
  DeckMetadataFacetKind,
  DeckMetadataFacetDefinition,
  DeckMetadataMember,
  DeckMetadataFacet,
  DeckMetadataProjection,
  GameMetadataCapabilities,
  GameMetadataAdapter,
  DeckFormatRule,
  DeckFormatResult,
  CardSummary,
  GameRuntimeFingerprint,
  GameAdapter,
  ServerGameAdapter,
} from "./types.js";
export type { PlayableGameSlug } from "@tcg/protocol/games";
export { PLAYABLE_GAME_SLUGS, isPlayableGameSlug } from "@tcg/protocol/games";

export {
  buildColorMetadataFacets,
  normalizeMetadataColors,
  sortMetadataFacets,
} from "./metadata.js";

export {
  registerGameAdapter,
  getGameAdapter,
  hasGameAdapter,
  listGameAdapters,
  requireServerGameAdapter,
  __resetGameAdapterRegistryForTests,
} from "./registry.js";

export type { PlayCapabilities, PlayGameConfig } from "./play-configs.js";
export { getPlayGameConfig } from "./play-configs.js";
