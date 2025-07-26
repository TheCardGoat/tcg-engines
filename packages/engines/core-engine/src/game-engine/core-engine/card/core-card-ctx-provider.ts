import type { CoreEngine } from "~/game-engine/core-engine";
import type {
  BaseCoreCardFilter,
  DefaultCardDefinition,
  DefaultCardMeta,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardDefinition,
  GameSpecificCardFilter,
  GameSpecificCardMeta,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import {
  ErrorFormatters,
  safeExecute,
} from "~/game-engine/core-engine/utils/error-utils";
import type { CoreCardInstance } from "./core-card-instance";

export class CoreCardCtxProvider<
  GameState extends GameSpecificGameState = DefaultGameState,
  CardDefinition extends GameSpecificCardDefinition = DefaultCardDefinition,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardMeta extends GameSpecificCardMeta = DefaultCardMeta,
  CardModel extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  private engineRef: WeakRef<
    CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardMeta,
      CardModel
    >
  >;

  constructor({
    engine,
  }: {
    engine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardMeta,
      CardModel
    >;
  }) {
    this.engineRef = new WeakRef(engine);
  }

  getCtx() {
    return safeExecute("getGameCtx", () => {
      const engine = this.engineRef.deref();
      if (!engine) {
        throw new Error(
          ErrorFormatters.state(
            "Engine",
            "context",
            "Engine has been garbage collected - CoreCardCtxProvider cannot access context",
          ),
        );
      }
      return engine.getGameState().ctx;
    });
  }

  getG() {
    return safeExecute("getGameState", () => {
      const engine = this.engineRef.deref();
      if (!engine) {
        throw new Error(
          ErrorFormatters.state(
            "Engine",
            "context",
            "Engine has been garbage collected - CoreCardCtxProvider cannot access context",
          ),
        );
      }
      return engine.getGameState().G;
    });
  }

  getCardInstance(instanceId: string): CardModel | undefined {
    return safeExecute("getCardInstance", () => {
      const engine = this.engineRef.deref();
      if (!engine) {
        throw new Error(
          ErrorFormatters.state(
            "Engine",
            "context",
            "Engine has been garbage collected - CoreCardCtxProvider cannot access context",
          ),
        );
      }

      return engine.getCardByInstanceId(instanceId);
    });
  }

  /**
   * Check if the underlying engine is still available
   * Useful for debugging and error handling
   */
  isEngineAvailable(): boolean {
    return this.engineRef.deref() !== undefined;
  }
}
