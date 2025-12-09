import type { CoreEngine } from "~/game-engine/core-engine/engine/core-engine";
import { type ZoneOperationError } from "~/game-engine/core-engine/engine/zone-operation";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import type { BaseCoreCardFilter, DefaultCardDefinition, DefaultPlayerState, GameSpecificCardDefinition, GameSpecificCardFilter, GameSpecificGameState, GameSpecificPlayerState } from "~/game-engine/engines/grand-archive/grand-archive-engine-types";
import type { CoreCardInstance } from "../card/core-card-instance";
export declare class CoreOperation<G extends GameSpecificGameState, CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition, PlayerState extends GameSpecificPlayerState = DefaultPlayerState, CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter, CardInstance extends CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>> {
    state: CoreEngineState<G>;
    private engine;
    constructor({ state, engine, }: {
        state: CoreEngineState<G>;
        engine: CoreEngine<G, CardDefinition, PlayerState, CardFilter, CardInstance>;
    });
    /**
     * Check if engine is available for operations that require it
     * @returns true if engine is available, false otherwise
     */
    private hasEngine;
    setOTP(playerId: string): void;
    setPendingMulligan(playerIds?: string[]): void;
    playerHasMulliganed(playerId: string): void;
    setPendingChampionSelection(playerIds?: string[]): void;
    playerHasSelectedChampion(playerId: string): void;
    getPlayers(): string[];
    setPriorityPlayer(playerId: string): void;
    setTurnPlayer(playerId: string): void;
    passPriority(): void;
    getZone(zoneId: string, playerId?: string): import("~/game-engine/core-engine/engine/zone-operation").Zone;
    shuffleZone(zoneId: string, playerId?: string): void;
    /**
     * Get a card instance by its instance ID
     * @param instanceId The instance ID of the card to retrieve
     * @returns The card instance if found and engine is available, otherwise null
     */
    getCardInstance(instanceId: string): CoreCardInstance<{
        id: string;
    }>;
    /**
     * Query cards based on filter criteria
     * @param filter Filter criteria for cards
     * @returns Array of matching cards if engine is available, otherwise empty array
     */
    queryCards(filter: any): CardInstance[];
    /**
     * Get cards in a specific zone
     * @param zoneName The zone name to look in
     * @param playerId Optional player ID to filter by
     * @returns Array of cards in the zone if engine is available, otherwise empty array
     */
    getCardsInZone(zoneName: string, playerId?: string): CardInstance[];
    /**
     * Get the owner of a card
     * @param instanceId The instance ID of the card
     * @returns The owner's player ID if found and engine is available, otherwise undefined
     */
    getCardOwner(instanceId: string): string;
    /**
     * Get the zone of a card
     * @param instanceId The instance ID of the card
     * @returns The zone name if found and engine is available, otherwise undefined
     */
    getCardZone(instanceId: string): string;
    moveCard({ playerId, from, to, origin, destination, instanceId, }: {
        playerId: string;
        instanceId?: string;
        from?: string;
        to?: string;
        origin?: "start" | "end";
        destination?: "start" | "end";
    }): ZoneOperationError | undefined;
    concede(playerId: string): void;
    incrementTurnCount(): void;
    getTurnCount(): number;
    debug(): void;
}
//# sourceMappingURL=core-operation.d.ts.map