import type { CoreEngine } from "~/game-engine/core-engine";
import { filterCoreCardInstances } from "~/game-engine/core-engine/card/card-filtering";
import type { CardRepository } from "~/game-engine/core-engine/card/card-repository-factory";
import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { InstanceId } from "~/game-engine/core-engine/types/core-types";
import type {
  BaseCoreCardFilter,
  DefaultGameState,
  DefaultPlayerState,
  GameSpecificCardFilter,
  GameSpecificGameState,
  GameSpecificPlayerState,
} from "~/game-engine/core-engine/types/game-specific-types";
import {
  ErrorFormatters,
  safeExecute,
} from "~/game-engine/core-engine/utils/error-utils";

export interface CoreCardDefinition {
  id: string;
}

// Read-only entity that provides rich information about cards' current state. With the help of CardInstance class it gives fresh information about each card.
export class CoreCardInstanceStore<
  CardDefinition extends CoreCardDefinition = { id: string },
  GameState extends GameSpecificGameState = DefaultGameState,
  PlayerState extends GameSpecificPlayerState = DefaultPlayerState,
  CardFilter extends GameSpecificCardFilter = BaseCoreCardFilter,
  CardModel extends
    CoreCardInstance<CardDefinition> = CoreCardInstance<CardDefinition>,
> {
  repository: CardRepository<CardDefinition>;
  private cardInstances: Record<InstanceId, CoreCardInstance<CardDefinition>> =
    {};
  readonly playerCardsIds: Record<string, Record<string, string>>;
  private engineRef: WeakRef<
    CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel>
  >;

  constructor({
    repository,
    engine,
    playerCardsIds,
  }: {
    repository: CardRepository<CardDefinition>;
    engine: CoreEngine<
      GameState,
      CardDefinition,
      PlayerState,
      CardFilter,
      CardModel
    >;
    playerCardsIds: Record<string, Record<string, string>>;
  }) {
    this.repository = repository;
    this.engineRef = new WeakRef(engine);
    this.playerCardsIds = playerCardsIds;

    const contextProvider = new CoreCardCtxProvider({
      engine,
    });

    for (const [player, cards] of Object.entries(repository.dictionary)) {
      for (const cardInstanceId of Object.keys(cards)) {
        const cardDefinition =
          this.repository.getCardByInstanceId(cardInstanceId);
        if (cardDefinition) {
          this.cardInstances[cardInstanceId] =
            new CoreCardInstance<CardDefinition>({
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

  getCardByInstanceId(id: string): CoreCardInstance | null {
    return this.cardInstances[id];
  }

  getAllCards() {
    return Object.values(this.cardInstances);
  }

  queryCards(filter: CardFilter): CardModel[] {
    return safeExecute("queryCards", () => {
      const engine = this.engineRef.deref();
      if (!engine) {
        throw new Error(
          ErrorFormatters.state(
            "Engine",
            "reference",
            "Engine has been garbage collected - CoreCardInstanceStore cannot query cards",
          ),
        );
      }

      const results = filterCoreCardInstances({
        state: engine.getState(),
        store: this,
        filter,
      });

      // Safe cast: Game engines initialize card models with proper types during engine initialization
      // The card instances in the store should already be of the correct CardModel type
      return results as CardModel[];
    });
  }

  /**
   * Check if the underlying engine is still available
   * Useful for debugging and error handling
   */
  isEngineAvailable(): boolean {
    return this.engineRef.deref() !== undefined;
  }

  /**
   * Get the engine reference if still available
   * Should be used sparingly and with proper null checking
   */
  getEngine():
    | CoreEngine<GameState, CardDefinition, PlayerState, CardFilter, CardModel>
    | undefined {
    return this.engineRef.deref();
  }

  /**
   * Gets the owner of a card by instance ID
   * @param instanceId The instance ID of the card
   * @returns The player ID who owns the card, or undefined if not found
   */
  getCardOwner(instanceId: string): string | undefined {
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
  getCardInstances(): Record<string, CoreCardInstance<CardDefinition>> {
    return this.cardInstances;
  }
}
