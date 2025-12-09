/**
 * Zone Manager for handling card movement and zone state management
 */
/**
 * Manages game zones and card movements
 */
export class ZoneManager {
    zones;
    configuration;
    cardLocations;
    constructor(configuration) {
        this.configuration = configuration;
        this.zones = {};
        this.cardLocations = {};
        this.initializeZones();
    }
    /**
     * Initialize zones based on configuration
     */
    initializeZones() {
        for (const [zoneId, config] of Object.entries(this.configuration.zones)) {
            if (!config.perPlayer) {
                const zone = {
                    id: zoneId,
                    name: zoneId,
                    type: config.type,
                    cards: [],
                    maxSize: config.maxSize,
                    rules: config.rules,
                };
                this.zones[zoneId] = zone;
            }
        }
    }
    /**
     * Initialize player-specific zones
     */
    initializePlayerZones(playerId) {
        for (const [zoneId, config] of Object.entries(this.configuration.zones)) {
            if (config.perPlayer) {
                const playerZoneId = `${playerId}-${zoneId}`;
                const zone = {
                    id: playerZoneId,
                    name: zoneId,
                    type: config.type,
                    owner: playerId,
                    cards: [],
                    maxSize: config.maxSize,
                    rules: config.rules,
                };
                this.zones[playerZoneId] = zone;
            }
        }
    }
    /**
     * Move a card from one zone to another
     */
    moveCard(cardId, fromZoneId, toZoneId) {
        const fromZone = this.zones[fromZoneId];
        const toZone = this.zones[toZoneId];
        if (!fromZone) {
            return {
                success: false,
                error: `Source zone ${fromZoneId} not found`,
            };
        }
        if (!toZone) {
            return {
                success: false,
                error: `Target zone ${toZoneId} not found`,
            };
        }
        const cardIndex = fromZone.cards.findIndex((card) => this.getCardId(card) === cardId);
        if (cardIndex === -1) {
            return {
                success: false,
                error: `Card ${cardId} not found in zone ${fromZoneId}`,
            };
        }
        const card = fromZone.cards[cardIndex];
        // Check if card can be removed from source zone
        if (fromZone.rules?.canRemove &&
            !fromZone.rules.canRemove(card, fromZone)) {
            return {
                success: false,
                error: `Card cannot be removed from zone ${fromZoneId}`,
            };
        }
        // Check if card can be added to target zone
        if (toZone.rules?.canAdd && !toZone.rules.canAdd(card, toZone)) {
            return {
                success: false,
                error: `Card cannot be added to zone ${toZoneId}`,
            };
        }
        // Check zone capacity
        if (toZone.maxSize && toZone.cards.length >= toZone.maxSize) {
            return {
                success: false,
                error: `Target zone ${toZoneId} is full`,
            };
        }
        // Remove card from source zone
        fromZone.cards.splice(cardIndex, 1);
        if (fromZone.rules?.onRemove) {
            fromZone.rules.onRemove(card, fromZone);
        }
        // Add card to target zone
        toZone.cards.push(card);
        if (toZone.rules?.onAdd) {
            toZone.rules.onAdd(card, toZone);
        }
        // Update card location
        this.cardLocations[cardId] = {
            zoneId: toZoneId,
            index: toZone.cards.length - 1,
            owner: toZone.owner,
        };
        return {
            success: true,
            fromZone: fromZoneId,
            toZone: toZoneId,
            cardId,
        };
    }
    /**
     * Get zone by ID
     */
    getZone(zoneId) {
        return this.zones[zoneId];
    }
    /**
     * Get player-specific zone
     */
    getPlayerZone(playerId, zoneType) {
        const playerZoneId = `${playerId}-${zoneType}`;
        return this.zones[playerZoneId];
    }
    /**
     * Query zones based on criteria
     */
    queryZones(query) {
        const results = [];
        for (const zone of Object.values(this.zones)) {
            if (query.type && zone.type !== query.type)
                continue;
            if (query.owner && zone.owner !== query.owner)
                continue;
            if (query.hasCards !== undefined) {
                if (query.hasCards && zone.cards.length === 0)
                    continue;
                if (!query.hasCards && zone.cards.length > 0)
                    continue;
            }
            if (query.minCards && zone.cards.length < query.minCards)
                continue;
            if (query.maxCards && zone.cards.length > query.maxCards)
                continue;
            results.push(zone);
        }
        return results;
    }
    /**
     * Get statistics for a zone
     */
    getZoneStats(zoneId) {
        const zone = this.zones[zoneId];
        if (!zone)
            return undefined;
        return {
            zoneId: zone.id,
            cardCount: zone.cards.length,
            isFull: zone.maxSize ? zone.cards.length >= zone.maxSize : false,
            isEmpty: zone.cards.length === 0,
            percentFull: zone.maxSize
                ? (zone.cards.length / zone.maxSize) * 100
                : undefined,
        };
    }
    /**
     * Get all cards in a specific zone
     */
    getCardsInZone(zoneId) {
        const zone = this.zones[zoneId];
        return zone ? [...zone.cards] : [];
    }
    /**
     * Find a card by ID across all zones
     */
    findCard(cardId) {
        for (const zone of Object.values(this.zones)) {
            const card = zone.cards.find((c) => this.getCardId(c) === cardId);
            if (card) {
                return { card, zone };
            }
        }
        return undefined;
    }
    /**
     * Get card location
     */
    getCardLocation(cardId) {
        return this.cardLocations[cardId];
    }
    /**
     * Get current zone state snapshot
     */
    getZoneState() {
        const state = {};
        for (const [id, zone] of Object.entries(this.zones)) {
            state[id] = {
                ...zone,
                cards: [...zone.cards],
            };
        }
        return state;
    }
    /**
     * Restore zone state from snapshot
     */
    restoreZoneState(state) {
        this.zones = {};
        this.cardLocations = {};
        for (const [id, zone] of Object.entries(state)) {
            this.zones[id] = {
                ...zone,
                cards: [...zone.cards],
            };
            // Rebuild card locations
            zone.cards.forEach((card, index) => {
                const cardId = this.getCardId(card);
                this.cardLocations[cardId] = {
                    zoneId: id,
                    index,
                    owner: zone.owner,
                };
            });
        }
    }
    /**
     * Add a card to a specific zone
     */
    addCardToZone(card, zoneId) {
        const zone = this.zones[zoneId];
        if (!zone) {
            return {
                success: false,
                error: `Zone ${zoneId} not found`,
            };
        }
        // Check if card can be added
        if (zone.rules?.canAdd && !zone.rules.canAdd(card, zone)) {
            return {
                success: false,
                error: `Card cannot be added to zone ${zoneId}`,
            };
        }
        // Check zone capacity
        if (zone.maxSize && zone.cards.length >= zone.maxSize) {
            return {
                success: false,
                error: `Zone ${zoneId} is full`,
            };
        }
        // Add card
        zone.cards.push(card);
        if (zone.rules?.onAdd) {
            zone.rules.onAdd(card, zone);
        }
        // Update card location
        const cardId = this.getCardId(card);
        this.cardLocations[cardId] = {
            zoneId,
            index: zone.cards.length - 1,
            owner: zone.owner,
        };
        return {
            success: true,
            toZone: zoneId,
            cardId,
        };
    }
    /**
     * Remove a card from a zone
     */
    removeCardFromZone(cardId, zoneId) {
        const zone = this.zones[zoneId];
        if (!zone) {
            return {
                success: false,
                error: `Zone ${zoneId} not found`,
            };
        }
        const cardIndex = zone.cards.findIndex((card) => this.getCardId(card) === cardId);
        if (cardIndex === -1) {
            return {
                success: false,
                error: `Card ${cardId} not found in zone ${zoneId}`,
            };
        }
        const card = zone.cards[cardIndex];
        // Check if card can be removed
        if (zone.rules?.canRemove && !zone.rules.canRemove(card, zone)) {
            return {
                success: false,
                error: `Card cannot be removed from zone ${zoneId}`,
            };
        }
        // Remove card
        zone.cards.splice(cardIndex, 1);
        if (zone.rules?.onRemove) {
            zone.rules.onRemove(card, zone);
        }
        // Remove card location
        delete this.cardLocations[cardId];
        return {
            success: true,
            fromZone: zoneId,
            cardId,
        };
    }
    /**
     * Helper method to get card ID
     * Override this method to customize card ID extraction
     */
    getCardId(card) {
        if (typeof card === "object" && card.id) {
            return card.id;
        }
        return String(card);
    }
    /**
     * Clear all zones
     */
    clearAllZones() {
        for (const zone of Object.values(this.zones)) {
            zone.cards = [];
        }
        this.cardLocations = {};
    }
    /**
     * Get all zones
     */
    getAllZones() {
        return Object.values(this.zones);
    }
}
//# sourceMappingURL=zone-manager.js.map