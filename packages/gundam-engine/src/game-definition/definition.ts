import type { GameDefinition } from "@tcg/core";
import type { GundamCardMeta, GundamGameState, GundamMoves } from "../types";
import { gundamZones } from "../zones/zone-configs";
import { gundamFlow } from "./flow/turn-flow";
import { gundamMoves } from "./moves";
import { setupGundamGame } from "./setup/game-setup";
import { trackerConfig } from "./trackers/tracker-config";
import { checkVictory } from "./win-conditions/victory";

/**
 * Complete Gundam Game Definition
 *
 * Modular architecture with single responsibility:
 * - zones/: Zone configurations
 * - flow/: Turn and phase flow
 * - moves/: All game moves organized by category
 * - trackers/: Action tracking configuration
 * - setup/: Game initialization
 * - win-conditions/: Victory conditions
 *
 * Benefits:
 * - Easy to navigate and maintain
 * - Test components in isolation
 * - Clear separation of concerns
 * - Scalable for future additions
 */
export const gundamGameDefinition: GameDefinition<
  GundamGameState,
  GundamMoves,
  unknown,
  GundamCardMeta
> = {
  endIf: checkVictory,
  flow: gundamFlow,
  moves: gundamMoves,
  name: "Gundam TCG",
  setup: setupGundamGame,
  trackers: trackerConfig,
  zones: gundamZones,
};
