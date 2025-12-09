export class CoreCardInstance {
    instanceId;
    ownerId;
    card;
    contextProvider;
    engineRef;
    constructor({ instanceId, ownerId, definition, contextProvider, engine, }) {
        this.instanceId = instanceId;
        this.ownerId = ownerId;
        this.card = definition;
        this.contextProvider = contextProvider;
        // Store engine as WeakRef if provided
        if (engine) {
            this.engineRef = new WeakRef(engine);
        }
    }
    get publicId() {
        return this.card.id;
    }
    get owner() {
        return this.ownerId;
    }
    get zone() {
        const ctx = this.contextProvider.getCtx();
        // Find the zone that contains this card instance
        for (const zoneId in ctx.cardZones) {
            const zone = ctx.cardZones[zoneId];
            if (zone.cards.includes(this.instanceId)) {
                return zone.name;
            }
        }
        return undefined;
    }
    /**
     * Get the engine reference if still available
     * Should be used sparingly and with proper null checking
     */
    getEngine() {
        return this.engineRef?.deref();
    }
    /**
     * Check if the underlying engine is still available
     * Useful for debugging and error handling
     */
    isEngineAvailable() {
        return this.engineRef?.deref() !== undefined;
    }
    /**
     * Execute a function with the engine if available
     * Provides safe access pattern for engine operations
     */
    withEngine(callback, errorMessage = "Engine has been garbage collected") {
        const engine = this.getEngine();
        if (!engine) {
            throw new Error(`${errorMessage} - ${this.constructor.name}`);
        }
        return callback(engine);
    }
}
//# sourceMappingURL=core-card-instance.js.map