/**
 * Move registry for Alpha Clash TCG
 *
 * Exports all available moves for the Alpha Clash game engine
 */

import { chooseFirstPlayer } from "./chooseFirstPlayer";
import { concede } from "./concede";
import { mulligan } from "./mulligan";

export const alphaClashMoves = {
  // Setup moves
  chooseFirstPlayer,
  mulligan,

  // Standard moves
  concede,

  // Gameplay moves will be added here as we implement them
  // playCard,
  // setTrap,
  // activateTrap,
  // attachWeapon,
  // declareAttackers,
  // declareObstructors,
  // playClashBuff,
  // activateAbility,
  // passPriority,
  // endTurn,
  // endPhase,
  // placeResource,
  // initiateClash,
  // counterPlay,
  // counterAttack,
  // counterTrap,
  // sacrificeCard,
  // discardCard,
  // drawCard,
  // searchLibrary,
  // modalChoice,
};
