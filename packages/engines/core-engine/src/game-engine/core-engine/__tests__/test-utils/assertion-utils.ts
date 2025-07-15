/**
 * Test utilities for common assertions in tests
 */

import { expect } from "bun:test";
import type { CoreCtx } from "../../state/context";
import type { InstanceId, PlayerID } from "../../types/core-types";

/**
 * Asserts that a card is in a specific zone
 */
export function assertCardInZone(
  ctx: CoreCtx,
  instanceId: InstanceId,
  zoneId: string,
  message?: string,
): void {
  const zone = ctx.cardZones[zoneId];
  expect(zone, `Zone ${zoneId} does not exist`).toBeDefined();
  expect(
    zone.cards.includes(instanceId),
    message || `Card ${instanceId} not found in zone ${zoneId}`,
  ).toBe(true);
}

/**
 * Asserts that a card is not in a specific zone
 */
export function assertCardNotInZone(
  ctx: CoreCtx,
  instanceId: InstanceId,
  zoneId: string,
  message?: string,
): void {
  const zone = ctx.cardZones[zoneId];
  if (!zone) {
    return; // Zone doesn't exist, so card can't be in it
  }
  expect(
    zone.cards.includes(instanceId),
    message || `Card ${instanceId} found in zone ${zoneId}`,
  ).toBe(false);
}

/**
 * Asserts that a player has a specific card
 */
export function assertPlayerHasCard(
  ctx: CoreCtx,
  playerId: PlayerID,
  instanceId: InstanceId,
  message?: string,
): void {
  const playerCards = ctx.cards[playerId];
  expect(playerCards, `Player ${playerId} does not exist`).toBeDefined();
  expect(
    playerCards[instanceId],
    message || `Card ${instanceId} not found for player ${playerId}`,
  ).toBeDefined();
}

// Removed unused function: assertPlayerDoesNotHaveCard

/**
 * Asserts that a player is the turn player
 */
export function assertPlayerIsTurnPlayer(
  ctx: CoreCtx,
  playerId: PlayerID,
  message?: string,
): void {
  const turnPlayerPos = ctx.turnPlayerPos;
  const turnPlayerId = ctx.playerOrder[turnPlayerPos];
  expect(
    turnPlayerId,
    message || `Player ${playerId} is not the turn player`,
  ).toBe(playerId);
}

/**
 * Asserts that a player is the priority player
 */
export function assertPlayerIsPriorityPlayer(
  ctx: CoreCtx,
  playerId: PlayerID,
  message?: string,
): void {
  const priorityPlayerPos = ctx.priorityPlayerPos;
  const priorityPlayerId = ctx.playerOrder[priorityPlayerPos];
  expect(
    priorityPlayerId,
    message || `Player ${playerId} is not the priority player`,
  ).toBe(playerId);
}

/**
 * Asserts that the game is in a specific phase
 */
export function assertGamePhase(
  ctx: CoreCtx,
  segment: string,
  phase?: string,
  step?: string,
): void {
  expect(ctx.currentSegment, `Game is not in segment ${segment}`).toBe(segment);

  if (phase) {
    expect(ctx.currentPhase, `Game is not in phase ${phase}`).toBe(phase);
  }

  if (step) {
    expect(ctx.currentStep, `Game is not in step ${step}`).toBe(step);
  }
}

// Removed unused function: assertGameOver
