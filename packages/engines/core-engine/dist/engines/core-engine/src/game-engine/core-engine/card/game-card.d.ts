import type { InstanceId } from "~/game-engine/core-engine/types/core-types";
/**
 * Lightweight card data structure that holds basic card information
 * without engine references to avoid performance issues
 */
export interface CardData<TDefinition = any> {
    instanceId: InstanceId;
    ownerId: string;
    definition: TDefinition;
}
/**
 * Context interface that provides engine operations to cards
 * This is injected into card methods rather than stored as references
 */
export interface GameContext {
    getCardZone(instanceId: InstanceId): string | undefined;
    moveCard(params: {
        playerId: string;
        instanceId: InstanceId;
        to: string;
        from?: string;
    }): any;
    queryCards(filter: any): CardData[];
    getCardData(instanceId: InstanceId): CardData | undefined;
    getGameState(): any;
    getPlayerState(playerId: string): any;
}
/**
 * Base class for game-specific cards that use context injection
 * instead of storing engine references
 */
export declare abstract class GameCard<TDefinition extends {
    id: string;
    name?: string;
} = {
    id: string;
    name?: string;
}> {
    readonly instanceId: InstanceId;
    readonly ownerId: string;
    readonly definition: TDefinition;
    constructor(instanceId: InstanceId, ownerId: string, definition: TDefinition);
    get publicId(): string;
    get name(): string;
    getZone(ctx: GameContext): string | undefined;
    moveTo(targetZone: string, ctx: GameContext): any;
    abstract canBePlayed(ctx: GameContext): boolean;
    abstract getPlayCost(ctx: GameContext): number;
    canBeTargeted(ctx: GameContext): boolean;
    toString(): string;
}
//# sourceMappingURL=game-card.d.ts.map