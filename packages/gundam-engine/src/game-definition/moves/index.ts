import type { GameMoveDefinitions } from "@tcg/core";
import type { GundamCardMeta, GundamGameState, GundamMoves } from "../../types";
import { attackMove } from "./core/attack";
import { concede } from "./core/concede";
import { executeEffectMove } from "./core/execute-effect";
import { handleTurnEndMove } from "./core/handle-turn-end";
import { handleTurnStartMove } from "./core/handle-turn-start";
import { passMove } from "./core/pass";
import { playCard } from "./core/play-card";
import { playCommandMove } from "./core/play-command";
import { resolveEffectStackMove } from "./core/resolve-effect-stack";

export const gundamMoves: GameMoveDefinitions<GundamGameState, GundamMoves, GundamCardMeta> = {
  attack: attackMove,
  concede,
  executeEffect: executeEffectMove,
  handleTurnEnd: handleTurnEndMove,
  handleTurnStart: handleTurnStartMove,
  pass: passMove,
  playCard,
  playCommand: playCommandMove,
  resolveEffectStack: resolveEffectStackMove,
};
