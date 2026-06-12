/**
 * Gundam TCG — Move Registry
 */

import type { GundamMoveDefinition, GundamRuntimeMoveParams } from "../types.ts";

import { chooseFirstPlayer } from "./setup/choose-first-player.ts";
import { alterHand } from "./setup/mulligan.ts";
import { deployUnit } from "./core/deploy-unit.ts";
import { deployBase } from "./core/deploy-base.ts";
import { playCommand } from "./core/play-command.ts";
import { activateAbility } from "./core/activate-ability.ts";
import { assignPilot } from "./core/assign-pilot.ts";
import { playCommandAsPilot } from "./core/play-command-as-pilot.ts";
import { declareBlock } from "./core/declare-block.ts";
import { enterBattle } from "./core/enter-battle.ts";
import { passBlock } from "./core/pass-block.ts";
import { passBattleAction } from "./core/pass-battle-action.ts";
import { discardToHandLimit } from "./core/discard-to-hand-limit.ts";
import { passTurn } from "./core/pass-turn.ts";
import { passActionStep } from "./core/pass-action-step.ts";
import { concede } from "./core/concede.ts";
import { resolveEffect } from "./core/resolve-effect.ts";
import { skipOpponentTurn } from "./core/skip-opponent-turn.ts";
import { dropOpponent } from "./core/drop-opponent.ts";

type GundamMoveRegistry = {
  [K in keyof GundamRuntimeMoveParams]: GundamMoveDefinition<K>;
};

export const gundamMoves = {
  chooseFirstPlayer,
  alterHand,
  deployUnit,
  deployBase,
  playCommand,
  activateAbility,
  assignPilot,
  playCommandAsPilot,
  declareBlock,
  enterBattle,
  passBlock,
  passBattleAction,
  discardToHandLimit,
  passTurn,
  passActionStep,
  concede,
  skipOpponentTurn,
  dropOpponent,
  resolveEffect,
} as const satisfies GundamMoveRegistry;

export {
  chooseFirstPlayer,
  alterHand,
  deployUnit,
  deployBase,
  playCommand,
  activateAbility,
  assignPilot,
  playCommandAsPilot,
  declareBlock,
  enterBattle,
  passBlock,
  passBattleAction,
  discardToHandLimit,
  passTurn,
  passActionStep,
  concede,
  skipOpponentTurn,
  dropOpponent,
  resolveEffect,
};
