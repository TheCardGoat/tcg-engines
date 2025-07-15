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
  // Zone operations
  getCardZone(instanceId: InstanceId): string | undefined;
  moveCard(params: {
    playerId: string;
    instanceId: InstanceId;
    to: string;
    from?: string;
  }): any;

  // Card queries
  queryCards(filter: any): CardData[];
  getCardData(instanceId: InstanceId): CardData | undefined;

  // Game state access
  getGameState(): any;
  getPlayerState(playerId: string): any;
}

/**
 * Base class for game-specific cards that use context injection
 * instead of storing engine references
 */
export abstract class GameCard<
  TDefinition extends { id: string; name?: string } = {
    id: string;
    name?: string;
  },
> {
  readonly instanceId: InstanceId;
  readonly ownerId: string;
  readonly definition: TDefinition;

  constructor(
    instanceId: InstanceId,
    ownerId: string,
    definition: TDefinition,
  ) {
    this.instanceId = instanceId;
    this.ownerId = ownerId;
    this.definition = definition;
  }

  // Game-agnostic properties (no context needed)
  get publicId(): string {
    return this.definition.id;
  }

  get name(): string {
    return this.definition.name || "";
  }

  // Context-dependent properties
  getZone(ctx: GameContext): string | undefined {
    return ctx.getCardZone(this.instanceId);
  }

  // Context-dependent operations
  moveTo(targetZone: string, ctx: GameContext): any {
    return ctx.moveCard({
      playerId: this.ownerId,
      instanceId: this.instanceId,
      to: targetZone,
    });
  }

  // Abstract methods that subclasses must implement
  abstract canBePlayed(ctx: GameContext): boolean;
  abstract getPlayCost(ctx: GameContext): number;

  // Optional methods that can be overridden
  canBeTargeted(ctx: GameContext): boolean {
    return true;
  }

  toString(): string {
    return `${this.name} (${this.instanceId})`;
  }
}
