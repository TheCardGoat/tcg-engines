/**
 * Lorcana Serialization Helpers
 *
 * Provides helper methods for serializing and deserializing Lorcana engine states.
 * These helpers enable round-trip state persistence for tests and tooling.
 */

import {
  type SerializedMatchState,
  type MatchStaticResources,
  type Player,
  createRecordCardCatalog,
  createRecordCardInstanceRegistry,
  buildDeterministicCardInstanceRegistry,
} from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { LorcanaG, LorcanaMatchState } from "../types";

// =============================================================================
// Constants
// =============================================================================

/** Game type identifier for Lorcana */
export const LORCANA_GAME_TYPE = "lorcana";

// =============================================================================
// Static Resource Builders
// =============================================================================

/**
 * Build static resources from card definitions and player decks.
 *
 * @param cardDefinitions - Record of card definitions by card ID
 * @param playerDecks - Array of player deck configurations
 * @returns MatchStaticResources for use with serialization helpers
 */
export function buildLorcanaStaticResources(
  cardDefinitions: Record<string, LorcanaCard>,
  playerDecks: Array<{
    playerId: string;
    deck: Array<{ cardId: string; qty: number }>;
  }>,
): MatchStaticResources {
  // Create card catalog
  const cards = createRecordCardCatalog("lorcana:cards", cardDefinitions);

  // Build deterministic instance registry from decks
  const instances = buildDeterministicCardInstanceRegistry(
    playerDecks.map((pd) => ({
      ownerID: pd.playerId,
      deck: pd.deck.map((entry) => ({
        definitionId: entry.cardId,
        qty: entry.qty,
      })),
    })),
  );

  return { cards, instances, zoneDefinitions: {} };
}

/**
 * Create empty static resources for testing.
 *
 * @returns Empty MatchStaticResources
 */
export function createEmptyLorcanaStaticResources(): MatchStaticResources {
  return {
    cards: createRecordCardCatalog("lorcana:empty", {}),
    instances: createRecordCardInstanceRegistry("lorcana:empty", {}),
    zoneDefinitions: {},
  };
}

// =============================================================================
// Type Exports
// =============================================================================

export type { SerializedMatchState, LorcanaG, LorcanaMatchState, MatchStaticResources, Player };
