import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
export class LorcanaCardInstance extends CoreCardInstance {
    constructor(engine, card, instanceId, ownerId) {
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
    get inkwell() {
        return this.card.inkwell;
    }
    /**
     * Get typed Lorcana engine reference
     * Uses base class WeakRef functionality
     */
    getLorcanaEngine() {
        return this.getEngine();
    }
    /**
     * Lorcana-specific functionality that requires engine access
     * Uses base class withEngine method for safe access
     */
    getLorcanaSpecificData() {
        return this.withEngine((engine) => ({
            // Add Lorcana-specific engine operations here when needed
            gameState: engine.getGameState(),
            availableInk: engine.getZonesCardCount(this.ownerId).inkwell,
            // Example Lorcana-specific methods
        }), "Cannot access Lorcana-specific data");
    }
    /**
     * Example of Lorcana-specific card behavior using engine
     */
    canBePlayed() {
        return this.withEngine((engine) => {
            const gameState = engine.getGameState();
            const availableInk = engine.getZonesCardCount(this.ownerId).inkwell;
            // Basic play validation - can be extended
            return (this.zone === "hand" &&
                availableInk >= this.card.cost &&
                gameState.ctx.currentPhase === "mainPhase");
        }, "Cannot check if card can be played");
    }
}
//# sourceMappingURL=lorcana-card-instance.js.map