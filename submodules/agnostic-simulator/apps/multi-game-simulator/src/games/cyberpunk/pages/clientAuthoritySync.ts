/**
 * Client-authority live-match sync helpers for the Cyberpunk pages.
 *
 * The implementation lives in the shared game-page-contract package so every
 * simulator with a client-authority practice board can adopt the same
 * recovery semantics; this module re-exports it for the page-level imports.
 */
export {
  clientAuthorityPushedVersionOffset,
  describeLiveMatchServerFeedback,
  initialClientAuthorityLastPushedVersion,
  MATCH_RELOAD_FEEDBACK,
  resolveClientAuthorityStaleRejection,
  shouldAutoSyncFromServerCode,
  shouldToastClientAuthorityRejection,
} from "@tcg/game-page-contract";
export type { ClientAuthorityStaleResolution } from "@tcg/game-page-contract";
