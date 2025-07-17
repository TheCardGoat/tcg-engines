import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { LorcanaEngine } from "../lorcana-engine";
import type { LorcanaCardMeta } from "../lorcana-engine-types";
import type { LorcanaCardDefinition } from "./lorcana-card-repository";

export class LorcanaCardInstance extends CoreCardInstance<LorcanaCardDefinition> {
  constructor(
    engine: LorcanaEngine,
    card: LorcanaCardDefinition,
    instanceId: string,
    ownerId: string,
  ) {
    const contextProvider = new CoreCardCtxProvider({
      engine: engine as any, // Type assertion needed due to generic complexity
    });

    super({
      instanceId,
      ownerId,
      definition: card,
      contextProvider,
      engine,
    });
  }

  get inkwell(): boolean {
    return this.card.inkwell;
  }

  /**
   * Get typed Lorcana engine reference
   * Uses base class WeakRef functionality
   */
  getLorcanaEngine(): LorcanaEngine | undefined {
    return this.getEngine<LorcanaEngine>();
  }

  /**
   * Lorcana-specific functionality that requires engine access
   * Uses base class withEngine method for safe access
   */
  getLorcanaSpecificData(): any {
    return this.withEngine<LorcanaEngine>(
      (engine) => ({
        // Add Lorcana-specific engine operations here when needed
        gameState: engine.getGameState(),
        availableInk: engine.getZonesCardCount(this.ownerId).inkwell,
        // Example Lorcana-specific methods
      }),
      "Cannot access Lorcana-specific data",
    );
  }

  /**
   * Example of Lorcana-specific card behavior using engine
   */
  canBePlayed(): boolean {
    return this.withEngine<LorcanaEngine>((engine) => {
      const gameState = engine.getGameState();
      const availableInk = engine.getZonesCardCount(this.ownerId).inkwell;

      // Basic play validation - can be extended
      return (
        this.zone === "hand" &&
        availableInk >= (this.card as any).cost &&
        gameState.ctx.currentPhase === "mainPhase"
      );
    }, "Cannot check if card can be played");
  }

  get meta(): LorcanaCardMeta {
    return this.getLorcanaEngine()?.getCardMeta(this.instanceId) || {};
  }

  isAtLocation(location: LorcanaCardInstance): boolean {
    return this.meta.location === location.instanceId;
  }

  containsCharacter(character: LorcanaCardInstance): boolean {
    return this.meta.characters?.includes(character.instanceId);
  }
}
