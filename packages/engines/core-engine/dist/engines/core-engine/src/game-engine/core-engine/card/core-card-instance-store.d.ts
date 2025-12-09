import type { CoreEngine } from "~/game-engine/core-engine";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { BaseCoreCardFilter, DefaultGameState, DefaultPlayerState, GameSpecificCardFilter, GameSpecificGameState, GameSpecificPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
export interface CoreCardDefinition {
    id: string;
}
export declare class CoreCardInstanceStore<CardDefinition extends CoreCardDefinition = {
    id: string;
}, GameState extends GameSpecificGameState = DefaultGameState, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardModel extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>> {
    repository: CardRepository<CardDefinition>;
    private cardInstances;
    readonly playerCardsIds: Record<string, Record<string, string>>;
    private engineRef;
    constructor({ repository, engine, playerCardsIds, }: {
        repository: CardRepository<CardDefinition>;
        engine: CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel>;
        playerCardsIds: Record<string, Record<string, string>>;
    });
    getCardByInstanceId(id: string): CoreCardInstance | null;
    getAllCards(): CoreCardInstance<CardDefinition>[];
    queryCards(filter: any): CoreCardInstance<{
        id: string;
    }>[];
    /**
     * Check if the underlying engine is still available
     * Useful for debugging and error handling
     */
    isEngineAvailable(): boolean;
    /**
     * Get the engine reference if still available
     * Should be used sparingly and with proper null checking
     */
    getEngine(): CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel> | undefined;
    /**
     * Gets the owner of a card by instance ID
     * @param instanceId The instance ID of the card
     * @returns The player ID who owns the card, or undefined if not found
     */
    getCardOwner(instanceId: string): string | undefined;
    /**
     * Gets access to all card instances as a dictionary
     * @returns Record of card instances indexed by instance ID
     */
    getCardInstances(): Record<string, CoreCardInstance<CardDefinition>>;
}
//# sourceMappingURL=core-card-instance-store.d.ts.map