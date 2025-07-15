import type { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import {
  ErrorFormatters,
  safeExecute,
} from "~/game-engine/core-engine/utils/error-utils";

export class CoreCardInstance<T extends { id: string } = { id: string }> {
  readonly instanceId: string;
  readonly ownerId: string;
  readonly card: T;
  readonly contextProvider: CoreCardCtxProvider;
  protected engineRef?: WeakRef<any>;

  constructor({
    instanceId,
    ownerId,
    definition,
    contextProvider,
    engine,
  }: {
    instanceId: string;
    ownerId: string;
    definition: T;
    contextProvider: CoreCardCtxProvider;
    engine?: any; // Optional engine reference for game-specific cards
  }) {
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

  get owner(): string | undefined {
    return this.ownerId;
  }

  get zone(): string | undefined {
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
  protected getEngine<TEngine = any>(): TEngine | undefined {
    return this.engineRef?.deref() as TEngine | undefined;
  }

  /**
   * Check if the underlying engine is still available
   * Useful for debugging and error handling
   */
  isEngineAvailable(): boolean {
    return this.engineRef?.deref() !== undefined;
  }

  /**
   * Execute a function with the engine if available
   * Provides safe access pattern for engine operations
   */
  protected withEngine<TEngine = any, TResult = any>(
    callback: (engine: TEngine) => TResult,
    errorMessage = "Engine has been garbage collected",
  ): TResult {
    return safeExecute(`withEngine:${this.instanceId}`, () => {
      const engine = this.getEngine<TEngine>();
      if (!engine) {
        throw new Error(
          ErrorFormatters.state(
            "Card",
            this.instanceId,
            `${errorMessage} - ${this.constructor.name}`,
          ),
        );
      }
      return callback(engine);
    });
  }

  // toJSON() {
  //   return {
  //     instanceId: this.instanceId,
  //     ownerId: this.ownerId,
  //     publicId: this.publicId,
  //     definition: this.definition,
  //     owner: this.owner,
  //     zone: this.zone,
  //   };
  // }
}
