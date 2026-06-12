export type {
  CardsMaps,
  DeckEntry,
  DeckBuildInput,
  DeckCard,
  DeckFormatRule,
  DeckFormatResult,
  CardSummary,
  GameAdapter,
  PlayableGameSlug,
  ServerGameAdapter,
} from "./types";
export { PLAYABLE_GAME_SLUGS, isPlayableGameSlug } from "./types";

export {
  registerGameAdapter,
  getGameAdapter,
  hasGameAdapter,
  listGameAdapters,
  requireServerGameAdapter,
  __resetGameAdapterRegistryForTests,
} from "./registry";

export type { PlayCapabilities, PlayGameConfig } from "./play-configs";
export { getPlayGameConfig } from "./play-configs";
