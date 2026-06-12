import type { PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { ZoneRef } from "../types/zone-types.ts";

/**
 * Resolve a ZoneRef to a zone key string used in the state.
 */
function resolveZoneKey(zone: ZoneRef): string {
  return zone.playerId ? `${zone.zone}:${zone.playerId}` : zone.zone;
}

/**
 * Get the zone key for a card from the card index.
 */
function getCardZoneKey(state: MatchState, cardId: string): string | undefined {
  return state.ctx.zones.private.cardIndex[cardId]?.zoneKey;
}

/**
 * Get cards in a zone from the state.
 */
function getZoneCards(state: MatchState, zone: ZoneRef): string[] {
  const key = resolveZoneKey(zone);
  return state.ctx.zones.private.zoneCards[key] ?? [];
}

/**
 * Assert that a card is in a specific zone.
 * Throws a descriptive error if the assertion fails.
 */
export function expectCardInZone(state: MatchState, cardId: string, expectedZone: string): void {
  const actualZone = getCardZoneKey(state, cardId);
  if (actualZone === undefined) {
    throw new Error(
      `Expected card "${cardId}" to be in zone "${expectedZone}", but the card was not found in any zone`,
    );
  }
  if (actualZone !== expectedZone) {
    throw new Error(
      `Expected card "${cardId}" to be in zone "${expectedZone}", but it is in zone "${actualZone}"`,
    );
  }
}

/**
 * Assert the number of cards in a zone matches the expected count.
 * Throws a descriptive error if the assertion fails.
 */
export function expectCardCount(state: MatchState, zone: ZoneRef, expected: number): void {
  const cards = getZoneCards(state, zone);
  const key = resolveZoneKey(zone);
  if (cards.length !== expected) {
    throw new Error(`Expected ${expected} card(s) in zone "${key}", but found ${cards.length}`);
  }
}

/**
 * Assert the current phase matches the expected value.
 * Throws a descriptive error if the assertion fails.
 */
export function expectPhase(state: MatchState, expected: string): void {
  const actual = state.ctx.status.phase;
  if (actual !== expected) {
    throw new Error(`Expected phase to be "${expected}", but got "${actual ?? "undefined"}"`);
  }
}

/**
 * Assert the current turn number matches the expected value.
 * Throws a descriptive error if the assertion fails.
 */
export function expectTurn(state: MatchState, expected: number): void {
  const actual = state.ctx.status.turn;
  if (actual !== expected) {
    throw new Error(`Expected turn to be ${expected}, but got ${actual}`);
  }
}

/**
 * Assert the current active player matches the expected player.
 * Throws a descriptive error if the assertion fails.
 */
export function expectActivePlayer(state: MatchState, expected: PlayerId): void {
  const actual = state.ctx.status.activePlayer;
  if (actual !== expected) {
    throw new Error(`Expected active player to be "${expected}", but got "${actual}"`);
  }
}

/**
 * Assert that the game has ended, optionally checking the winner.
 * Throws a descriptive error if the assertion fails.
 */
export function expectGameEnded(state: MatchState, winner?: PlayerId): void {
  if (!state.ctx.status.gameEnded) {
    throw new Error("Expected game to have ended, but it is still in progress");
  }
  if (winner !== undefined && state.ctx.status.winner !== winner) {
    throw new Error(
      `Expected winner to be "${winner}", but got "${state.ctx.status.winner ?? "none"}"`,
    );
  }
}

/**
 * Assert that the game has not ended.
 * Throws a descriptive error if the assertion fails.
 */
export function expectGameNotEnded(state: MatchState): void {
  if (state.ctx.status.gameEnded) {
    throw new Error(
      `Expected game to still be in progress, but it ended (winner: ${state.ctx.status.winner ?? "none"}, reason: ${state.ctx.status.winReason ?? "unknown"})`,
    );
  }
}

/**
 * Assert that the available moves match the expected set (order-independent).
 * Throws a descriptive error if the assertion fails.
 */
export function expectAvailableMoves(moves: string[], expected: string[]): void {
  const sortedActual = [...moves].sort();
  const sortedExpected = [...expected].sort();

  if (sortedActual.length !== sortedExpected.length) {
    throw new Error(
      `Expected available moves [${sortedExpected.join(", ")}] but got [${sortedActual.join(", ")}]`,
    );
  }

  for (let i = 0; i < sortedActual.length; i++) {
    if (sortedActual[i] !== sortedExpected[i]) {
      throw new Error(
        `Expected available moves [${sortedExpected.join(", ")}] but got [${sortedActual.join(", ")}]`,
      );
    }
  }
}
