/**
 * Gundam Game State Types
 *
 * Exports for game state types following @tcg/core IState pattern.
 */

export type {
  GundamCardMeta,
  GundamExternalState,
  GundamGameState,
  GundamPhase,
  TemporaryModifier,
} from "./state-types";

export {
  createDefaultCardMeta,
  createInitialGundamState,
} from "./state-types";
