import { expect } from "bun:test";
import type { ZoneType } from "../../src/gundam-engine-types";
import type { GundamTestEngine } from "../../src/testing/gundam-test-engine";

/**
 * Assert that a specific zone contains an expected number of cards
 */
export const assertZoneCount = (
  engine: GundamTestEngine,
  zone: ZoneType,
  expectedCount: number,
  playerId = "player_one",
): void => {
  const actualCount = engine.getZone(zone, playerId).length;
  if (actualCount !== expectedCount) {
    throw new Error(
      `Expected ${zone} to have ${expectedCount} cards, but found ${actualCount}`,
    );
  }
};

/**
 * Assert that the game is in a specific phase
 */
export const assertGamePhase = (
  engine: GundamTestEngine,
  expectedPhase: string,
): void => {
  const actualPhase = engine.getGamePhase();
  if (actualPhase !== expectedPhase) {
    throw new Error(
      `Expected game phase to be "${expectedPhase}", but found "${actualPhase}"`,
    );
  }
};

/**
 * Assert that the game is in a specific segment
 */
export const assertGameSegment = (
  engine: GundamTestEngine,
  expectedSegment: string,
): void => {
  const actualSegment = engine.getGameSegment();
  if (actualSegment !== expectedSegment) {
    throw new Error(
      `Expected game segment to be "${expectedSegment}", but found "${actualSegment}"`,
    );
  }
};

/**
 * Assert that a specific player is the turn player
 */
export const assertTurnPlayer = (
  engine: GundamTestEngine,
  expectedPlayer: string,
): void => {
  const actualPlayer = engine.getTurnPlayer();
  if (actualPlayer !== expectedPlayer) {
    throw new Error(
      `Expected turn player to be "${expectedPlayer}", but found "${actualPlayer}"`,
    );
  }
};

/**
 * Assert that a specific player has priority
 */
export const assertPriorityPlayer = (
  engine: GundamTestEngine,
  expectedPlayer: string,
): void => {
  const priorityPlayers = engine.getPriorityPlayers();
  if (priorityPlayers[0] !== expectedPlayer) {
    throw new Error(
      `Expected priority player to be "${expectedPlayer}", but found "${priorityPlayers[0]}"`,
    );
  }
};

/**
 * Assert that a card is in a specific zone
 */
export const assertCardInZone = (
  engine: GundamTestEngine,
  cardInstanceId: string,
  expectedZone: ZoneType,
  playerId = "player_one",
): void => {
  const zone = engine.getZone(expectedZone, playerId);
  if (!zone.includes(cardInstanceId)) {
    throw new Error(
      `Expected card ${cardInstanceId} to be in ${expectedZone}, but it was not found`,
    );
  }
};

/**
 * Assert that a unit has specific stats (AP, HP, etc.)
 */
export const assertUnitHasStats = (
  engine: GundamTestEngine,
  unitInstanceId: string,
  expectedStats: {
    ap?: number;
    hp?: number;
    level?: number;
    cost?: number;
  },
): void => {
  const allCards = engine.authoritativeEngine.queryAllCards();
  const unit = allCards.find((c: any) => c.instanceId === unitInstanceId);

  if (!unit) {
    throw new Error(`Unit with instanceId ${unitInstanceId} not found`);
  }

  const card = (unit as any).card;

  if (expectedStats.ap !== undefined && card.ap !== expectedStats.ap) {
    throw new Error(
      `Expected unit AP to be ${expectedStats.ap}, but found ${card.ap}`,
    );
  }

  if (expectedStats.hp !== undefined && card.hp !== expectedStats.hp) {
    throw new Error(
      `Expected unit HP to be ${expectedStats.hp}, but found ${card.hp}`,
    );
  }

  if (expectedStats.level !== undefined && card.level !== expectedStats.level) {
    throw new Error(
      `Expected unit level to be ${expectedStats.level}, but found ${card.level}`,
    );
  }

  if (expectedStats.cost !== undefined && card.cost !== expectedStats.cost) {
    throw new Error(
      `Expected unit cost to be ${expectedStats.cost}, but found ${card.cost}`,
    );
  }
};
