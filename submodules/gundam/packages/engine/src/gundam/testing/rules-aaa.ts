/**
 * Shared AAA helpers for comprehensive-rules tests (fluent-friendly).
 *
 * Prefer:
 *   p1.must.deployUnit(card);
 *   engine.battle via resolveBattle(engine, card, "direct");
 *   expectCard(p1, card).toBeIn("trash");
 */

import type { CommandResult } from "../../types/command.ts";
import { asPlayerId } from "../../types/branded.ts";
import {
  type CardRef,
  otherPlayer,
  resolveCardRef,
  resolveCardRefOnEitherPlayer,
} from "./card-ref.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, type GundamPlayerId } from "./test-engine.ts";

/** Resolve a full battle with no block (fluent card refs accepted). */
export function resolveBattle(engine: GundamTestEngine, attacker: CardRef, target: CardRef): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  // Resolve attacker on either player
  let attackerRef;
  try {
    attackerRef = resolveCardRef(p1.runtime, PLAYER_ONE, attacker);
  } catch {
    attackerRef = resolveCardRef(p1.runtime, PLAYER_TWO, attacker);
  }
  const attackerOwner = attackerRef.ownerId;
  const defenderOwner = otherPlayer(attackerOwner);
  const attackerPlayer = engine.asPlayer(attackerOwner);
  const defenderPlayer = engine.asPlayer(defenderOwner);

  const targetId =
    target === "direct"
      ? "direct"
      : resolveCardRefOnEitherPlayer(p1.runtime, defenderOwner, attackerOwner, target).instanceId;

  attackerPlayer.must.enterBattle(attackerRef, targetId);
  defenderPlayer.must.passBlock().passBattleAction();
  attackerPlayer.must.passBattleAction();
}

export function passBattleWithoutBlock(engine: GundamTestEngine): void {
  const state = engine.getState();
  const active = String(state.ctx.status.activePlayer ?? state.ctx.status.turnPlayer);
  const attacker: GundamPlayerId = active === PLAYER_TWO ? PLAYER_TWO : PLAYER_ONE;
  const defender = otherPlayer(attacker);
  engine.asPlayer(defender).must.passBlock().passBattleAction();
  engine.asPlayer(attacker).must.passBattleAction();
}

export function endTurn(engine: GundamTestEngine): void {
  engine.endTurn();
}

export function passMainIntoEndAction(engine: GundamTestEngine): void {
  const turnPlayer = String(engine.getState().ctx.status.turnPlayer ?? PLAYER_ONE);
  const active: GundamPlayerId = turnPlayer === PLAYER_TWO ? PLAYER_TWO : PLAYER_ONE;
  const standby = otherPlayer(active);
  engine.asPlayer(active).must.passPhase();
  engine.asPlayer(standby).must.passActionStep();
  engine.asPlayer(active).must.passActionStep();
}

export function zoneCount(
  engine: GundamTestEngine,
  playerId: GundamPlayerId,
  zone: string,
): number {
  return engine.asPlayer(playerId).getCardsInZone(zone).length;
}

export function getWinner(engine: GundamTestEngine): string | undefined {
  return engine.asPlayer(PLAYER_ONE).getBoardView().winner;
}

export function expectWinner(engine: GundamTestEngine, expected: GundamPlayerId | undefined): void {
  const winner = getWinner(engine);
  if (winner !== expected) {
    throw new Error(`Expected winner ${String(expected)}, got ${String(winner)}`);
  }
}

export function getPhase(engine: GundamTestEngine): string | undefined {
  return engine.asPlayer(PLAYER_ONE).getPhase();
}

export function discardToHandLimit(
  engine: GundamTestEngine,
  playerId: GundamPlayerId,
  cardIds: string[],
): CommandResult {
  return engine.doMove("discardToHandLimit", asPlayerId(playerId), { cardIds });
}
