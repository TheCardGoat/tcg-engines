import { CardNotFoundError } from "~/game-engine/core-engine/errors/domain-errors";
/**
 * LorcanaEngine implementation of CardContextProvider
 * Provides fresh card state from the Lorcana engine's game state
 */
export class GundamCardContextProvider {
    engine;
    constructor(engine) {
        this.engine = engine;
    }
    /**
     * Get fresh card state by instance ID
     */
    getCardState(instanceId) {
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
        // Get modifiers from the game state
        const modifiers = this.getCardModifiers(instanceId, engineState);
        return {
            instanceId,
            publicId,
            owner,
            zone,
            modifiers,
            counters: this.getCardCounters(instanceId, engineState),
            statusEffects: this.getCardStatusEffects(instanceId, engineState),
            metadata: {},
        };
    }
    /**
     * Get all card instance IDs for a player
     */
    getPlayerCards(playerId) {
        const engineState = this.engine.getState();
        if (!engineState?.G?.players?.[playerId]) {
            return [];
        }
        const cards = [];
        const playerZones = engineState.G.players[playerId].zones;
        // Collect cards from all zones
        for (const zoneCards of Object.values(playerZones)) {
            if (Array.isArray(zoneCards)) {
                // Filter out non-string items and push only string card IDs
                const cardIds = zoneCards.filter((item) => typeof item === "string");
                cards.push(...cardIds);
            }
        }
        return cards;
    }
    /**
     * Get all card instance IDs in a specific zone across all players
     */
    getZoneCards(zone) {
        const state = this.engine.getState();
        if (!state) {
            return [];
        }
        return [];
    }
    /**
     * Get public ID for an instance ID from the engine's card mapping
     */
    getPublicIdForInstance(instanceId) {
        // Access the private playerCards from the engine
        const engineAny = this.engine;
        const playerCards = engineAny.playerCards || {};
        // Search through all player card mappings
        for (const playerCardMapping of Object.values(playerCards)) {
            if (typeof playerCardMapping === "object" && playerCardMapping !== null) {
                const mapping = playerCardMapping;
                if (mapping[instanceId]) {
                    return mapping[instanceId];
                }
            }
        }
        // Fallback to instance ID if no mapping found
        return instanceId;
    }
    /**
     * Get modifiers for a card from the Gundam game state
     */
    getCardModifiers(instanceId, state) {
        return [];
    }
    /**
     * Get counters for a card from the Gundam game state
     */
    getCardCounters(_instanceId, _state) {
        return {};
    }
    /**
     * Get status effects for a card from the Gundam game state
     */
    getCardStatusEffects(_instanceId, _state) {
        // In Lorcana, status effects might be stored as part of card state
        // This would need to be implemented based on the actual Lorcana state structure
        const statusEffects = new Set();
        // Check if card is exerted, dried, etc.
        // This would need to be implemented based on the actual Lorcana card state structure
        return statusEffects;
    }
}
//# sourceMappingURL=gundam-card-context-provider.js.map