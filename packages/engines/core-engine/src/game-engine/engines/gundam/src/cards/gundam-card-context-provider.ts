import { CardNotFoundError } from "~/game-engine/core-engine/errors/domain-errors";
import type { GundamEngine } from "~/game-engine/engines/gundam/src/gundam-engine";
import type { GundamCardMeta } from "~/game-engine/engines/gundam/src/gundam-generic-types";

/**
 * GundamEngine implementation of CardContextProvider
 * Provides fresh card state from the Gundam engine's game state
 * Now integrated with the core metadata system
 */
export class GundamCardContextProvider {
  constructor(private engine: GundamEngine) {}

  /**
   * Get fresh card state by instance ID
   * Now integrates with the core metadata system
   */
  getCardState(instanceId: string) {
    const engineState = this.engine.getState();
    if (!engineState) {
      throw new CardNotFoundError(instanceId);
    }

    // Get owner using existing engine method
    const owner = this.engine.getCardOwner(instanceId);
    if (!owner) {
      throw new CardNotFoundError(instanceId);
    }

    // Get zone using existing engine method
    const zone = this.engine.getCardZone(instanceId);
    if (!zone) {
      throw new CardNotFoundError(instanceId);
    }

    // Get public ID from the engine's card mapping
    const publicId = this.getPublicIdForInstance(instanceId);

    // Get metadata from the core metadata system
    const meta = this.getCardMeta(instanceId);

    return {
      instanceId,
      publicId,
      owner,
      zone,
      modifiers: meta.modifiers,
      counters: meta.counters,
      statusEffects: meta.statusEffects,
      metadata: meta.metadata || {},
    };
  }

  /**
   * Get card metadata using the core metadata system
   */
  private getCardMeta(instanceId: string): GundamCardMeta {
    const ctx = this.engine.getState()?.ctx;
    if (!ctx?.cardMetas) {
      return this.getDefaultMeta();
    }

    const meta = ctx.cardMetas[instanceId] as GundamCardMeta;
    return meta || this.getDefaultMeta();
  }

  /**
   * Get default metadata structure for Gundam cards
   */
  private getDefaultMeta(): GundamCardMeta {
    return {
      modifiers: [],
      counters: {},
      statusEffects: new Set<string>(),
      metadata: {},
    };
  }

  /**
   * Get all card instance IDs for a player
   */
  getPlayerCards(playerId: string): string[] {
    const engineState = this.engine.getState();
    if (!engineState?.G?.players?.[playerId]) {
      return [];
    }

    const cards: string[] = [];
    const playerZones = engineState.G.players[playerId].zones;

    // Collect cards from all zones
    for (const zoneCards of Object.values(playerZones)) {
      if (Array.isArray(zoneCards)) {
        // Filter out non-string items and push only string card IDs
        const cardIds = zoneCards.filter(
          (item): item is string => typeof item === "string",
        );
        cards.push(...cardIds);
      }
    }

    return cards;
  }

  /**
   * Get all card instance IDs in a specific zone across all players
   */
  getZoneCards(zone: string): string[] {
    const state = this.engine.getState();
    if (!state) {
      return [];
    }

    return [];
  }

  /**
   * Get public ID for an instance ID from the engine's card mapping
   */
  private getPublicIdForInstance(instanceId: string): string {
    // Access the private playerCards from the engine
    const engineAny = this.engine as any;
    const playerCards = engineAny.playerCards || {};

    // Search through all player card mappings
    for (const playerCardMapping of Object.values(playerCards)) {
      if (typeof playerCardMapping === "object" && playerCardMapping !== null) {
        const mapping = playerCardMapping as Record<string, string>;
        if (mapping[instanceId]) {
          return mapping[instanceId];
        }
      }
    }

    // Fallback to instance ID if no mapping found
    return instanceId;
  }
}
