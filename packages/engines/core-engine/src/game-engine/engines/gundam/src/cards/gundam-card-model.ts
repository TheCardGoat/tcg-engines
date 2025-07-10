import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { GundamEngine } from "~/game-engine/engines/gundam/src/gundam-engine";
import type { GundamitoCard } from "./definitions/cardTypes";

export class GundamModel extends CoreCardInstance<GundamitoCard> {
  constructor({
    engine,
    card,
    instanceId,
    ownerId,
  }: {
    engine: GundamEngine;
    card: GundamitoCard;
    instanceId: string;
    ownerId: string;
  }) {
    // Create a context provider that uses the engine's context
    const contextProvider = new CoreCardCtxProvider({
      engine: engine as any, // Type assertion needed due to generic complexity
    });

    super({
      instanceId,
      ownerId,
      definition: card,
      contextProvider,
      engine, // Pass engine to base class for WeakRef storage
    });
  }

  /**
   * Get typed Gundam engine reference
   * Uses base class WeakRef functionality
   */
  getGundamEngine(): GundamEngine | undefined {
    return this.getEngine<GundamEngine>();
  }

  /**
   * Gundam-specific functionality that requires engine access
   * Uses base class withEngine method for safe access
   */
  getGundamSpecificData(): any {
    return this.withEngine<GundamEngine>(
      (engine) => ({
        // Add Gundam-specific engine operations here when needed
        gameState: engine.getGameState(),
        availableHaro: engine.getZonesCardCount(this.ownerId).resourceArea,
        // Example Gundam-specific methods
      }),
      "Cannot access Gundam-specific data",
    );
  }

  /**
   * Example of Gundam-specific card behavior using engine
   */
  canBePlayed(): boolean {
    return this.withEngine<GundamEngine>((engine) => {
      const gameState = engine.getGameState();
      const availableHaro = engine.getZonesCardCount(this.ownerId).resourceArea;

      // Basic play validation - can be extended with Gundam-specific rules
      return (
        this.zone === "hand" &&
        availableHaro >= (this.card as any).cost &&
        gameState.ctx.currentPhase === "mainPhase"
      );
    }, "Cannot check if card can be played");
  }

  /**
   * Gundam-specific attachment logic
   */
  canAttachTo(targetCardId: string): boolean {
    return this.withEngine<GundamEngine>((engine) => {
      const targetCard =
        engine.cardInstanceStore.getCardByInstanceId(targetCardId);
      if (!targetCard) return false;

      // Example attachment logic - can be extended with Gundam-specific rules
      const isPilot = (this.card as any).cardType === "pilot";
      const targetIsUnit = (targetCard.card as any).cardType === "unit";

      return isPilot && targetIsUnit && targetCard.zone === "play";
    }, "Cannot check attachment compatibility");
  }

  // Additional Gundam-specific methods can be added here
  // while maintaining compatibility with CoreCardInstance interface
}
