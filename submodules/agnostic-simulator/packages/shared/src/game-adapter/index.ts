export type {
  CardsMaps,
  DeckEntry,
  DeckBuildInput,
  PregameDeckInput,
  PregameValidationResult,
  JsonValue,
  GamePregameAdapter,
  DeckCard,
  DeckDocumentSections,
  DeckFormatDefinition,
  DeckFormatExtensionFieldDefinition,
  DeckFormatExtensionFieldKind,
  DeckFormatSectionDefinition,
  DeckFormatSectionRole,
  DeckValidationContext,
  DeckInterchangeAdapter,
  DeckInterchangeResult,
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
export { defineGameDeckInterchangeAdapter } from "./deck-interchange.js";
export type { PlayableGameSlug } from "@tcg/protocol/games";
export { PLAYABLE_GAME_SLUGS, isPlayableGameSlug } from "@tcg/protocol/games";
export { isJsonValue, parseJsonValue } from "./types.js";

export {
  buildColorMetadataFacets,
  normalizeMetadataColors,
  sortMetadataFacets,
} from "./metadata.js";

export {
  groupInstancesBySection,
  type GroupInstancesBySectionOptions,
  type SectionBucketEntry,
  type SectionBuckets,
  type UnresolvedInstance,
} from "./deck-sections.js";

export {
  registerGameAdapter,
  getGameAdapter,
  hasGameAdapter,
  listGameAdapters,
  requireServerGameAdapter,
  __resetGameAdapterRegistryForTests,
} from "./registry.js";

export type {
  MatchAccessPolicy,
  MatchReplayAccess,
  MatchSpectatorAccess,
  PlayCapabilities,
  PlayGameConfig,
} from "./play-configs.js";
export {
  deriveMatchAccessPolicy,
  getPlayGameConfig,
  resolveQuickMatchAuthority,
} from "./play-configs.js";

export type { GamePresentationAdapter } from "./types.js";
