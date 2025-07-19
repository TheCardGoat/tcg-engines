import { CoreCardCtxProvider } from "~/game-engine/core-engine/card/core-card-ctx-provider";
import { CoreCardInstance } from "~/game-engine/core-engine/card/core-card-instance";
import type { GundamEngine } from "~/game-engine/engines/gundam/src/gundam-engine";
import type { GundamitoCard } from "./definitions/cardTypes";

export class GundamModel extends CoreCardInstance<GundamitoCard> {
  engine: GundamEngine;
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
    });
    // Optionally store engine reference if needed for GundamModel
    this.engine = engine;
  }

  getGundamEngine(): GundamEngine | undefined {
    return this.engine;
  }

  getGundamSpecificData(): any {
    // Add Gundam-specific engine operations here when needed
    return {};
  }

  canBePlayed(): boolean {
    if (!this.engine) return false;
    const gameState = this.engine.getGameState();
    const availableHaro = this.engine.getZonesCardCount(
      this.ownerId,
    ).resourceArea;
    return (
      this.zone === "hand" &&
      availableHaro >= (this.card as any).cost &&
      gameState.ctx.currentPhase === "mainPhase"
    );
  }

  canAttachTo(targetCardId: string): boolean {
    if (!this.engine) return false;
    const targetCard =
      this.engine.cardInstanceStore.getCardByInstanceId(targetCardId);
    if (!targetCard) return false;
    const isPilot = (this.card as any).cardType === "pilot";
    const targetIsUnit = (targetCard.card as any).cardType === "unit";
    return isPilot && targetIsUnit && targetCard.zone === "play";
  }

  // Additional Gundam-specific methods can be added here
  // while maintaining compatibility with CoreCardInstance interface
}
