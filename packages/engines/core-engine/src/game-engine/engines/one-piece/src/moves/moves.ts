/**
 * Move definitions for One Piece TCG
 * Implements all game actions following One Piece rules
 */

import {
  activateCounter,
  activateEffect,
  activateEvent,
  activateTrigger,
  declareAttack,
  declareBlock,
  discardCard,
  drawCard,
  endTurn,
  giveDon,
  passPriority,
  playCharacter,
  playStage,
  resolveBattle,
  restCard,
  returnDon,
  setActive,
  startTurn,
  trashCard,
} from "./_placeholder-moves";
import { chooseFirstPlayer } from "./chooseFirstPlayer";
import { concede } from "./concede";
import { endPhase } from "./endPhase";
import { mulligan } from "./mulligan";
import { placeDon } from "./placeDon";

export const onePieceMoves = {
  // Pre-game moves
  chooseFirstPlayer,
  mulligan,

  // Turn management
  startTurn,
  endTurn,
  endPhase,
  passPriority,

  // DON!! management
  placeDon,
  giveDon,
  returnDon,

  // Card play moves
  playCharacter,
  playStage,
  activateEvent,

  // Battle moves
  declareAttack,
  declareBlock,
  activateCounter,
  resolveBattle,

  // Effect moves
  activateEffect,
  activateTrigger,

  // Utility moves
  drawCard,
  discardCard,
  trashCard,
  restCard,
  setActive,
  concede,
};
