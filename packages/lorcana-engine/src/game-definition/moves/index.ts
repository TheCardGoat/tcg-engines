import type { GameMoveDefinitions } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../types";
// Ability moves
import { activateAbility } from "./abilities/activate-ability";
import { challenge } from "./core/challenge";
// Core moves
import { playCard } from "./core/play-card";
import { quest } from "./core/quest";
// Debug moves
import { manualExert } from "./debug/manual-exert";
// Effect moves
import { resolveBag } from "./effects/resolve-bag";
import { resolveEffect } from "./effects/resolve-effect";
// Location moves
import { moveCharacterToLocation } from "./locations/move-character-to-location";
// Resource moves
import { putACardIntoTheInkwell } from "./resources/put-card-into-inkwell";
import { alterHand } from "./setup/alter-hand";
// Setup moves
import { chooseWhoGoesFirstMove } from "./setup/choose-first-player";
import { drawCards } from "./setup/draw-cards";
// Song moves
import { sing } from "./songs/sing";
import { singTogether } from "./songs/sing-together";
import { concede } from "./standard/concede";
// Standard moves
import { passTurn } from "./standard/pass-turn";

/**
 * Lorcana Move Definitions
 *
 * All game moves organized by category:
 * - Setup: Game initialization moves
 * - Resources: Ink management
 * - Core: Primary gameplay (play, quest, challenge)
 * - Songs: Singing mechanics
 * - Locations: Location interactions
 * - Abilities: Activated abilities
 * - Effects: Effect resolution
 * - Debug: Testing utilities
 * - Standard: Pass and concede
 */
export const lorcanaMoves: GameMoveDefinitions<
  LorcanaGameState,
  LorcanaMoveParams,
  LorcanaCardMeta
> = {
  // ===== Setup Moves =====
  chooseWhoGoesFirstMove,
  alterHand,
  drawCards,

  // ===== Resource Moves =====
  putACardIntoTheInkwell,

  // ===== Core Game Moves =====
  playCard,
  quest,
  challenge,

  // ===== Song Moves =====
  sing,
  singTogether,

  // ===== Location Moves =====
  moveCharacterToLocation,

  // ===== Ability Moves =====
  activateAbility,

  // ===== Effect Resolution =====
  resolveBag,
  resolveEffect,

  // ===== Manual Actions (Testing/Debug) =====
  manualExert,

  // ===== Standard Moves =====
  passTurn,
  concede,
};
