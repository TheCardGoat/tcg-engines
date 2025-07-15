/**
 * Test utilities for creating and manipulating test contexts
 */
import type { CoreCtx } from "../../state/context";
import type { InstanceId, PlayerID } from "../../types/core-types";
import { createContext, createTestContext } from "../../utils/context-factory";

/**
 * Creates a minimal test context with two players and empty card collections
 */
export function createMinimalTestContext(): CoreCtx {
  return createTestContext();
}

/**
 * Creates a test context with cards in specific zones
 */
export function createTestContextWithCards(
  cards: Record<PlayerID, Record<InstanceId, { definition: string }>>,
  zoneSetup: Array<{ zoneId: string; owner: PlayerID; cards: InstanceId[] }>,
): CoreCtx {
  const ctx = createTestContext();

  // Add cards to players
  Object.entries(cards).forEach(([playerId, playerCards]) => {
    ctx.cards[playerId] = playerCards;
  });

  // Create zones with cards
  zoneSetup.forEach(({ zoneId, owner, cards }) => {
    ctx.cardZones[zoneId] = {
      id: zoneId,
      name: zoneId,
      owner,
      cards,
      visibility: "public",
    };
  });

  return ctx;
}

/**
 * Creates a test context with a specific game phase
 */
export function createTestContextWithPhase(
  segment: string,
  phase: string,
  step?: string,
): CoreCtx {
  const ctx = createTestContext();
  ctx.currentSegment = segment;
  ctx.currentPhase = phase;
  if (step) {
    ctx.currentStep = step;
  }
  return ctx;
}

/**
 * Creates a test context with specific turn and priority players
 */
export function createTestContextWithTurnState(
  turnPlayer: PlayerID,
  priorityPlayer?: PlayerID,
): CoreCtx {
  const ctx = createTestContext();
  const turnPlayerIndex = ctx.playerOrder.indexOf(turnPlayer);

  if (turnPlayerIndex === -1) {
    throw new Error(`Invalid turn player ID: ${turnPlayer}`);
  }

  ctx.turnPlayerPos = turnPlayerIndex;

  if (priorityPlayer) {
    const priorityPlayerIndex = ctx.playerOrder.indexOf(priorityPlayer);
    if (priorityPlayerIndex === -1) {
      throw new Error(`Invalid priority player ID: ${priorityPlayer}`);
    }
    ctx.priorityPlayerPos = priorityPlayerIndex;
  } else {
    ctx.priorityPlayerPos = turnPlayerIndex;
  }

  return ctx;
}

// Removed unused functions: createTestContextWithMoves, createTestContextWithGameOver
