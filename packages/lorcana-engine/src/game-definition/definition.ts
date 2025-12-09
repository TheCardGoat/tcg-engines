import type { GameDefinition } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../types";
import { lorcanaFlow } from "./flow/turn-flow";
import { lorcanaMoves } from "./moves";
import { setupLorcanaGame } from "./setup/game-setup";
import { trackerConfig } from "./trackers/tracker-config";
import { checkLoreVictory } from "./win-conditions/lore-victory";
// Import modular components
import { lorcanaZones } from "./zones/zone-configs";

/**
 * Complete Lorcana Game Definition
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
export const lorcanaGameDefinition: GameDefinition<
  LorcanaGameState,
  LorcanaMoveParams,
  unknown, // Card definitions (to be added)
  LorcanaCardMeta
> = {
  name: "Disney Lorcana TCG",
  zones: lorcanaZones,
  flow: lorcanaFlow,
  moves: lorcanaMoves,
  trackers: trackerConfig,
  setup: setupLorcanaGame,
  endIf: checkLoreVictory,
};
