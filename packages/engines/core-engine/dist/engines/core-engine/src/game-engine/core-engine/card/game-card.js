/**
 * Base class for game-specific cards that use context injection
 * instead of storing engine references
 */
export class GameCard {
    instanceId;
    ownerId;
    definition;
    constructor(instanceId, ownerId, definition) {
        this.instanceId = instanceId;
        this.ownerId = ownerId;
        this.definition = definition;
    }
    // Game-agnostic properties (no context needed)
    get publicId() {
        return this.definition.id;
    }
    get name() {
        return this.definition.name || "";
    }
    // Context-dependent properties
    getZone(ctx) {
        return ctx.getCardZone(this.instanceId);
    }
    // Context-dependent operations
    moveTo(targetZone, ctx) {
        return ctx.moveCard({
            playerId: this.ownerId,
            instanceId: this.instanceId,
            to: targetZone,
        });
    }
    // Optional methods that can be overridden
    canBeTargeted(ctx) {
        return true;
    }
    toString() {
        return `${this.name} (${this.instanceId})`;
    }
}
//# sourceMappingURL=game-card.js.map