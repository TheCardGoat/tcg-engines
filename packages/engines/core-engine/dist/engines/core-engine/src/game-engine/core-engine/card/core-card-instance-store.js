import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { getCardsByFilter } from "~/game-engine/core-engine/card/core-card-filter";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
// Read-only entity that provides rich information about cards' current state. With the help of CardInstance class it gives fresh information about each card.
export class CoreCardInstanceStore {
    repository;
    cardInstances = {};
    playerCardsIds;
    engineRef;
    constructor({ repository, engine, playerCardsIds, }) {
        this.repository = repository;
        this.engineRef = new WeakRef(engine);
        this.playerCardsIds = playerCardsIds;
        const contextProvider = new CoreCardCtxProvider({
            engine,
        });
        for (const [player, cards] of Object.entries(repository.dictionary)) {
            for (const cardInstanceId of Object.keys(cards)) {
                const cardDefinition = this.repository.getCardByInstanceId(cardInstanceId);
                if (cardDefinition) {
                    this.cardInstances[cardInstanceId] =
                        new CoreCardInstance({
                            instanceId: cardInstanceId,
                            ownerId: player,
                            definition: cardDefinition,
                            contextProvider,
                            engine,
                        });
                }
            }
        }
    }
    getCardByInstanceId(id) {
        return this.cardInstances[id];
    }
    getAllCards() {
        return Object.values(this.cardInstances);
    }
    queryCards(filter) {
        const engine = this.engineRef.deref();
        if (!engine) {
            throw new Error("Engine has been garbage collected - CoreCardInstanceStore cannot query cards");
        }
        return getCardsByFilter({
            state: engine.getState(),
            store: this,
            filter,
        });
    }
    /**
     * Check if the underlying engine is still available
     * Useful for debugging and error handling
     */
    isEngineAvailable() {
        return this.engineRef.deref() !== undefined;
    }
    /**
     * Get the engine reference if still available
     * Should be used sparingly and with proper null checking
     */
    getEngine() {
        return this.engineRef.deref();
    }
    /**
     * Gets the owner of a card by instance ID
     * @param instanceId The instance ID of the card
     * @returns The player ID who owns the card, or undefined if not found
     */
    getCardOwner(instanceId) {
        for (const player of Object.keys(this.playerCardsIds)) {
            if (this.playerCardsIds[player][instanceId]) {
                return player;
            }
        }
        return undefined;
    }
    /**
     * Gets access to all card instances as a dictionary
     * @returns Record of card instances indexed by instance ID
     */
    getCardInstances() {
        return this.cardInstances;
    }
}
//# sourceMappingURL=core-card-instance-store.js.map