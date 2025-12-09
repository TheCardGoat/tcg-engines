import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
export class GundamModel extends CoreCardInstance {
    constructor({ engine, card, instanceId, ownerId, }) {
        // Create a context provider that uses the engine's context
        const contextProvider = new CoreCardCtxProvider({
            engine: engine, // Type assertion needed due to generic complexity
        });
        super({
            instanceId,
            ownerId,
            definition: card,
            contextProvider,
            engine, // Pass engine to base class for WeakRef storage
        });
    }
    /**
     * Get typed Gundam engine reference
     * Uses base class WeakRef functionality
     */
    getGundamEngine() {
        return this.getEngine();
    }
    /**
     * Gundam-specific functionality that requires engine access
     * Uses base class withEngine method for safe access
     */
    getGundamSpecificData() {
        return this.withEngine((engine) => ({
            // Add Gundam-specific engine operations here when needed
            gameState: engine.getGameState(),
            availableHaro: engine.getZonesCardCount(this.ownerId).resourceArea,
            // Example Gundam-specific methods
        }), "Cannot access Gundam-specific data");
    }
    /**
     * Example of Gundam-specific card behavior using engine
     */
    canBePlayed() {
        return this.withEngine((engine) => {
            const gameState = engine.getGameState();
            const availableHaro = engine.getZonesCardCount(this.ownerId).resourceArea;
            // Basic play validation - can be extended with Gundam-specific rules
            return (this.zone === "hand" &&
                availableHaro >= this.card.cost &&
                gameState.ctx.currentPhase === "mainPhase");
        }, "Cannot check if card can be played");
    }
    /**
     * Gundam-specific attachment logic
     */
    canAttachTo(targetCardId) {
        return this.withEngine((engine) => {
            const targetCard = engine.cardInstanceStore.getCardByInstanceId(targetCardId);
            if (!targetCard)
                return false;
            // Example attachment logic - can be extended with Gundam-specific rules
            const isPilot = this.card.cardType === "pilot";
            const targetIsUnit = targetCard.card.cardType === "unit";
            return isPilot && targetIsUnit && targetCard.zone === "play";
        }, "Cannot check attachment compatibility");
    }
}
//# sourceMappingURL=gundam-card-model.js.map